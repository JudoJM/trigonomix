const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Configuración básica del servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '/')));

// Almacenamiento de salas y datos de juego
const rooms = {};

// Gestión de conexiones con Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado:', socket.id);

    // Evento para crear una sala
    socket.on('createRoom', ({ playerName, totalQuestions }) => {
        // Generar código de sala alfanumérico (longitud 6)
        const roomCode = generateRoomCode();
        
        // Crear sala nueva
        rooms[roomCode] = {
            players: [{
                id: socket.id,
                name: playerName,
                score: 0,
                isHost: true,
                correctAnswers: 0,
                incorrectAnswers: 0
            }],
            gameState: {
                isActive: false,
                currentQuestionIndex: 0,
                currentTurn: 0, // Índice del jugador actual
                questions: [],
                totalQuestions: totalQuestions || 20, // Usar el valor recibido o 20 por defecto
                timerValue: 15
            }
        };
        
        // Unir socket a la sala
        socket.join(roomCode);
        
        // Enviar confirmación al cliente
        socket.emit('roomCreated', {
            roomCode,
            playerInfo: {
                id: socket.id,
                name: playerName,
                isHost: true
            },
            totalQuestions: rooms[roomCode].gameState.totalQuestions
        });
        
        console.log(`Sala creada: ${roomCode} por ${playerName}`);
    });

    // Evento para unirse a una sala
    socket.on('joinRoom', ({ roomCode, playerName }) => {
        // Verificar si la sala existe
        if (!rooms[roomCode]) {
            socket.emit('joinError', { message: 'Sala no encontrada' });
            return;
        }
        
        // Verificar si la sala ya está llena (máximo 2 jugadores)
        if (rooms[roomCode].players.length >= 2) {
            socket.emit('joinError', { message: 'La sala está llena' });
            return;
        }
        
        // Añadir jugador a la sala
        const playerInfo = {
            id: socket.id,
            name: playerName,
            score: 0,
            isHost: false,
            correctAnswers: 0,
            incorrectAnswers: 0
        };
        
        rooms[roomCode].players.push(playerInfo);
        
        // Unir socket a la sala
        socket.join(roomCode);
        
        // Enviar confirmación al cliente, incluyendo totalQuestions
        socket.emit('roomJoined', {
            roomCode,
            playerInfo,
            totalQuestions: rooms[roomCode].gameState.totalQuestions
        });
        
        // Notificar al host que un jugador se ha unido
        socket.to(roomCode).emit('playerJoined', {
            player: playerInfo
        });
        
        console.log(`${playerName} se unió a la sala: ${roomCode}`);
    });

    // Evento cuando un jugador está listo
    socket.on('playerReady', ({ roomCode }) => {
        // Si no existe la sala, ignorar
        if (!rooms[roomCode]) return;

        // Notificar a todos en la sala que este jugador está listo
        io.to(roomCode).emit('playerReady', { playerId: socket.id });
        
        // Verificar si todos los jugadores están listos
        const roomData = rooms[roomCode];
        const readyPlayers = roomData.players.filter(p => p.ready).length;
        
        if (roomData.players.length === 2 && readyPlayers === 2) {
            // Iniciar juego
            startGame(roomCode);
        }
    });

    // Evento para configurar el juego desde el host
    socket.on('setupGame', ({ roomCode, totalQuestions }) => {
        // Si no existe la sala, ignorar
        if (!rooms[roomCode]) return;
        
        // Actualizar configuración del juego
        rooms[roomCode].gameState.totalQuestions = totalQuestions || 20;
        
        // Notificar a todos en la sala
        io.to(roomCode).emit('gameSetup', {
            totalQuestions: rooms[roomCode].gameState.totalQuestions
        });
    });

    // Evento para iniciar el juego
    socket.on('startGame', ({ roomCode, questions }) => {
        // Si no existe la sala, ignorar
        if (!rooms[roomCode]) return;
        
        // Guardar preguntas
        rooms[roomCode].gameState.questions = questions;
        
        // Iniciar juego
        startGame(roomCode);
    });

    // Evento para respuesta de jugador
    socket.on('playerAnswer', ({ roomCode, isCorrect, timeTaken }) => {
        // Si no existe la sala, ignorar
        if (!rooms[roomCode]) return;
        
        const room = rooms[roomCode];
        
        // Encontrar al jugador actual
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex === -1) return;
        
        const player = room.players[playerIndex];
        
        // Actualizar puntaje y estadísticas del jugador
        if (isCorrect) {
            player.score += 10;
            player.correctAnswers++;
        } else {
            player.incorrectAnswers++;
        }
        
        // Notificar a todos sobre la respuesta
        io.to(roomCode).emit('answerResult', {
            playerId: socket.id,
            isCorrect,
            newScore: player.score,
            correctAnswers: player.correctAnswers,
            incorrectAnswers: player.incorrectAnswers
        });
        
        // Pasar al siguiente turno/pregunta
        nextTurn(roomCode);
    });

    // Evento para cuando se agota el tiempo
    socket.on('timeOut', ({ roomCode }) => {
        // Si no existe la sala, ignorar
        if (!rooms[roomCode]) return;
        
        const room = rooms[roomCode];
        
        // Encontrar al jugador actual
        const currentPlayerIndex = room.gameState.currentTurn;
        const currentPlayer = room.players[currentPlayerIndex];
        
        // Actualizar estadísticas del jugador (respuesta incorrecta por tiempo)
        currentPlayer.incorrectAnswers++;
        
        // Notificar a todos sobre el timeout
        io.to(roomCode).emit('playerTimeOut', {
            playerId: currentPlayer.id
        });
        
        // Pasar al siguiente turno/pregunta
        nextTurn(roomCode);
    });

    // Evento de desconexión de un jugador
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        
        // Buscar en qué sala estaba el jugador
        Object.keys(rooms).forEach(roomCode => {
            const room = rooms[roomCode];
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            
            if (playerIndex !== -1) {
                // Notificar a los demás jugadores
                socket.to(roomCode).emit('playerDisconnected', {
                    playerId: socket.id
                });
                
                // Manejar abandono
                handlePlayerDisconnect(roomCode, socket.id);
            }
        });
    });

    // Evento para jugar de nuevo
    socket.on('playAgain', ({ roomCode }) => {
        // Si no existe la sala, ignorar
        if (!rooms[roomCode]) return;
        
        // Verificar que sea el host quien solicita jugar de nuevo
        const room = rooms[roomCode];
        const isHost = room.players.some(p => p.id === socket.id && p.isHost);
        
        if (isHost) {
            // Reiniciar estadísticas de jugadores
            room.players.forEach(player => {
                player.score = 0;
                player.correctAnswers = 0;
                player.incorrectAnswers = 0;
            });
            
            // Reiniciar estado del juego
            room.gameState.isActive = false;
            room.gameState.currentQuestionIndex = 0;
            room.gameState.currentTurn = 0;
            
            // Notificar a todos los jugadores
            io.to(roomCode).emit('gameReset');
        }
    });
});

// Función para iniciar el juego
function startGame(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;
    
    // Activar el juego
    room.gameState.isActive = true;
    room.gameState.currentQuestionIndex = 0;
    room.gameState.currentTurn = 0;
    
    // Notificar inicio del juego
    io.to(roomCode).emit('gameStarted', {
        firstPlayerId: room.players[0].id,
        question: getNextQuestion(roomCode),
        players: room.players // Enviar info de ambos jugadores
    });
}

// Función para pasar al siguiente turno y/o pregunta
function nextTurn(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;
    
    const gameState = room.gameState;
    
    // Cambiar turno
    gameState.currentTurn = (gameState.currentTurn + 1) % room.players.length;
    
    // Si se han completado todos los turnos, pasar a la siguiente pregunta
    if (gameState.currentTurn === 0) {
        gameState.currentQuestionIndex++;
    }
    
    // Verificar si se han completado todas las preguntas
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endGame(roomCode);
        return;
    }
    
    // Obtener siguiente pregunta
    const nextQuestion = getNextQuestion(roomCode);
    
    // Notificar a todos los jugadores
    io.to(roomCode).emit('nextTurn', {
        currentPlayerId: room.players[gameState.currentTurn].id,
        currentQuestionIndex: gameState.currentQuestionIndex,
        question: nextQuestion,
        players: room.players // Enviar info de ambos jugadores
    });
}

// Función para obtener la pregunta actual
function getNextQuestion(roomCode) {
    const room = rooms[roomCode];
    if (!room) return null;
    
    const gameState = room.gameState;
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        return null;
    }
    
    return gameState.questions[gameState.currentQuestionIndex];
}

// Función para finalizar el juego
function endGame(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;
    
    // Desactivar el juego
    room.gameState.isActive = false;
    
    // Determinar ganador
    let winner = null;
    let isTie = false;
    
    if (room.players.length === 2) {
        if (room.players[0].score > room.players[1].score) {
            winner = room.players[0];
        } else if (room.players[0].score < room.players[1].score) {
            winner = room.players[1];
        } else {
            isTie = true;
        }
    }
    
    // Notificar fin del juego
    io.to(roomCode).emit('gameEnded', {
        players: room.players,
        winner: winner ? {
            id: winner.id,
            name: winner.name,
            score: winner.score
        } : null,
        isTie
    });
}

// Función para manejar desconexión de jugador
function handlePlayerDisconnect(roomCode, playerId) {
    const room = rooms[roomCode];
    if (!room) return;
    
    // Encontrar índice del jugador
    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    // Determinar si era el host
    const wasHost = room.players[playerIndex].isHost;
    
    // Eliminar al jugador
    room.players.splice(playerIndex, 1);
    
    // Si no quedan jugadores, eliminar sala
    if (room.players.length === 0) {
        delete rooms[roomCode];
        return;
    }
    
    // Si era el host y quedan otros jugadores, transferir host
    if (wasHost && room.players.length > 0) {
        room.players[0].isHost = true;
        // Notificar nuevo host
        io.to(roomCode).emit('newHost', {
            newHostId: room.players[0].id
        });
    }
    
    // Si el juego estaba activo, finalizarlo
    if (room.gameState.isActive) {
        room.gameState.isActive = false;
        io.to(roomCode).emit('gameAborted', {
            reason: 'Un jugador se desconectó'
        });
    }
}

// Función para generar código de sala aleatorio
function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Verificar que no exista ya
    if (rooms[result]) return generateRoomCode();
    return result;
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});