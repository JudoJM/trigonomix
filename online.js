// Modo Multijugador Online para Trigonomix
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM para el modo online
    const onlineButton = document.getElementById('online-button');
    const createRoomButton = document.getElementById('create-room-button');
    const joinRoomButton = document.getElementById('join-room-button');
    const createRoomConfirmButton = document.getElementById('create-room-confirm-button');
    const joinRoomConfirmButton = document.getElementById('join-room-confirm-button');
    const startOnlineGameButton = document.getElementById('start-online-game-button');
    const leaveRoomButton = document.getElementById('leave-room-button');
    const copyRoomCodeButton = document.getElementById('copy-room-code');
    const roomCodeInput = document.getElementById('room-code-input');
    const roomCodeDisplay = document.getElementById('room-code-display');
    const joinRoomError = document.getElementById('join-room-error');
    const hostPlayerName = document.getElementById('host-player-name');
    const guestPlayerName = document.getElementById('guest-player-name');
    const guestPlayerItem = document.getElementById('guest-player-item');
    const questionsCountDisplay = document.getElementById('questions-count');
    const onlinePlayAgainButton = document.getElementById('online-play-again-button');
    const onlineBackToLobbyButton = document.getElementById('online-back-to-lobby-button');
    const retryConnectionButton = document.getElementById('retry-connection-button');
    
    // Elementos de la pantalla de juego online
    const onlineTurnIndicator = document.getElementById('online-turn-indicator');
    const onlineCurrentPlayerName = document.getElementById('online-current-player-name');
    const onlineQuestionCounter = document.getElementById('online-question-counter');
    const onlineTimerValue = document.getElementById('online-timer-value');
    const onlineTimer = document.getElementById('online-timer');
    const onlinePlayer1Name = document.getElementById('online-player1-name');
    const onlinePlayer2Name = document.getElementById('online-player2-name');
    const onlinePlayer1Points = document.getElementById('online-player1-points');
    const onlinePlayer2Points = document.getElementById('online-player2-points');
    const onlinePlayer1Score = document.getElementById('online-player1-score');
    const onlinePlayer2Score = document.getElementById('online-player2-score');
    const onlineQuestionText = document.getElementById('online-question-text');
    const onlineQuestionImage = document.getElementById('online-question-image');
    const onlineImageValueInfo = document.getElementById('online-image-value-info');
    const onlineOptionsContainer = document.getElementById('online-options-container');
    const onlineFeedbackText = document.getElementById('online-feedback-text');
    
    // Elementos para pantalla de resultados
    const onlineWinnerContainer = document.getElementById('online-winner-container');
    const onlineResultPlayer1Name = document.getElementById('online-result-player1-name');
    const onlineResultPlayer2Name = document.getElementById('online-result-player2-name');
    const onlinePlayer1FinalPoints = document.getElementById('online-player1-final-points');
    const onlinePlayer2FinalPoints = document.getElementById('online-player2-final-points');
    const onlinePlayer1CorrectAnswers = document.getElementById('online-player1-correct-answers');
    const onlinePlayer2CorrectAnswers = document.getElementById('online-player2-correct-answers');
    const onlinePlayer1IncorrectAnswers = document.getElementById('online-player1-incorrect-answers');
    const onlinePlayer2IncorrectAnswers = document.getElementById('online-player2-incorrect-answers');
    
    // Función existente para mostrar pantallas
    function showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        let foundActive = false;
        screens.forEach(screen => {
            if (screen.id === screenId) {
                setTimeout(() => screen.classList.add('active'), 50);
                foundActive = true;
            } else {
                screen.classList.remove('active');
            }
        });
        if (!foundActive) {
            console.error("Screen not found:", screenId);
        }
    }
    
    // Estado del juego online
    let onlineGameState = {
        connected: false,
        socket: null,
        roomCode: null,
        playerInfo: null,
        otherPlayerInfo: null,
        isHost: false,
        gameActive: false,
        currentQuestion: null,
        totalQuestions: 20,
        currentQuestionIndex: 0,
        isMyTurn: false,
        timerInterval: null,
        timerValue: 15
    };
    
    // Inicializar conexión Socket.io
    function initSocketConnection() {
        if (!onlineGameState.socket) {
            try {
                onlineGameState.socket = io();
            } catch (e) {
                console.error('No se pudo inicializar la conexión Socket.io:', e);
                return;
            }
        }
        if (!onlineGameState.socket) {
            console.error('Socket no está inicializado.');
            return;
        }
        // Listener para cierre de sala por parte del host
        onlineGameState.socket.on('roomClosed', (data) => {
            alert(data.reason || 'La sala ha sido cerrada.');
            // Limpiar el estado local antes de salir
            onlineGameState.roomCode = null;
            onlineGameState.playerInfo = null;
            onlineGameState.otherPlayerInfo = null;
            onlineGameState.isHost = false;
            onlineGameState.gameActive = false;
            onlineGameState.currentQuestion = null;
            onlineGameState.currentQuestionIndex = 0;
            onlineGameState.isMyTurn = false;
            // Redirigir fuera de la sala
            window.location.href = '/'; // O la ruta de inicio adecuada
        });
        // Escuchar evento de actualización de puntaje en tiempo real
        onlineGameState.socket.on('answerResult', ({ playerId, isCorrect, newScore, correctAnswers, incorrectAnswers }) => {
            // Actualizar los datos de los jugadores según el id
            if (onlineGameState.playerInfo && playerId === onlineGameState.playerInfo.id) {
                onlineGameState.playerInfo.score = newScore;
                onlineGameState.playerInfo.correctAnswers = correctAnswers;
                onlineGameState.playerInfo.incorrectAnswers = incorrectAnswers;
            } else if (onlineGameState.otherPlayerInfo && playerId === onlineGameState.otherPlayerInfo.id) {
                onlineGameState.otherPlayerInfo.score = newScore;
                onlineGameState.otherPlayerInfo.correctAnswers = correctAnswers;
                onlineGameState.otherPlayerInfo.incorrectAnswers = incorrectAnswers;
            }
            // Forzar actualización de ambos jugadores en la UI
            updateOnlinePlayersUI();

            // Animación de puntaje actualizado
            // Mostrar animación en ambos lados para asegurar feedback visual
            if (onlineGameState.isHost) {
                animateScoreUpdate(onlinePlayer1Points);
                animateScoreUpdate(onlinePlayer2Points);
            } else {
                animateScoreUpdate(onlinePlayer1Points);
                animateScoreUpdate(onlinePlayer2Points);
            }
        });
        try {
            // Crear conexión
            //onlineGameState.socket = io();
            
            // Evento de conexión establecida
            onlineGameState.socket.on('connect', () => {
                console.log('Conectado al servidor con ID:', onlineGameState.socket.id);
                onlineGameState.connected = true;
                
                // Si se reconecta y estaba en una sala, intentar volver a conectar
                if (onlineGameState.roomCode) {
                    // Aquí podría implementarse lógica de reconexión a sala
                }
            });
            
            // Evento de desconexión
            onlineGameState.socket.on('disconnect', () => {
                console.log('Desconectado del servidor');
                onlineGameState.connected = false;
                
                // Mostrar pantalla de error si estaba en juego
                if (onlineGameState.gameActive || onlineGameState.roomCode) {
                    showScreen('connection-error-screen');
                }
            });
            
            // Evento de error de conexión
            onlineGameState.socket.on('connect_error', (error) => {
                console.error('Error de conexión:', error);
                showScreen('connection-error-screen');
                document.getElementById('connection-error-message').textContent = 
                    'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.';
            });
            
            // Evento cuando se crea una sala
            onlineGameState.socket.on('roomCreated', ({ roomCode, playerInfo }) => {
                onlineGameState.roomCode = roomCode;
                onlineGameState.playerInfo = playerInfo;
                onlineGameState.isHost = true;
                
                // Actualizar UI
                roomCodeDisplay.textContent = roomCode;
                hostPlayerName.textContent = playerInfo.name;
                guestPlayerName.textContent = 'Esperando jugador...';
                guestPlayerItem.querySelector('.player-status').textContent = '-';
                questionsCountDisplay.textContent = onlineGameState.totalQuestions;
                
                // Habilitar botón de inicio si hay un invitado
                startOnlineGameButton.disabled = true;
                
                // Mostrar pantalla de sala de espera
                showScreen('waiting-room-screen');
            });
            
            // Evento cuando un jugador se une a la sala
            onlineGameState.socket.on('roomJoined', ({ roomCode, playerInfo }) => {
                onlineGameState.roomCode = roomCode;
                onlineGameState.playerInfo = playerInfo;
                onlineGameState.isHost = false;
                
                // Actualizar UI
                roomCodeDisplay.textContent = roomCode;
                guestPlayerName.textContent = playerInfo.name;
                hostPlayerName.textContent = 'Anfitrión';
                questionsCountDisplay.textContent = onlineGameState.totalQuestions;
                
                // Mostrar pantalla de sala de espera
                showScreen('waiting-room-screen');
            });
            
            // Evento cuando hay un error al unirse a sala
            onlineGameState.socket.on('joinError', ({ message }) => {
                joinRoomError.textContent = message;
                // Limpiar mensaje después de un tiempo
                setTimeout(() => {
                    joinRoomError.textContent = '';
                }, 3000);
            });
            
            // Evento cuando otro jugador se une a la sala
            onlineGameState.socket.on('playerJoined', ({ player }) => {
                onlineGameState.otherPlayerInfo = player;
                
                // Actualizar UI
                guestPlayerName.textContent = player.name;
                guestPlayerItem.querySelector('.player-status').className = 'player-status ready';
                guestPlayerItem.querySelector('.player-status').textContent = 'Listo';
                
                // Habilitar botón de inicio si soy el host
                if (onlineGameState.isHost) {
                    startOnlineGameButton.disabled = false;
                }
            });
            
            // Evento cuando se actualiza la configuración del juego
            onlineGameState.socket.on('gameSetup', ({ totalQuestions }) => {
                onlineGameState.totalQuestions = totalQuestions;
                questionsCountDisplay.textContent = totalQuestions;
            });
            
            // Evento cuando el juego comienza
            onlineGameState.socket.on('gameStarted', ({ firstPlayerId, question }) => {
                onlineGameState.gameActive = true;
                onlineGameState.currentQuestion = question;
                onlineGameState.isMyTurn = firstPlayerId === onlineGameState.socket.id;
                onlineGameState.currentQuestionIndex = 0;
                
                // Actualizar información de jugadores
                updateOnlinePlayersUI();
                
                // Actualizar contador de preguntas
                onlineQuestionCounter.textContent = `1/${onlineGameState.totalQuestions}`;
                
                // Actualizar indicador de turno
                updateTurnIndicator();
                
                // Cargar la pregunta
                loadOnlineQuestion(question);
                
                // Iniciar temporizador si es mi turno
                if (onlineGameState.isMyTurn) {
                    startOnlineTimer();
                }
                
                // Mostrar pantalla de juego
                showScreen('online-game-screen');
            });
            
            // Evento cuando se pasa al siguiente turno
            onlineGameState.socket.on('nextTurn', ({ currentPlayerId, currentQuestionIndex, question }) => {
                onlineGameState.isMyTurn = currentPlayerId === onlineGameState.socket.id;
                onlineGameState.currentQuestionIndex = currentQuestionIndex;
                onlineGameState.currentQuestion = question;
                
                // Limpiar feedback anterior
                onlineFeedbackText.textContent = '';
                onlineFeedbackText.className = 'feedback-animation';
                
                // Actualizar contador de preguntas
                onlineQuestionCounter.textContent = `${currentQuestionIndex + 1}/${onlineGameState.totalQuestions}`;
                
                // Actualizar indicador de turno
                updateTurnIndicator();
                
                // Cargar la pregunta
                loadOnlineQuestion(question);
                
                // Iniciar temporizador si es mi turno
                if (onlineGameState.isMyTurn) {
                    startOnlineTimer();
                }
            });
            
            // Evento cuando un jugador responde
            onlineGameState.socket.on('answerResult', ({ playerId, isCorrect, newScore, correctAnswers, incorrectAnswers }) => {
                // Verificar si es mi respuesta o la del otro jugador
                const isMyAnswer = playerId === onlineGameState.socket.id;
                
                // Actualizar estadísticas del jugador correspondiente
                if (isMyAnswer) {
                    onlineGameState.playerInfo.score = newScore;
                    onlineGameState.playerInfo.correctAnswers = correctAnswers;
                    onlineGameState.playerInfo.incorrectAnswers = incorrectAnswers;
                    
                    // Actualizar UI de jugador 1 o 2 dependiendo de si soy host o invitado
                    if (onlineGameState.isHost) {
                        onlinePlayer1Points.textContent = newScore;
                        animateScoreUpdate(onlinePlayer1Points);
                    } else {
                        onlinePlayer2Points.textContent = newScore;
                        animateScoreUpdate(onlinePlayer2Points);
                    }
                } else {
                    // Es respuesta del otro jugador
                    if (onlineGameState.otherPlayerInfo) {
                        onlineGameState.otherPlayerInfo.score = newScore;
                        onlineGameState.otherPlayerInfo.correctAnswers = correctAnswers;
                        onlineGameState.otherPlayerInfo.incorrectAnswers = incorrectAnswers;
                        
                        // Actualizar UI del otro jugador
                        if (onlineGameState.isHost) {
                            onlinePlayer2Points.textContent = newScore;
                            animateScoreUpdate(onlinePlayer2Points);
                        } else {
                            onlinePlayer1Points.textContent = newScore;
                            animateScoreUpdate(onlinePlayer1Points);
                        }
                    }
                }
                
                // Si es mi turno y respondí, detener temporizador
                if (isMyAnswer && onlineGameState.isMyTurn) {
                    stopOnlineTimer();
                }
            });
            
            // Evento cuando un jugador se queda sin tiempo
            onlineGameState.socket.on('playerTimeOut', ({ playerId }) => {
                const isMyTimeout = playerId === onlineGameState.socket.id;
                
                if (isMyTimeout) {
                    // Si es mi timeout y es mi turno
                    if (onlineGameState.isMyTurn) {
                        // Ya debería estar detenido el temporizador por handleOnlineTimeout
                        // pero por si acaso:
                        stopOnlineTimer();
                    }
                }
                
                // Mostrar mensaje de timeout para ambos jugadores
                if (onlineGameState.isMyTurn || isMyTimeout) {
                    onlineFeedbackText.textContent = '¡Tiempo agotado!';
                    onlineFeedbackText.className = 'feedback-animation incorrect show';
                }
            });
            
            // Evento cuando termina el juego
            onlineGameState.socket.on('gameEnded', ({ players, winner, isTie }) => {
                // Detener cualquier temporizador activo
                stopOnlineTimer();
                
                // Actualizar datos de jugadores
                if (players && players.length === 2) {
                    // Ordenar jugadores para asegurar que host es siempre el primero
                    const hostPlayer = players.find(p => p.isHost);
                    const guestPlayer = players.find(p => !p.isHost);
                    
                    // Actualizar nombres
                    onlineResultPlayer1Name.textContent = hostPlayer.name;
                    onlineResultPlayer2Name.textContent = guestPlayer.name;
                    
                    // Actualizar puntajes
                    onlinePlayer1FinalPoints.textContent = hostPlayer.score;
                    onlinePlayer2FinalPoints.textContent = guestPlayer.score;
                    
                    // Actualizar estadísticas
                    onlinePlayer1CorrectAnswers.textContent = hostPlayer.correctAnswers;
                    onlinePlayer2CorrectAnswers.textContent = guestPlayer.correctAnswers;
                    onlinePlayer1IncorrectAnswers.textContent = hostPlayer.incorrectAnswers;
                    onlinePlayer2IncorrectAnswers.textContent = guestPlayer.incorrectAnswers;
                    
                    // Marcar ganador
                    if (isTie) {
                        onlineWinnerContainer.innerHTML = `<div class="tie-result">¡Empate!</div>`;
                        document.getElementById('online-player1-result').classList.remove('winner');
                        document.getElementById('online-player2-result').classList.remove('winner');
                    } else if (winner) {
                        onlineWinnerContainer.innerHTML = `<div class="winner-announcement">¡${winner.name} gana!</div>`;
                        
                        if (winner.id === hostPlayer.id) {
                            document.getElementById('online-player1-result').classList.add('winner');
                            document.getElementById('online-player2-result').classList.remove('winner');
                        } else {
                            document.getElementById('online-player1-result').classList.remove('winner');
                            document.getElementById('online-player2-result').classList.add('winner');
                        }
                    }
                    
                    // Ocultar botón "Jugar de Nuevo" si no soy host
                    onlinePlayAgainButton.style.display = onlineGameState.isHost ? 'block' : 'none';
                }
                
                // Mostrar pantalla de resultados
                showScreen('online-results-screen');
            });
            
            // Evento cuando un jugador se desconecta
            onlineGameState.socket.on('playerDisconnected', ({ playerId }) => {
                // Si el otro jugador se desconecta durante el juego
                if (onlineGameState.gameActive) {
                    // Mostrar mensaje
                    document.getElementById('connection-error-message').textContent = 
                        'El otro jugador se ha desconectado.';
                    showScreen('connection-error-screen');
                } else if (onlineGameState.roomCode) {
                    // Si estamos en sala de espera, actualizar UI
                    if (onlineGameState.isHost) {
                        guestPlayerName.textContent = 'Esperando jugador...';
                        guestPlayerItem.querySelector('.player-status').className = 'player-status';
                        guestPlayerItem.querySelector('.player-status').textContent = '-';
                        startOnlineGameButton.disabled = true;
                    } else {
                        // Si el host se desconecta, volver al menú
                        showScreen('online-menu-screen');
                    }
                }
            });
            
            // Evento cuando el juego es abortado
            onlineGameState.socket.on('gameAborted', ({ reason }) => {
                stopOnlineTimer();
                document.getElementById('connection-error-message').textContent = reason;
                showScreen('connection-error-screen');
            });
            
            // Evento cuando hay un nuevo host
            onlineGameState.socket.on('newHost', ({ newHostId }) => {
                if (newHostId === onlineGameState.socket.id) {
                    onlineGameState.isHost = true;
                    // Actualizar UI
                    // Este evento ocurre cuando el host original se desconecta
                }
            });
            
            // Evento cuando el juego se reinicia
            onlineGameState.socket.on('gameReset', () => {
                // Volver a sala de espera
                showScreen('waiting-room-screen');
            });
            
        } catch (error) {
            console.error('Error inicializando Socket.io:', error);
            document.getElementById('connection-error-message').textContent = 
                'Error inicializando conexión. Por favor, recarga la página.';
            showScreen('connection-error-screen');
        }
    }
    
    // Cargar pregunta online
    function loadOnlineQuestion(question) {
        if (!question) return;
        
        // Establecer texto de la pregunta
        onlineQuestionText.textContent = question.text;
        
        // Manejar imagen de la pregunta
        if (question.image) {
            onlineQuestionImage.src = question.image;
            onlineQuestionImage.alt = question.image_alt || "Diagrama de la pregunta";
            onlineQuestionImage.style.display = 'block';
            
            // Información adicional de la imagen
            if (question.type === 'identify_part' && question.values_on_image) {
                let infoParts = [];
                for (const key in question.values_on_image) {
                    infoParts.push(`${key.toUpperCase()}: ${question.values_on_image[key]}`);
                }
                onlineImageValueInfo.textContent = `Valores en imagen: ${infoParts.join(', ')}`;
                onlineImageValueInfo.style.display = 'block';
            } else {
                onlineImageValueInfo.style.display = 'none';
            }
        } else {
            onlineQuestionImage.style.display = 'none';
            onlineImageValueInfo.style.display = 'none';
        }
        
        // Limpiar y crear opciones
        onlineOptionsContainer.innerHTML = '';
        
        // Crear copia de opciones para barajar
        const options = [...question.options];
        
        // Barajar opciones (Fisher-Yates)
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        // Crear botones de opciones
        options.forEach((option, index) => {
            const button = document.createElement('button');
            
            // Si es una opción con imagen
            if (question.type === 'visual_select' && option.image) {
                button.classList.add('image-option');
                const img = document.createElement('img');
                img.src = option.image;
                img.alt = option.alt || `Opción ${index + 1}`;
                button.appendChild(img);
                
                if (option.text) {
                    const span = document.createElement('span');
                    span.textContent = option.text;
                    button.appendChild(span);
                }
            } else {
                button.textContent = option.text;
            }
            
            // Solo habilitar click si es mi turno
            button.disabled = !onlineGameState.isMyTurn;
            
            // Evento click para responder
            button.addEventListener('click', () => {
                if (!onlineGameState.isMyTurn) return;
                
                // Marcar visualmente la selección
                handleOnlineAnswerSelection(button, options, index, option.correct, question.feedback);
                
                // Enviar respuesta al servidor
                const timeTaken = 15 - onlineGameState.timerValue;
                onlineGameState.socket.emit('playerAnswer', {
                    roomCode: onlineGameState.roomCode,
                    isCorrect: option.correct,
                    timeTaken: timeTaken
                });
            });
            
            onlineOptionsContainer.appendChild(button);
        });
    }
    
    // Manejar selección de respuesta online
    function handleOnlineAnswerSelection(buttonElement, options, selectedIndex, isCorrect, feedback) {
        // Detener temporizador
        stopOnlineTimer();
        
        // Desactivar todos los botones
        const optionButtons = onlineOptionsContainer.querySelectorAll('button');
        optionButtons.forEach(btn => btn.disabled = true);
        
        // Marcar respuesta correcta e incorrecta
        optionButtons.forEach((btn, idx) => {
            // Marcar respuesta seleccionada
            if (idx === selectedIndex) {
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');
            } 
            // Marcar la correcta si el jugador seleccionó incorrectamente
            else if (!isCorrect && options[idx].correct) {
                btn.classList.add('correct');
            }
        });
        
        // Mostrar feedback
        onlineFeedbackText.textContent = isCorrect ? 
            (feedback?.correct || "¡Correcto!") : 
            (feedback?.incorrect || "Incorrecto");
        onlineFeedbackText.className = `feedback-animation ${isCorrect ? 'correct' : 'incorrect'} show`;
        
        // Reproducir sonido
        playSoundFeedback(isCorrect);
    }
    
    // Actualizar indicador de turno
    function updateTurnIndicator() {
        // Actualizar clase del indicador de turno
        if (onlineGameState.isMyTurn) {
            onlineTurnIndicator.className = 'player-turn-indicator ' + 
                (onlineGameState.isHost ? 'player1-turn' : 'player2-turn');
            onlineCurrentPlayerName.textContent = onlineGameState.playerInfo.name + ' (Tú)';
        } else {
            onlineTurnIndicator.className = 'player-turn-indicator ' + 
                (onlineGameState.isHost ? 'player2-turn' : 'player1-turn');
            onlineCurrentPlayerName.textContent = onlineGameState.otherPlayerInfo?.name || 'Otro jugador';
        }
        
        // Actualizar qué jugador está activo
        if (onlineGameState.isHost) {
            onlinePlayer1Score.classList.toggle('active', onlineGameState.isMyTurn);
            onlinePlayer2Score.classList.toggle('active', !onlineGameState.isMyTurn);
        } else {
            onlinePlayer1Score.classList.toggle('active', !onlineGameState.isMyTurn);
            onlinePlayer2Score.classList.toggle('active', onlineGameState.isMyTurn);
        }
        
        // Actualizar opciones habilitadas/deshabilitadas
        const optionButtons = onlineOptionsContainer.querySelectorAll('button');
        optionButtons.forEach(btn => {
            btn.disabled = !onlineGameState.isMyTurn;
        });
    }
    
    // Actualizar información de jugadores en pantalla de juego
    function updateOnlinePlayersUI() {
        if (!onlineGameState.playerInfo || !onlineGameState.otherPlayerInfo) return;
        
        if (onlineGameState.isHost) {
            // Yo soy host (jugador 1)
            onlinePlayer1Name.textContent = onlineGameState.playerInfo.name;
            onlinePlayer1Points.textContent = onlineGameState.playerInfo.score;
            
            // El otro es guest (jugador 2)
            onlinePlayer2Name.textContent = onlineGameState.otherPlayerInfo.name;
            onlinePlayer2Points.textContent = onlineGameState.otherPlayerInfo.score;
        } else {
            // Yo soy guest (jugador 2)
            onlinePlayer2Name.textContent = onlineGameState.playerInfo.name;
            onlinePlayer2Points.textContent = onlineGameState.playerInfo.score;
            
            // El otro es host (jugador 1)
            onlinePlayer1Name.textContent = onlineGameState.otherPlayerInfo.name;
            onlinePlayer1Points.textContent = onlineGameState.otherPlayerInfo.score;
        }
    }
    
    // Iniciar temporizador online
    function startOnlineTimer() {
        // Limpiar temporizador existente
        stopOnlineTimer();
        
        // Establecer tiempo inicial
        onlineGameState.timerValue = 15;
        updateOnlineTimerDisplay();
        
        // Iniciar intervalo
        onlineGameState.timerInterval = setInterval(() => {
            onlineGameState.timerValue--;
            updateOnlineTimerDisplay();
            
            // Si se agota el tiempo
            if (onlineGameState.timerValue <= 0) {
                handleOnlineTimeout();
            }
        }, 1000);
    }
    
    // Detener temporizador online
    function stopOnlineTimer() {
        if (onlineGameState.timerInterval) {
            clearInterval(onlineGameState.timerInterval);
            onlineGameState.timerInterval = null;
        }
    }
    
    // Actualizar visualización del temporizador
    function updateOnlineTimerDisplay() {
        onlineTimerValue.textContent = onlineGameState.timerValue;
        
        // Efectos visuales cuando queda poco tiempo
        if (onlineGameState.timerValue <= 5) {
            onlineTimer.classList.add('low-time');
        } else {
            onlineTimer.classList.remove('low-time');
        }
    }
    
    // Manejar timeout online
    function handleOnlineTimeout() {
        stopOnlineTimer();
        
        // Solo enviar evento si es mi turno
        if (onlineGameState.isMyTurn) {
            onlineGameState.socket.emit('timeOut', {
                roomCode: onlineGameState.roomCode
            });
            
            // Mostrar mensaje de timeout
            onlineFeedbackText.textContent = '¡Tiempo agotado!';
            onlineFeedbackText.className = 'feedback-animation incorrect show';
            
            // Desactivar opciones
            const optionButtons = onlineOptionsContainer.querySelectorAll('button');
            optionButtons.forEach(btn => btn.disabled = true);
            
            // Si hay una respuesta correcta, marcarla
            if (onlineGameState.currentQuestion) {
                const options = onlineGameState.currentQuestion.options;
                const correctOptionIndex = options.findIndex(opt => opt.correct);
                if (correctOptionIndex !== -1 && optionButtons[correctOptionIndex]) {
                    optionButtons[correctOptionIndex].classList.add('correct');
                }
            }
        }
    }
    
    // Animar actualización de puntaje
    function animateScoreUpdate(scoreElement) {
        scoreElement.classList.add('updated');
        setTimeout(() => scoreElement.classList.remove('updated'), 600);
    }
    
    // Reproducir sonido de feedback
    function playSoundFeedback(isCorrect) {
        const soundUrl = isCorrect ? 'correct.mp3' : 'incorrect.mp3';
        
        // Asumir que la función loadSound y playDecodedSound ya están definidas en script.js
        // Si no, implementar una versión simple
        if (typeof loadSound === 'function' && typeof playDecodedSound === 'function') {
            loadSound(soundUrl).then(buffer => {
                if (buffer) playDecodedSound(buffer);
            });
        } else {
            const audio = new Audio(soundUrl);
            audio.play().catch(e => console.error('Error reproduciendo sonido:', e));
        }
    }
    
    // === Event Listeners ===
    
    // Botón para ir al menú online
    onlineButton.addEventListener('click', () => {
        if (!onlineGameState.socket) {
            initSocketConnection();
        }
        showScreen('online-menu-screen');
    });
    
    // Botón para mostrar pantalla crear sala
    createRoomButton.addEventListener('click', () => {
        showScreen('create-room-screen');
        
        // Actualizar opciones de preguntas
        document.querySelectorAll('.question-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.question-option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
                onlineGameState.totalQuestions = parseInt(e.target.dataset.questions);
            });
        });
    });
    
    // Botón para mostrar pantalla unirse a sala
    joinRoomButton.addEventListener('click', () => {
        showScreen('join-room-screen');
        roomCodeInput.value = '';
        joinRoomError.textContent = '';
    });
    
    // Botón para confirmar creación de sala
    createRoomConfirmButton.addEventListener('click', () => {
        if (!onlineGameState.connected) {
            document.getElementById('connection-error-message').textContent = 'No hay conexión con el servidor';
            showScreen('connection-error-screen');
            return;
        }
        
        // Obtener nombre del jugador
        const playerName = document.getElementById('player-name-input').value.trim() || 'Jugador';
        
        // Enviar solicitud al servidor
        onlineGameState.socket.emit('createRoom', {
            playerName,
            totalQuestions: onlineGameState.totalQuestions
        });
    });
    
    // Botón para confirmar unirse a sala
    joinRoomConfirmButton.addEventListener('click', () => {
        if (!onlineGameState.connected) {
            document.getElementById('connection-error-message').textContent = 'No hay conexión con el servidor';
            showScreen('connection-error-screen');
            return;
        }
        
        // Obtener código de sala
        const roomCode = roomCodeInput.value.trim().toUpperCase();
        
        // Validar código de sala
        if (!roomCode || roomCode.length !== 6) {
            joinRoomError.textContent = 'Código de sala inválido';
            return;
        }
        
        // Obtener nombre del jugador
        const playerName = document.getElementById('player-name-input').value.trim() || 'Jugador';
        
        // Enviar solicitud al servidor
        onlineGameState.socket.emit('joinRoom', {
            roomCode,
            playerName
        });
    });
    
    // Botón para copiar código de sala
    copyRoomCodeButton.addEventListener('click', () => {
        const roomCode = roomCodeDisplay.textContent;
        
        // Copiar al portapapeles
        navigator.clipboard.writeText(roomCode)
            .then(() => {
                // Cambiar texto del botón temporalmente para feedback
                const originalText = copyRoomCodeButton.textContent;
                copyRoomCodeButton.textContent = 'Copiado';
                
                setTimeout(() => {
                    copyRoomCodeButton.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
            });
    });
    
    // Botón para iniciar juego online
    startOnlineGameButton.addEventListener('click', () => {
        if (!onlineGameState.connected || !onlineGameState.roomCode) return;
        
        if (onlineGameState.isHost) {
            // Notificar al servidor la configuración del juego
            onlineGameState.socket.emit('setupGame', {
                roomCode: onlineGameState.roomCode,
                totalQuestions: onlineGameState.totalQuestions
            });
            
            // Preparar preguntas (usar todas las preguntas del juego base)
            // Acceder a questions que está definido en el ámbito global en script.js
            let gameQuestions = [];
            
            try {
                // Asegurarse de que questions esté disponible
                if (window.questions && Array.isArray(window.questions)) {
                    console.log('Preguntas encontradas:', window.questions.length);
                    
                    // Mezclar todas las preguntas
                    const allQuestions = [...window.questions];
                    
                    // Fisher-Yates (Knuth) Shuffle
                    for (let i = allQuestions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
                    }
                    
                    // Tomar número deseado de preguntas
                    gameQuestions = allQuestions.slice(0, onlineGameState.totalQuestions);
                    
                    console.log('Preguntas seleccionadas para el juego:', gameQuestions.length);
                } else {
                    throw new Error('La variable questions no está definida o no es un array');
                }
            } catch (error) {
                console.error('Error al preparar preguntas:', error);
                document.getElementById('connection-error-message').textContent = 
                    'Error al cargar las preguntas. Por favor, recarga la página e inténtalo de nuevo.';
                showScreen('connection-error-screen');
                return;
            }
            
            // Iniciar juego
            onlineGameState.socket.emit('startGame', {
                roomCode: onlineGameState.roomCode,
                questions: gameQuestions
            });
        }
    });
    
    // Botón para abandonar sala
    leaveRoomButton.addEventListener('click', () => {
        // Reiniciar estado
        onlineGameState.roomCode = null;
        onlineGameState.playerInfo = null;
        onlineGameState.otherPlayerInfo = null;
        onlineGameState.isHost = false;
        
        // Volver al menú online
        showScreen('online-menu-screen');
    });
    
    // Botón para reintentar conexión
    retryConnectionButton.addEventListener('click', () => {
        // Reintentar conexión Socket.io
        if (onlineGameState.socket) {
            onlineGameState.socket.connect();
        } else {
            initSocketConnection();
        }
        
        // Volver al menú online después de intentar reconectar
        showScreen('online-menu-screen');
    });
    
    // Botón para jugar de nuevo en modo online
    onlinePlayAgainButton.addEventListener('click', () => {
        if (!onlineGameState.connected || !onlineGameState.roomCode) return;
        
        if (onlineGameState.isHost) {
            onlineGameState.socket.emit('playAgain', {
                roomCode: onlineGameState.roomCode
            });
        }
    });
    
    // Botón para volver al lobby desde resultados
    onlineBackToLobbyButton.addEventListener('click', () => {
        showScreen('waiting-room-screen');
    });
}); 