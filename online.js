// Modo Multijugador Online para Trigonomix
document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        // Easy: Conceptos Básicos
        {
            level: 'easy',
            type: 'define_ratio',
            text: "¿Cuál razón trigonométrica se define como 'Cateto Opuesto / Hipotenusa'?",
            image: null, 
            options: [
                { text: "Seno (sin)", correct: true },
                { text: "Coseno (cos)", correct: false },
                { text: "Tangente (tan)", correct: false }
            ],
            feedback: {
                correct: "¡Correctísimo! Seno = Opuesto / Hipotenusa.",
                incorrect: "Nop. Recuerda: Seno es Opuesto sobre Hipotenusa."
            }
        },
        {
            level: 'easy',
            type: 'define_ratio',
            text: "¿La Tangente (tan) de un ángulo se calcula como...?",
            image: null,
            options: [
                { text: "Opuesto / Adyacente", correct: true },
                { text: "Adyacente / Hipotenusa", correct: false },
                { text: "Opuesto / Hipotenusa", correct: false }
            ],
            feedback: {
                correct: "¡Así es! Tangente = Opuesto / Adyacente.",
                incorrect: "Intenta de nuevo. Tangente es Opuesto sobre Adyacente."
            }
        },
        {
            level: 'easy',
            type: 'define_ratio',
            text: "¿El Coseno (cos) de un ángulo se define como...?",
            image: null,
            options: [
                { text: "Adyacente / Hipotenusa", correct: true },
                { text: "Opuesto / Adyacente", correct: false },
                { text: "Hipotenusa / Opuesto", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! Coseno = Adyacente / Hipotenusa.",
                incorrect: "Casi. Coseno es Adyacente sobre Hipotenusa."
            }
        },
        {
            level: 'easy',
            type: 'identify_part',
            text: "En un triángulo rectángulo, el lado más largo se llama...",
            image: 'triangle_diagram.png',
            image_alt: "Diagrama de Triángulo con etiquetas o, a, h",
            options: [
                { text: "Hipotenusa", correct: true },
                { text: "Cateto Opuesto", correct: false },
                { text: "Cateto Adyacente", correct: false }
            ],
            feedback: {
                correct: "¡Exacto! La hipotenusa es el lado más largo y opuesto al ángulo recto.",
                incorrect: "Recuerda, el lado más largo opuesto al ángulo recto es la hipotenusa."
            }
        },
        {
            level: 'easy',
            type: 'define_ratio',
            text: "Si 'o' es el cateto opuesto y 'a' es el cateto adyacente, ¿qué razón es o/a?",
            image: null,
            options: [
                { text: "Tangente (tan)", correct: true },
                { text: "Seno (sin)", correct: false },
                { text: "Coseno (cos)", correct: false }
            ],
            feedback: {
                correct: "¡Muy bien! o/a corresponde a la Tangente.",
                incorrect: "Esa es la Tangente (Opuesto/Adyacente). Revisa las definiciones."
            }
        },
        {
            level: 'easy',
            type: 'define_ratio',
            text: "¿Qué representa 'h' en las fórmulas trigonométricas del triángulo rectángulo?",
            image: 'triangle_diagram.png',
            image_alt: "Diagrama de Triángulo con etiquetas o, a, h",
            options: [
                { text: "La hipotenusa", correct: true },
                { text: "La altura del triángulo", correct: false },
                { text: "Un cateto cualquiera", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! 'h' siempre representa la hipotenusa.",
                incorrect: "'h' es la abreviatura estándar para la hipotenusa en este contexto."
            }
        },
        {
            level: 'easy',
            type: 'define_ratio',
            text: "La razón 'Cateto Adyacente / Hipotenusa' corresponde a:",
            image: null,
            options: [
                { text: "Coseno (cos)", correct: true },
                { text: "Seno (sin)", correct: false },
                { text: "Tangente (tan)", correct: false }
            ],
            feedback: {
                correct: "¡Así es! Adyacente / Hipotenusa es el Coseno.",
                incorrect: "No, esa es la definición del Coseno. Seno es Opuesto/Hipotenusa."
            }
        },
        {
            level: 'easy',
            type: 'identify_part',
            text: "El 'cateto opuesto' a un ángulo θ es el lado que está...",
            image: null,
            options: [
                { text: "Frente al ángulo de referencia (θ)", correct: true },
                { text: "Al lado del ángulo (θ), y no es la hipotenusa", correct: false },
                { text: "Opuesto al ángulo recto (90°)", correct: false }
            ],
            feedback: {
                correct: "¡Exacto! El cateto opuesto está justo enfrente del ángulo θ.",
                incorrect: "El cateto opuesto es el que está directamente FRENTE al ángulo de referencia θ."
            }
        },
        {
            level: 'easy',
            type: 'identify_part',
            text: "El 'cateto adyacente' a un ángulo θ es el lado que está...",
            image: null,
            options: [
                { text: "Al lado del ángulo θ y NO es la hipotenusa", correct: true },
                { text: "Frente al ángulo θ", correct: false },
                { text: "El lado más largo del triángulo", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! Es el cateto que forma parte del ángulo θ, pero no es la hipotenusa.",
                incorrect: "El adyacente está junto al ángulo θ y ayuda a formarlo, pero no es la hipotenusa."
            }
        },
        {
            level: 'easy',
            type: 'define_ratio',
            text: "Para el ángulo θ, según el diagrama, Seno(θ) se calcula como:",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h",
            options: [
                { text: "o / h", correct: true },
                { text: "a / h", correct: false },
                { text: "o / a", correct: false }
            ],
            feedback: {
                correct: "¡Perfecto! Sen(θ) = opuesto/hipotenusa = o/h.",
                incorrect: "Recuerda, Seno es cateto opuesto ('o') sobre hipotenusa ('h')."
            }
        },
        // Intermediate: Identificación de elementos
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "En el triángulo, ¿cuál es el CATETO OPUESTO al ángulo θ?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo rectángulo con lados o, a, h y ángulo theta",
            values_on_image: { o: '?', a: 'a', h: 'h' }, 
            options: [
                { text: "Lado 'o'", correct: true },
                { text: "Lado 'a'", correct: false },
                { text: "Lado 'h'", correct: false }
            ],
            feedback: {
                correct: "¡Perfecto! 'o' es el cateto opuesto a θ.",
                incorrect: "El cateto opuesto es el que está FRENTE al ángulo θ. En este caso, 'o'."
            }
        },
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "Identifica la HIPOTENUSA en el triángulo mostrado.",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo rectángulo con lados o, a, h y ángulo theta",
            values_on_image: { o: 'o', a: 'a', h: '?' },
            options: [
                { text: "Lado 'h'", correct: true },
                { text: "Lado 'o'", correct: false },
                { text: "Lado 'a'", correct: false }
            ],
            feedback: {
                correct: "¡Muy bien! 'h' es siempre la hipotenusa, el lado más largo.",
                incorrect: "La hipotenusa ('h') es el lado opuesto al ángulo recto y el más largo."
            }
        },
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "Observa el triángulo. Si el ángulo de referencia fuera el ángulo superior (no θ, sino el otro ángulo agudo), ¿cuál sería el cateto ADYACENTE a ESE ángulo superior?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h y ángulo theta en la base",
            values_on_image: {o: 'o (vertical)', a: 'a (base)', h:'h'},
            options: [
                { text: "Lado 'o'", correct: true },
                { text: "Lado 'a'", correct: false },
                { text: "Lado 'h'", correct: false }
            ],
            feedback: {
                correct: "¡Bien pensado! El lado 'o' (el vertical) sería adyacente al ángulo superior.",
                incorrect: "Si miras desde el ángulo agudo superior, el lado 'o' (el vertical) es el adyacente a ese ángulo."
            }
        },
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "En este triángulo, ¿qué representa 'a' en relación con el ángulo θ?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h y ángulo theta",
            values_on_image: {o: 'o', a: '?', h:'h'},
            options: [
                { text: "Cateto Adyacente", correct: true },
                { text: "Cateto Opuesto", correct: false },
                { text: "Hipotenusa", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! 'a' es el cateto adyacente a θ.",
                incorrect: "'a' está al lado de θ y no es la hipotenusa, por lo tanto es el cateto adyacente."
            }
        },
        {
            level: 'intermediate',
            type: 'visual_select', 
            text: "¿Cuál de estos NO es un cateto en el triángulo mostrado con respecto a θ?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h",
            options: [
                { text: "Lado 'h'", correct: true, image: null },
                { text: "Lado 'o'", correct: false, image: null },
                { text: "Lado 'a'", correct: false, image: null }
            ],
            feedback: {
                correct: "¡Exacto! 'h' es la hipotenusa, no un cateto. Los catetos son 'o' y 'a'.",
                incorrect: "Recuerda, 'o' y 'a' son los catetos. 'h' es la hipotenusa."
            }
        },
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "Si Cos(θ) = a/h, y ves el diagrama, ¿qué lado es 'a'?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h",
            values_on_image: {o:'o', a:'?', h:'h'},
            options: [
                { text: "Cateto Adyacente (el de abajo)", correct: true },
                { text: "Cateto Opuesto (el vertical)", correct: false },
                { text: "Hipotenusa (el inclinado)", correct: false }
            ],
            feedback: {
                correct: "¡Muy bien! 'a' es el cateto adyacente, el que está junto a θ en la base.",
                incorrect: "En Cos(θ)=a/h, 'a' es el cateto adyacente. En el diagrama es el lado horizontal inferior."
            }
        },
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "Si Tan(θ) = o/a, y ves el diagrama, ¿qué lado es 'o'?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h",
            values_on_image: {o:'?', a:'a', h:'h'},
            options: [
                { text: "Cateto Opuesto (el vertical)", correct: true },
                { text: "Cateto Adyacente (el de abajo)", correct: false },
                { text: "Hipotenusa (el inclinado)", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! 'o' es el cateto opuesto, el lado vertical frente a θ.",
                incorrect: "En Tan(θ)=o/a, 'o' es el cateto opuesto. En el diagrama es el lado vertical."
            }
        },
        {
            level: 'intermediate',
            type: 'identify_part',
            text: "El ángulo recto (90°) en el diagrama está formado por la intersección de los lados...",
            image: 'triangle_diagram.png', 
            image_alt: "Triángulo con o, a, h, y ángulo recto marcado",
            options: [
                { text: "'o' y 'a'", correct: true },
                { text: "'o' y 'h'", correct: false },
                { text: "'a' y 'h'", correct: false }
            ],
            feedback: {
                correct: "¡Así es! Los catetos 'o' y 'a' son los que forman el ángulo recto.",
                incorrect: "El ángulo recto se forma entre los dos catetos, que en el diagrama son 'o' (opuesto) y 'a' (adyacente)."
            }
        },
        {
            level: 'intermediate',
            type: 'visual_select',
            text: "Imagina que el ángulo θ se hace más y más pequeño (casi cero). ¿Qué le pasaría al lado 'o' (opuesto)?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo con o, a, h",
            options: [
                { text: "Se haría muy pequeño, casi cero", correct: true },
                { text: "Se haría mucho más grande que 'h'", correct: false },
                { text: "No cambiaría de longitud", correct: false }
            ],
            feedback: {
                correct: "¡Buena intuición! Si θ es pequeño, el lado opuesto 'o' también se encoge.",
                incorrect: "Si el ángulo θ se encoge acercándose a cero, el lado opuesto 'o' también se encoge, tendiendo a cero."
            }
        },
        {
            level: 'intermediate',
            type: 'visual_select',
            text: "Si! el lado 'o' y el lado 'a' fueran exactamente iguales (y el ángulo θ fuera 45°), ¿qué tipo de triángulo (además de rectángulo) sería?",
            image: 'triangle_diagram.png', 
            image_alt: "Triángulo genérico o, a, h, para visualizar",
            options: [
                { text: "Isósceles (dos lados iguales)", correct: true },
                { text: "Equilátero (todos los lados iguales)", correct: false },
                { text: "Escaleno (todos los lados diferentes)", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! Un triángulo rectángulo con dos catetos iguales es también un triángulo isósceles.",
                incorrect: "Sería un triángulo rectángulo isósceles, ya que dos de sus lados (los catetos 'o' y 'a') serían iguales."
            }
        },
        // Difficult: Relaciones / Visual Select
        {
            level: 'difficult',
            type: 'visual_select',
            text: "Si sen(θ) = 1/2, ¿cuál imagen representa esto correctamente (opuesto=1, hipotenusa=2)?",
            image: null, 
            options: [
                { image: 'sine_30_correct.png', text: "Opción 1", correct: true, alt: "Triángulo con opuesto 1, hipotenusa 2" },
                { image: 'sine_30_incorrect_adj.png', text: "Opción 2", correct: false, alt: "Triángulo con adyacente 1, hipotenusa 2" },
                { image: 'sine_30_incorrect_ratio.png', text: "Opción 3", correct: false, alt: "Triángulo con opuesto 2, hipotenusa 1" }
            ],
            feedback: {
                correct: "¡Excelente! Esa es la configuración correcta para sen(θ) = 1/2.",
                incorrect: "Revisa bien. Seno es Opuesto / Hipotenusa. Busca el triángulo con opuesto=1 e hipotenusa=2."
            }
        },
         {
            level: 'difficult',
            type: 'define_ratio',
            text: "Si sabes Sen(θ) y Cos(θ), ¿cómo calculas Tan(θ)?",
            image: null,
            options: [
                { text: "Sen(θ) / Cos(θ)", correct: true },
                { text: "Cos(θ) / Sen(θ)", correct: false },
                { text: "Sen(θ) * Cos(θ)", correct: false },
                { text: "1 / Sen(θ)", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! Tan(θ) = Sen(θ) / Cos(θ) es una identidad fundamental.",
                incorrect: "Una pista: es una división. Tan(θ) = Sen(θ) / Cos(θ)."
            }
        },
        {
            level: 'difficult',
            type: 'visual_select',
            text: "Si cos(θ) = 1/2, ¿cuál imagen representa esto correctamente (adyacente=1, hipotenusa=2)?",
            image: null,
            options: [
                { image: 'cos_60_correct.png', text: "Imagen A", correct: true, alt: "Triángulo con adyacente 1, hipotenusa 2" },
                { image: 'cos_60_incorrect_opp.png', text: "Imagen B", correct: false, alt: "Triángulo con opuesto 1, hipotenusa 2" },
                { image: 'cos_60_incorrect_ratio.png', text: "Imagen C", correct: false, alt: "Triángulo con adyacente 2, hipotenusa 1" }
            ],
            feedback: {
                correct: "¡Genial! Esa es la configuración para cos(θ) = 1/2.",
                incorrect: "Coseno es Adyacente / Hipotenusa. Busca el triángulo con adyacente=1 e hipotenusa=2."
            }
        },
        {
            level: 'difficult',
            type: 'visual_select',
            text: "Si tan(θ) = 1, ¿qué implica esto para los catetos 'o' (opuesto) y 'a' (adyacente)?",
            image: null,
            options: [
                { text: "o = a (Cateto opuesto es igual al cateto adyacente)", correct: true },
                { text: "o = h (Cateto opuesto es igual a la hipotenusa)", correct: false },
                { text: "a = h (Cateto adyacente es igual a la hipotenusa)", correct: false },
                { text: "o > a (Cateto opuesto es mayor que el adyacente)", correct: false }
            ],
            feedback: {
                correct: "¡Exacto! Si tan(θ) = o/a = 1, entonces 'o' debe ser igual a 'a'.",
                incorrect: "Recuerda, tan(θ) = o/a. Para que esta división sea igual a 1, el numerador ('o') y el denominador ('a') deben ser iguales."
            }
        },
        {
            level: 'difficult',
            type: 'visual_select',
            text: "Selecciona la imagen que representa tan(θ) = 1 (donde opuesto y adyacente son iguales, por ejemplo, ambos 1).",
            image: null,
            options: [
                { image: 'tan_45_correct.png', text: "Diagrama X", correct: true, alt: "Triángulo con opuesto 1, adyacente 1" },
                { image: 'tan_45_incorrect_hyp.png', text: "Diagrama Y", correct: false, alt: "Triángulo con opuesto 1, hipotenusa 1" },
                { image: 'tan_45_incorrect_val.png', text: "Diagrama Z", correct: false, alt: "Triángulo con opuesto 2, adyacente 1" }
            ],
            feedback: {
                correct: "¡Perfecto! Si tan(θ)=1, el cateto opuesto y el adyacente son iguales.",
                incorrect: "Tangente es Opuesto / Adyacente. Busca el triángulo donde estos dos lados (catetos) sean iguales (por ejemplo, 1 y 1)."
            }
        },
        {
            level: 'difficult',
            type: 'define_ratio', 
            text: "Si el ángulo θ aumenta (manteniéndose agudo, <90°), ¿qué sucede generalmente con el valor de Sen(θ)?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo de referencia",
            options: [
                { text: "Aumenta (se acerca a 1)", correct: true },
                { text: "Disminuye (se acerca a 0)", correct: false },
                { text: "Permanece constante", correct: false },
                { text: "Se vuelve negativo", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! A medida que θ crece (hacia 90°), Sen(θ) también crece (hacia 1).",
                incorrect: "Piensa en el lado opuesto 'o'. Si θ crece (y 'h' se mantiene o ajusta), 'o' tiende a crecer. Sen(θ) = o/h, por lo tanto, Sen(θ) aumenta."
            }
        },
        {
            level: 'difficult',
            type: 'define_ratio',
            text: "Si el ángulo θ aumenta (manteniéndose agudo, <90°), ¿qué sucede generalmente con el valor de Cos(θ)?",
            image: 'triangle_diagram.png',
            image_alt: "Triángulo de referencia",
            options: [
                { text: "Disminuye (se acerca a 0)", correct: true },
                { text: "Aumenta (se acerca a 1)", correct: false },
                { text: "Permanece constante", correct: false },
                { text: "Se vuelve mayor que 1", correct: false }
            ],
            feedback: {
                correct: "¡Así es! A medida que θ crece (hacia 90°), Cos(θ) disminuye (hacia 0).",
                incorrect: "Piensa en el lado adyacente 'a'. Si θ crece (y 'h' se mantiene o ajusta), 'a' tiende a encogerse. Cos(θ) = a/h, por lo tanto, Cos(θ) disminuye."
            }
        },
        {
            level: 'difficult',
            type: 'define_ratio', 
            text: "¿Cuál de estas expresiones es SIEMPRE igual a 1 para cualquier ángulo agudo θ en un triángulo rectángulo (Identidad Pitagórica)?",
            image: null,
            options: [
                { text: "Sen²(θ) + Cos²(θ)", correct: true },
                { text: "Sen(θ) + Cos(θ)", correct: false },
                { text: "Tan(θ) / Sen(θ)", correct: false },
                { text: "Sen(θ) - Cos(θ)", correct: false }
            ],
            feedback: {
                correct: "¡Absolutamente! Sen²(θ) + Cos²(θ) = 1 es la Identidad Trigonométrica Pitagórica fundamental.",
                incorrect: "Esta es una identidad trigonométrica muy importante: Sen²(θ) + Cos²(θ) siempre es igual a 1."
            }
        },
        {
            level: 'difficult',
            type: 'define_ratio', 
            text: "La Cosecante de θ, denotada Csc(θ), es la recíproca del Seno de θ. Si Sen(θ) = o/h, entonces Csc(θ) es:",
            image: null,
            options: [
                { text: "h/o (Hipotenusa / Opuesto)", correct: true },
                { text: "a/h (Adyacente / Hipotenusa)", correct: false },
                { text: "o/a (Opuesto / Adyacente)", correct: false },
                { text: "h/a (Hipotenusa / Adyacente)", correct: false }
            ],
            feedback: {
                correct: "¡Correcto! Csc(θ) es la recíproca de Sen(θ), lo que significa que es 1/Sen(θ), que es igual a h/o.",
                incorrect: "Cosecante (Csc) es la función recíproca del Seno. Si Sen(θ)=o/h, entonces Csc(θ)=h/o (se invierte la fracción)."
            }
        },
        {
            level: 'difficult',
            type: 'define_ratio', 
            text: "La Secante de θ, denotada Sec(θ), es la recíproca del Coseno de θ. Si Cos(θ) = a/h, entonces Sec(θ) es:",
            image: null,
            options: [
                { text: "h/a (Hipotenusa / Adyacente)", correct: true },
                { text: "o/h (Opuesto / Hipotenusa)", correct: false },
                { text: "a/o (Adyacente / Opuesto)", correct: false },
                { text: "h/o (Hipotenusa / Opuesto)", correct: false }
            ],
            feedback: {
                correct: "¡Muy bien! Sec(θ) es la recíproca de Cos(θ), lo que significa que es 1/Cos(θ), que es igual a h/a.",
                incorrect: "Secante (Sec) es la función recíproca del Coseno. Si Cos(θ)=a/h, entonces Sec(θ)=h/a (se invierte la fracción)."
            }
        }
    ];
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
        try {
            // Crear conexión
            onlineGameState.socket = io();
            
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
            onlineGameState.socket.on('roomJoined', ({ roomCode, playerInfo, totalQuestions }) => {
                onlineGameState.roomCode = roomCode;
                onlineGameState.playerInfo = playerInfo;
                onlineGameState.isHost = false;
                if (typeof totalQuestions === 'number') {
                    onlineGameState.totalQuestions = totalQuestions;
                }
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
            onlineGameState.socket.on('gameStarted', ({ firstPlayerId, question, players }) => {
                onlineGameState.gameActive = true;
                onlineGameState.currentQuestion = question;
                onlineGameState.isMyTurn = firstPlayerId === onlineGameState.socket.id;
                onlineGameState.currentQuestionIndex = 0;

                // Actualizar información de jugadores
                if (players && players.length === 2) {
                    // Determinar cuál soy yo y cuál es el otro
                    const me = players.find(p => p.id === onlineGameState.socket.id);
                    const other = players.find(p => p.id !== onlineGameState.socket.id);
                    onlineGameState.playerInfo = me;
                    onlineGameState.otherPlayerInfo = other;
                }
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
            onlineGameState.socket.on('nextTurn', ({ currentPlayerId, currentQuestionIndex, question, players }) => {
                onlineGameState.isMyTurn = currentPlayerId === onlineGameState.socket.id;
                onlineGameState.currentQuestionIndex = currentQuestionIndex;
                onlineGameState.currentQuestion = question;
                
                // Actualizar información de jugadores
                if (players && players.length === 2) {
                    const me = players.find(p => p.id === onlineGameState.socket.id);
                    const other = players.find(p => p.id !== onlineGameState.socket.id);
                    onlineGameState.playerInfo = me;
                    onlineGameState.otherPlayerInfo = other;
                }
                updateOnlinePlayersUI();

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
        
        // Preparar preguntas usando las preguntas existentes de script.js
        let gameQuestions = [];
        
        // Verificar que questions existe y es un array
        if (typeof questions !== 'undefined' && Array.isArray(questions) && questions.length > 0) {
            // Copiar todas las preguntas para no modificar el array original
            const allQuestions = [...questions];
            
            // Fisher-Yates (Knuth) Shuffle - Mezclar las preguntas
            for (let i = allQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
            }
            
            // Tomar el número deseado de preguntas
            gameQuestions = allQuestions.slice(0, onlineGameState.totalQuestions);
            
            console.log(`Usando ${gameQuestions.length} preguntas del banco de preguntas existente`);
        } else {
            console.error("Error: No se encontraron preguntas en script.js");
            alert("Error: No se pudieron cargar las preguntas. Por favor, recarga la página.");
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