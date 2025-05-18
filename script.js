document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const screens = document.querySelectorAll('.screen');
    const appContainer = document.getElementById('app-container');
    
    const playerNameInput = document.getElementById('player-name-input'); // For player name

    // Achievement Constants
    const ACHIEVEMENT_IDS = {
        FAST_ANSWER: 'FAST_ANSWER',
        PERFECT_EASY: 'PERFECT_EASY',
        PERFECT_INTERMEDIATE: 'PERFECT_INTERMEDIATE',
        PERFECT_DIFFICULT: 'PERFECT_DIFFICULT',
        STREAK_MASTER: 'STREAK_MASTER',
        TRIGONOMETRY_NINJA: 'TRIGONOMETRY_NINJA',
        MULTIPLAYER_CHAMPION: 'MULTIPLAYER_CHAMPION',
        SPEED_DEMON: 'SPEED_DEMON',
        COMEBACK_KING: 'COMEBACK_KING',
        MATH_WIZARD: 'MATH_WIZARD'
    };

    const ACHIEVEMENT_DETAILS = {
        [ACHIEVEMENT_IDS.FAST_ANSWER]: { name: "¡Todo un pro!", description: "Respondiste una pregunta correctamente en menos de 5 segundos." },
        [ACHIEVEMENT_IDS.PERFECT_EASY]: { name: "Balon de oro", description: "Completaste el nivel Fácil con puntaje perfecto." },
        [ACHIEVEMENT_IDS.PERFECT_INTERMEDIATE]: { name: "El proximo Albert Einstein", description: "Completaste el nivel Intermedio con puntaje perfecto." },
        [ACHIEVEMENT_IDS.PERFECT_DIFFICULT]: { name: "El orgullo de Pitágoras", description: "Completaste el nivel Difícil con puntaje perfecto." },
        [ACHIEVEMENT_IDS.STREAK_MASTER]: { name: "¡Imparable!", description: "Respondiste correctamente 5 preguntas seguidas sin equivocarte." },
        [ACHIEVEMENT_IDS.TRIGONOMETRY_NINJA]: { name: "Ninja Trigonométrico", description: "Completaste todos los niveles al menos una vez." },
        [ACHIEVEMENT_IDS.MULTIPLAYER_CHAMPION]: { name: "Rey del Multijugador", description: "Ganaste 3 partidas en modo multijugador." },
        [ACHIEVEMENT_IDS.SPEED_DEMON]: { name: "Velocista Matemático", description: "Completaste un nivel en menos de 2 minutos." },
        [ACHIEVEMENT_IDS.COMEBACK_KING]: { name: "¡Remontada Épica!", description: "Ganaste una partida después de ir 20 puntos por detrás." },
        [ACHIEVEMENT_IDS.MATH_WIZARD]: { name: "Mago de los Números", description: "Acumulaste un total de 1000 puntos en todos los modos de juego." }
    };
    

    // --- Screen Navigation ---
    /**
     * Shows a specific screen by its ID and hides others.
     * @param {string} screenId - The ID of the screen to show.
     */
    function showScreen(screenId) {
        let foundActive = false;
        screens.forEach(screen => {
            if (screen.id === screenId) {
                // Delay adding active class slightly to allow fadeOut to start on old screen
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

    // Generic click listener for navigation buttons
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.nav-button')) {
            const targetScreen = event.target.dataset.target;
            if (targetScreen) {
                showScreen(targetScreen);
            }
        }
    });

    /**
     * Mezcla los elementos de un array aleatoriamente (algoritmo Fisher-Yates)
     * @param {Array} array - El array que se quiere mezclar
     * @returns {Array} - El mismo array pero con los elementos mezclados
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Game Data & State ---
    let gameData = {
        score: 0,
        history: [],
        streak: 0, // Para STREAK_MASTER
        completedLevels: { easy: false, intermediate: false, difficult: false }, // Para TRIGONOMETRY_NINJA
        multiplayerWins: 0, // Para MULTIPLAYER_CHAMPION
        totalPoints: 0, // Para MATH_WIZARD
        playerAchievements: {
            FAST_ANSWER: null,
            PERFECT_EASY: null,
            PERFECT_INTERMEDIATE: null,
            PERFECT_DIFFICULT: null,
            STREAK_MASTER: null,
            TRIGONOMETRY_NINJA: null,
            MULTIPLAYER_CHAMPION: null,
            SPEED_DEMON: null,
            COMEBACK_KING: null,
            MATH_WIZARD: null
        },
        comebackCandidate: false, // Para COMEBACK_KING
        comebackDeficit: 0, // Para COMEBACK_KING
        currentLevel: null,
        currentQuestionIndex: 0,
        currentLevelQuestions: [],
        currentQuestionAnswered: false,
        playerName: "Jugador", // Default player name
        highScores: { 
            easy: { score: 0, name: "CPU" }, 
            intermediate: { score: 0, name: "CPU" }, 
            difficult: { score: 0, name: "CPU" } 
        }
    };

    // --- Questions Database ---
    // Types: 'define_ratio', 'identify_part', 'visual_select'
    // Definir questions como variable global para que sea accesible desde online.js
    window.questions = [
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

    // --- Audio Handling ---
    let audioContext;
    const audioBuffers = {};

    // Timer variables
    let questionTimerInterval = null;
    let timeLeft = 0;
    const DEFAULT_TIME_PER_QUESTION = 20; // Default seconds
    const TIME_CONFIG = {
        easy: 30,
        intermediate: 20,
        difficult: 15
    };
    let timePerQuestion = DEFAULT_TIME_PER_QUESTION;

    /** Initializes the Web Audio API AudioContext. */
    function initAudio() {
        if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * Loads a sound file and decodes it into an AudioBuffer.
     * @param {string} url - The URL of the sound file.
     * @returns {Promise<AudioBuffer|null>} The decoded audio buffer or null on error.
     */
    async function loadSound(url) {
        initAudio();
        if (!audioContext) return null;
        if (audioBuffers[url]) return audioBuffers[url];

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBuffers[url] = audioBuffer;
            return audioBuffer;
        } catch (error) {
            console.error(`Error loading sound ${url}:`, error);
            return null;
        }
    }
    
    /**
     * Plays a decoded audio buffer.
     * @param {AudioBuffer} buffer - The audio buffer to play.
     */
    function playDecodedSound(buffer) {
        if (!audioContext || !buffer) return;
        try {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }

    /**
     * Plays a sound effect based on whether the answer was correct.
     * @param {boolean} isCorrect - True if the answer was correct, false otherwise.
     */
    async function playSoundFeedback(isCorrect) {
        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume(); // Required for user-initiated audio playback
        }
        const soundUrl = isCorrect ? 'correct.mp3' : 'incorrect.mp3';
        const buffer = await loadSound(soundUrl);
        if (buffer) {
            playDecodedSound(buffer);
        }
    }

    // --- LocalStorage for Data Persistence ---
    const STORAGE_KEY = 'trigoAprendePlusData'; // Updated key slightly
    /** Saves the current gameData to localStorage. */
    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    }
    
    /** Loads gameData from localStorage. */
    function loadData() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            // Start with current gameData defaults (especially for new properties)
            // then overwrite with parsedData.
            gameData = {
                ...gameData, // Includes default playerAchievements structure
                ...parsedData,
                history: parsedData.history || [],
                playerName: parsedData.playerName || "Jugador",
                highScores: { // Ensure highScores structure is sound, merging with defaults
                    easy: (parsedData.highScores && parsedData.highScores.easy) ? parsedData.highScores.easy : { score: 0, name: "CPU" },
                    intermediate: (parsedData.highScores && parsedData.highScores.intermediate) ? parsedData.highScores.intermediate : { score: 0, name: "CPU" },
                    difficult: (parsedData.highScores && parsedData.highScores.difficult) ? parsedData.highScores.difficult : { score: 0, name: "CPU" }
                }
            };

            // Ensure playerAchievements is correctly structured, merging with current achievement list
            const initialAchievements = {};
            Object.values(ACHIEVEMENT_IDS).forEach(id => initialAchievements[id] = null);
            gameData.playerAchievements = { ...initialAchievements, ...(parsedData.playerAchievements || {}) };


            if (playerNameInput) { // Update input field if it exists on the current screen (usually start)
                playerNameInput.value = gameData.playerName;
            }

        } else {
            // If no stored data, ensure playerName is default and playerAchievements is initialized
            gameData.playerName = "Jugador";
            gameData.playerAchievements = {};
            Object.values(ACHIEVEMENT_IDS).forEach(id => gameData.playerAchievements[id] = null);
            // highScores already defaults correctly
        }
    }

    // --- UI Element References ---
    const startGameButton = document.getElementById('start-game-button');
    const theoryButton = document.getElementById('theory-button');
    const historyButton = document.getElementById('history-button');
    const authorsButton = document.getElementById('authors-button');
    const achievementsButton = document.getElementById('achievements-button'); // New button
    const levelButtons = document.querySelectorAll('.level-button');
    
    const currentScoreDisplay = document.getElementById('current-score');
    const questionCounterDisplay = document.getElementById('question-counter');
    const currentLevelTextDisplay = document.getElementById('current-level-text');
    
    const questionTextDisplay = document.getElementById('question-text');
    const questionImageContainer = document.getElementById('question-image-container');
    const questionImageDisplay = document.getElementById('question-image');
    const imageValueInfoDisplay = document.getElementById('image-value-info'); // For 'identify_part' type questions
    
    const optionsContainer = document.getElementById('options-container');
    const feedbackTextDisplay = document.getElementById('feedback-text');
    const nextQuestionButton = document.getElementById('next-question-button');
    
    const gameOverTitle = document.getElementById('game-over-title');
    const finalScoreText = document.getElementById('final-score-text');
    const playAgainButton = document.getElementById('play-again-button');
    const levelHighScoreText = document.getElementById('level-high-score-text'); // Added

    const historyListDisplay = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history-button');
    const timerDisplay = document.getElementById('timer-display'); // Added timer display

    // --- Event Listeners Setup ---z
    startGameButton.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        gameData.playerName = name || "Jugador"; // Update player name from input
        saveData(); // Save name change
        initAudio(); // Initialize audio on first user interaction
        showScreen('level-select-screen');
    });
    theoryButton.addEventListener('click', () => showScreen('theory-screen'));
    historyButton.addEventListener('click', () => {
        displayHistory();
        showScreen('history-screen');
    });
    authorsButton.addEventListener('click', () => showScreen('authors-screen'));
    achievementsButton.addEventListener('click', () => { // Listener for achievements
        displayAchievements();
        showScreen('achievements-screen');
    });
    
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            startGame(button.dataset.level);
        });
    });

    nextQuestionButton.addEventListener('click', goToNextQuestion);
    const quitGameButton = document.getElementById('quit-game-button');
    quitGameButton.addEventListener('click', () => {
        stopQuestionTimer(); // Stop timer when quitting
        showScreen('level-select-screen'); 
    });

    playAgainButton.addEventListener('click', () => {
        if(gameData.currentLevel) {
            startGame(gameData.currentLevel); // Restart with the same level
        }
    });

    clearHistoryButton.addEventListener('click', () => {
        gameData.history = [];
        saveData();
        displayHistory(); 
        // Add a small animation/feedback for clearing
        clearHistoryButton.textContent = "Historial Limpio ";
        setTimeout(() => clearHistoryButton.textContent = "Limpiar Historial", 1500);
    });

    // --- Game Logic ---
    /**
     * Starts a new game at the specified level.
     * @param {string} level - The difficulty level ('easy', 'intermediate', 'difficult').
     */
    function startGame(level) {
        initAudio(); // Ensure audio is ready
        gameData.currentLevel = level;
        timePerQuestion = TIME_CONFIG[level] || DEFAULT_TIME_PER_QUESTION; // Set time for this level
        // Create fresh copies of question objects for the current level to avoid state pollution
        gameData.currentLevelQuestions = questions
            .filter(q => q.level === level)
            .map(q => ({ ...q, options: q.options.map(opt => ({ ...opt })) })); // Deep copy options too
            
        // Simple shuffle of questions for variety
        gameData.currentLevelQuestions.sort(() => Math.random() - 0.5); 
        gameData.currentQuestionIndex = 0;
        gameData.score = 0;
        gameData.currentQuestionAnswered = false;
        
        stopQuestionTimer(); // Ensure any old timer is stopped
        updateGameHeaderUI();
        loadQuestion();
        showScreen('game-screen');
    }

    /** Loads and displays the current question. */
    function loadQuestion() {
        gameData.currentQuestionAnswered = false;
        questionTextDisplay.classList.add('loading'); // For animation
        
        // Delay slightly to allow "loading" animation to be visible
        setTimeout(() => {
            questionTextDisplay.classList.remove('loading');
            const question = gameData.currentLevelQuestions[gameData.currentQuestionIndex];

            if (!question) {
                endGame(); // No more questions
                return;
            }

            questionTextDisplay.textContent = question.text;
            
            imageValueInfoDisplay.textContent = '';
            if (question.image) {
                questionImageDisplay.src = question.image;
                questionImageDisplay.alt = question.image_alt || "Diagrama de la pregunta";
                questionImageDisplay.style.display = 'block';
                if (question.type === 'identify_part' && question.values_on_image) {
                    let infoParts = [];
                    for (const key in question.values_on_image) {
                        infoParts.push(`${key.toUpperCase()}: ${question.values_on_image[key]}`);
                    }
                    imageValueInfoDisplay.textContent = `Valores en imagen: ${infoParts.join(', ')}`;
                }
            } else {
                questionImageDisplay.style.display = 'none';
                questionImageDisplay.src = ""; 
            }

            optionsContainer.innerHTML = ''; // Clear previous options

            // Shuffle options
            let optionsToDisplay = [...question.options]; // Create a mutable copy
            // Fisher-Yates (Knuth) Shuffle
            for (let i = optionsToDisplay.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsToDisplay[i], optionsToDisplay[j]] = [optionsToDisplay[j], optionsToDisplay[i]];
            }
            question.currentShuffledOptions = optionsToDisplay; // Store shuffled options for handleAnswerSelection

            optionsToDisplay.forEach((option, indexInShuffledArray) => {
                const button = document.createElement('button');
                if (question.type === 'visual_select' && option.image) {
                    button.classList.add('image-option');
                    const img = document.createElement('img');
                    img.src = option.image;
                    img.alt = option.alt || `Opción ${indexInShuffledArray + 1}`;
                    button.appendChild(img);
                    if(option.text) { 
                        const span = document.createElement('span');
                        span.textContent = option.text;
                        button.appendChild(span);
                    }
                } else {
                    button.textContent = option.text;
                }
                // Pass the index in the shuffled array, the option object itself, and feedback messages
                button.addEventListener('click', () => handleAnswerSelection(indexInShuffledArray, option, question.feedback));
                optionsContainer.appendChild(button);
            });

            feedbackTextDisplay.textContent = '';
            feedbackTextDisplay.className = 'feedback-animation'; 
            nextQuestionButton.style.display = 'none';
            updateGameHeaderUI();
            startQuestionTimer(); 
        }, 150); 
    }

    /**
     * Handles the user's answer selection.
     * @param {number} selectedIndexInShuffledArray - The index of the selected option IN THE SHUFFLED LIST.
     * @param {object} selectedOptionObject - The actual option object that was selected.
     * @param {object} feedbackMessages - Object containing correct and incorrect feedback messages.
     */
    function handleAnswerSelection(selectedIndexInShuffledArray, selectedOptionObject, feedbackMessages) {
        if (gameData.currentQuestionAnswered) return;
        gameData.currentQuestionAnswered = true;
        stopQuestionTimer(); 
        
        const isCorrect = selectedOptionObject.correct;
        playSoundFeedback(isCorrect);

        const question = gameData.currentLevelQuestions[gameData.currentQuestionIndex];
        const selectedOptionRepresentation = question.type === 'visual_select' 
            ? (selectedOptionObject.alt || selectedOptionObject.text || `Opción ${selectedIndexInShuffledArray + 1}`) 
            : selectedOptionObject.text;

        if (isCorrect) {
            gameData.score += 10;
            gameData.streak = (gameData.streak || 0) + 1;
            if (gameData.streak === 5) {
                unlockAchievement(ACHIEVEMENT_IDS.STREAK_MASTER);
            }
            feedbackTextDisplay.textContent = feedbackMessages.correct || "¡Correcto!";
            feedbackTextDisplay.classList.add('correct', 'show');
            currentScoreDisplay.classList.add('updated'); 
            setTimeout(() => currentScoreDisplay.classList.remove('updated'), 600);

            const timeTaken = timePerQuestion - timeLeft;
            if (timeTaken <= 5) { 
                unlockAchievement(ACHIEVEMENT_IDS.FAST_ANSWER);
            }
        } else {
            gameData.streak = 0; // Reinicia la racha si se equivoca
            feedbackTextDisplay.textContent = feedbackMessages.incorrect || "Incorrecto.";
            feedbackTextDisplay.classList.add('incorrect', 'show');
        }
        
        const optionButtons = optionsContainer.querySelectorAll('button');
        // question.currentShuffledOptions matches the order of optionButtons
        optionButtons.forEach((btn, idx) => {
            btn.disabled = true; 
            btn.style.animation = 'none'; 

            const currentButtonOption = question.currentShuffledOptions[idx];

            if (idx === selectedIndexInShuffledArray) { // This is the button the user clicked
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');
            } else if (currentButtonOption.correct) { // This is an actual correct option
                 if (!isCorrect) { // Highlight the correct one(s) if user was wrong
                    btn.classList.add('correct'); 
                 }
            }
        });
        
        // Record history
        // Find the original correct option's text/alt for consistent logging
        const originalCorrectOption = question.options.find(opt => opt.correct);
        let correctAnswerTextForHistory = "Respuesta correcta no encontrada";
        if (originalCorrectOption) {
            if (question.type === 'visual_select') {
                correctAnswerTextForHistory = originalCorrectOption.alt || originalCorrectOption.text || "Imagen correcta";
            } else {
                correctAnswerTextForHistory = originalCorrectOption.text;
            }
        }

        gameData.history.push({
            level: gameData.currentLevel,
            questionText: question.text.substring(0,70) + (question.text.length > 70 ? "..." : ""),
            userAnswer: selectedOptionRepresentation,
            correctAnswer: correctAnswerTextForHistory,
            isCorrect: isCorrect
        });
        saveData();

        nextQuestionButton.style.display = 'block';
        updateGameHeaderUI();
    }

    /** Moves to the next question or ends the game if no more questions. */
    function goToNextQuestion() { 
        stopQuestionTimer(); // Ensure timer is stopped before loading next
        gameData.currentQuestionIndex++;
        if (gameData.currentQuestionIndex < gameData.currentLevelQuestions.length) {
            loadQuestion();
        } else {
            endGame(); // Completed all questions for the level
        }
    }
    /**
     * Ends the current game session.
     */
    function endGame() {
        stopQuestionTimer(); // Stop timer if game ends for any reason
        gameOverTitle.textContent = "¡Nivel Completado!";
        finalScoreText.textContent = `Tu puntaje final: ${gameData.score}`;
        
        // Update and display high score
        if (gameData.score > (gameData.highScores[gameData.currentLevel]?.score || 0)) {
            gameData.highScores[gameData.currentLevel] = { score: gameData.score, name: gameData.playerName };
        }
        levelHighScoreText.textContent = `Mejor puntaje para ${gameData.currentLevel}: ${gameData.highScores[gameData.currentLevel].score} por ${gameData.highScores[gameData.currentLevel].name}`;
        
        // Check for Perfect Level achievements
        const totalPossibleScore = gameData.currentLevelQuestions.length * 10;
        if (gameData.score === totalPossibleScore && totalPossibleScore > 0) { // Perfect score
            if (gameData.currentLevel === 'easy') {
                unlockAchievement(ACHIEVEMENT_IDS.PERFECT_EASY);
            } else if (gameData.currentLevel === 'intermediate') {
                unlockAchievement(ACHIEVEMENT_IDS.PERFECT_INTERMEDIATE);
            } else if (gameData.currentLevel === 'difficult') {
                unlockAchievement(ACHIEVEMENT_IDS.PERFECT_DIFFICULT);
            }
        }

        // Guardar historial y puntaje
        gameData.history.push({
            level: gameData.currentLevel,
            score: gameData.score,
            date: new Date().toLocaleDateString('es-ES')
        });

        // Actualizar niveles completados
        gameData.completedLevels[gameData.currentLevel] = true;
        // Logro Ninja Trigonométrico
        if (gameData.completedLevels.easy && gameData.completedLevels.intermediate && gameData.completedLevels.difficult) {
            unlockAchievement(ACHIEVEMENT_IDS.TRIGONOMETRY_NINJA);
        }
        // Logro Velocista Matemático
        if (typeof gameStartTimestamp !== 'undefined') {
            const totalTime = Math.floor((Date.now() - gameStartTimestamp) / 1000);
            if (totalTime <= 120) {
                unlockAchievement(ACHIEVEMENT_IDS.SPEED_DEMON);
            }
        }
        // Logro Mago de los Números
        gameData.totalPoints = (gameData.totalPoints || 0) + gameData.score;
        if (gameData.totalPoints >= 1000) {
            unlockAchievement(ACHIEVEMENT_IDS.MATH_WIZARD);
        }
        // Reiniciar racha al finalizar
        gameData.streak = 0;
        saveData();
        displayHighScoresOnLevelSelect(); // Update high scores on level select screen
        showScreen('game-over-screen');
    }

    /** Updates the game header UI (score, question count, timer). */
    function updateGameHeaderUI() {
        currentScoreDisplay.textContent = `Puntaje: ${gameData.score}`;
        if (gameData.currentLevelQuestions.length > 0) {
            const currentQ = Math.min(gameData.currentQuestionIndex + 1, gameData.currentLevelQuestions.length);
            questionCounterDisplay.textContent = `Pregunta: ${currentQ}/${gameData.currentLevelQuestions.length}`;
        }
        const levelName = gameData.currentLevel ? gameData.currentLevel.charAt(0).toUpperCase() + gameData.currentLevel.slice(1) : '';
        currentLevelTextDisplay.textContent = `Nivel: ${levelName}`;
        timerDisplay.textContent = `Tiempo: ${timeLeft}`; // Update timer display
    }
    
    /** Displays the game history on the history screen. */
    function displayHistory() {
        historyListDisplay.innerHTML = ''; // Clear previous items
        if (gameData.history.length === 0) {
            historyListDisplay.innerHTML = '<p>Aún no hay nada en tu historial. ¡Juega una partida! :D</p>';
            return;
        }
        // Show most recent first
        const reversedHistory = gameData.history.slice().reverse();
        reversedHistory.forEach((item, index) => { 
            const div = document.createElement('div');
            div.classList.add('history-item', item.isCorrect ? 'correct' : 'incorrect');
            // Stagger animation for history items
            div.style.animationDelay = `${index * 0.05}s`; 

            let historyHtml = `
                <strong>Nivel ${item.level}:</strong> ${item.questionText}<br>
                <em>Tu respuesta:</em> ${item.userAnswer} - <strong>${item.isCorrect ? '¡Bien!' : 'Mal'}</strong>`;
            if (!item.isCorrect) {
                historyHtml += `<br><em>Correcta:</em> ${item.correctAnswer}`;
            }
            div.innerHTML = historyHtml;
            historyListDisplay.appendChild(div);
        });
    }
    
    // --- Timer Functions ---
    function startQuestionTimer() {
        stopQuestionTimer(); // Clear any existing timer
        timeLeft = timePerQuestion;
        updateTimerDisplay();

        questionTimerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                handleTimeout();
            }
        }, 1000);
    }

    function stopQuestionTimer() {
        clearInterval(questionTimerInterval);
        questionTimerInterval = null;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = `Tiempo: ${timeLeft}`;
        if (timeLeft <= 5 && timeLeft > 0) { // Visual cue for low time
            timerDisplay.style.color = 'red';
        } else {
            timerDisplay.style.color = document.body.classList.contains('dark-mode') ? '#4fc3f7' : '#1e88e5';
        }
    }

    function handleTimeout() {
        stopQuestionTimer();
        if (gameData.currentQuestionAnswered) return; // Already answered
        
        gameData.currentQuestionAnswered = true;
        playSoundFeedback(false);

        feedbackTextDisplay.textContent = "¡Tiempo agotado!";
        feedbackTextDisplay.className = 'feedback-animation incorrect show';

        // Disable option buttons
        const optionButtons = optionsContainer.querySelectorAll('button');
        optionButtons.forEach(btn => btn.disabled = true);

        // Record history for timeout
        const question = gameData.currentLevelQuestions[gameData.currentQuestionIndex];
        if (question) { // Ensure question exists
             // Find the original correct option's text/alt for consistent logging
            const originalCorrectOption = question.options.find(opt => opt.correct);
            let correctAnswerTextForHistory = "Respuesta correcta no encontrada";
            if (originalCorrectOption) {
                if (question.type === 'visual_select') {
                    correctAnswerTextForHistory = originalCorrectOption.alt || originalCorrectOption.text || "Imagen correcta";
                } else {
                    correctAnswerTextForHistory = originalCorrectOption.text;
                }
            }
            gameData.history.push({
                level: gameData.currentLevel,
                questionText: question.text.substring(0,70) + (question.text.length > 70 ? "..." : ""),
                userAnswer: "Tiempo agotado",
                correctAnswer: correctAnswerTextForHistory,
                isCorrect: false
            });
            saveData();
        }
        
        nextQuestionButton.style.display = 'block';
        // updateGameHeaderUI(); // Score doesn't change, counter logic handled by nextQuestion
    }

    /** Displays high scores on the level select screen */
    function displayHighScoresOnLevelSelect() {
        document.querySelectorAll('.level-highscore').forEach(span => {
            const level = span.dataset.level;
            if (gameData.highScores && gameData.highScores[level]) {
                span.textContent = `Mejor: ${gameData.highScores[level].score} (${gameData.highScores[level].name})`;
            } else {
                span.textContent = `Mejor: 0 (CPU)`; // Should not happen if loadData is correct
            }
        });
    }

    /**
     * Unlocks an achievement if not already unlocked.
     * @param {string} achievementId - The ID of the achievement to unlock.
     */
    function unlockAchievement(achievementId) {
        if (gameData.playerAchievements[achievementId] === null) { // Only unlock if not already unlocked
            gameData.playerAchievements[achievementId] = new Date().toLocaleDateString('es-ES'); // Store date
            // Optionally, display a notification to the user here
            feedbackTextDisplay.textContent = `¡Logro Desbloqueado: ${ACHIEVEMENT_DETAILS[achievementId].name}!`;
            feedbackTextDisplay.className = 'feedback-animation correct show'; // Reuse feedback display
            // Clear the achievement message after a few seconds if it's on the game screen
            if(document.getElementById('game-screen').classList.contains('active')) {
                setTimeout(() => {
                    // Only clear if it's still an achievement message
                    if (feedbackTextDisplay.textContent.startsWith("¡Logro Desbloqueado:")) {
                         feedbackTextDisplay.textContent = '';
                         feedbackTextDisplay.className = 'feedback-animation';
                    }
                }, 3000);
            }
            saveData();
        }
    }

    /** Displays achievements on the achievements screen */
    function displayAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = ''; // Clear previous items

        let hasAnyAchievementsDefined = false;
        Object.values(ACHIEVEMENT_IDS).forEach((id, index) => {
            hasAnyAchievementsDefined = true;
            const achievementDetail = ACHIEVEMENT_DETAILS[id];
            const unlockedDate = gameData.playerAchievements[id];

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('achievement-item', unlockedDate ? 'unlocked' : 'locked');
            itemDiv.style.animationDelay = `${index * 0.05}s`; // Stagger animation

            const iconDiv = document.createElement('div');
            iconDiv.classList.add('achievement-icon');
            iconDiv.textContent = unlockedDate ? '🌟' : '❓';

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('achievement-details');

            const titleH4 = document.createElement('h4');
            titleH4.textContent = achievementDetail.name;

            const descP = document.createElement('p');
            descP.textContent = achievementDetail.description;
            
            const dateSmall = document.createElement('small');
            dateSmall.classList.add('achievement-date');
            dateSmall.textContent = unlockedDate ? `Desbloqueado: ${unlockedDate}` : "Bloqueado";

            detailsDiv.appendChild(titleH4);
            detailsDiv.appendChild(descP);
            detailsDiv.appendChild(dateSmall);

            itemDiv.appendChild(iconDiv);
            itemDiv.appendChild(detailsDiv);
            achievementsList.appendChild(itemDiv);
        });

        if (!hasAnyAchievementsDefined) { // Should not happen if ACHIEVEMENT_IDS is populated
            achievementsList.innerHTML = '<p>No hay logros configurados actualmente.</p>';
        } else if (Object.values(gameData.playerAchievements).every(date => date === null)) {
             // If all achievements are defined but none are unlocked yet by the player
            // This check is slightly redundant if the loop always runs but provides specific text
            // For an empty list if no achievements are defined vs none unlocked.
            // However, a more robust way is to check if any are unlocked.
            const anyUnlocked = Object.values(gameData.playerAchievements).some(date => date !== null);
            if (!anyUnlocked && hasAnyAchievementsDefined) {
                 // This message will be overwritten if items are added, so we could add a placeholder
                 // if achievementList is empty after the loop.
                 // For now, the individual "Bloqueado" messages handle this.
            }
        }
         // If the list is still empty after trying to populate, it means no achievements.
        if (achievementsList.children.length === 0 && hasAnyAchievementsDefined) {
             achievementsList.innerHTML = '<p>Aún no has desbloqueado ningún logro. ¡Sigue jugando!</p>';
        } else if (!hasAnyAchievementsDefined) {
            achievementsList.innerHTML = '<p>No hay logros para mostrar en este momento.</p>';
        }

    }
    
    // --- Initial Application Load ---
    loadData(); // Load any saved data
    displayHighScoresOnLevelSelect(); // Display high scores on level select screen
    showScreen('start-screen'); // Show the start screen first

    // --- HOOKS PARA MULTIJUGADOR ---
    // Lógica para MULTIPLAYER_CHAMPION y COMEBACK_KING debe integrarse en el flujo de multijugador.
    // Ejemplo de cómo podrías desbloquearlos:
    // function onMultiplayerWin(playerScore, opponentScore, wasComeback) {
    //     gameData.multiplayerWins = (gameData.multiplayerWins || 0) + 1;
    //     if (gameData.multiplayerWins >= 3) unlockAchievement(ACHIEVEMENT_IDS.MULTIPLAYER_CHAMPION);
    //     if (wasComeback) unlockAchievement(ACHIEVEMENT_IDS.COMEBACK_KING);
    //     saveData();
    // }

    const aboutButton = document.getElementById('about-button');
    if (aboutButton) {
        aboutButton.addEventListener('click', () => showScreen('about-screen'));
    }

    // --- Multiplayer Mode ---
    // Datos y estado del modo multijugador
    let multiplayerData = {
        player1: {
            name: "Jugador 1",
            score: 0,
            correctAnswers: 0,
            incorrectAnswers: 0
        },
        player2: {
            name: "Jugador 2",
            score: 0,
            correctAnswers: 0,
            incorrectAnswers: 0
        },
        totalQuestions: 20, // Cambiado de 15 a 20 para que sea par
        currentQuestionIndex: 0,
        currentQuestions: [],
        currentTurn: 1, // 1 para jugador 1, 2 para jugador 2
        currentQuestionAnswered: false,
        timerValue: 15, // Tiempo por pregunta en segundos
        timerInterval: null // Para almacenar el intervalo del temporizador
    };

    // Botón para ir a la pantalla de configuración multijugador
    document.getElementById('multiplayer-button').addEventListener('click', () => {
        showScreen('multiplayer-setup-screen');
    });

    // Selección de número de preguntas
    document.querySelectorAll('.question-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.question-option').forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');
            multiplayerData.totalQuestions = parseInt(e.target.dataset.questions);
        });
    });

    // Iniciar juego multijugador
    document.getElementById('start-multiplayer-button').addEventListener('click', () => {
        // Obtener nombres de los jugadores
        const player1Name = document.getElementById('player1-name-input').value.trim();
        const player2Name = document.getElementById('player2-name-input').value.trim();
        
        multiplayerData.player1.name = player1Name || "Jugador 1";
        multiplayerData.player2.name = player2Name || "Jugador 2";
        
        // Inicializar datos
        multiplayerData.player1.score = 0;
        multiplayerData.player1.correctAnswers = 0;
        multiplayerData.player1.incorrectAnswers = 0;
        multiplayerData.player2.score = 0;
        multiplayerData.player2.correctAnswers = 0;
        multiplayerData.player2.incorrectAnswers = 0;
        multiplayerData.currentQuestionIndex = 0;
        multiplayerData.currentTurn = 1; // Comienza jugador 1
        
        // Preparar preguntas (mezclar todas las preguntas disponibles)
        multiplayerData.currentQuestions = [];
        const allQuestions = [...questions]; // Copiar todas las preguntas
        shuffleArray(allQuestions);
        multiplayerData.currentQuestions = allQuestions.slice(0, multiplayerData.totalQuestions);
        
        // Iniciar juego
        startMultiplayerGame();
    });

    // Iniciar juego multijugador
    function startMultiplayerGame() {
        showScreen('multiplayer-game-screen');
        updateMultiplayerUI();
        loadMultiplayerQuestion();
    }

    // Cargar pregunta en modo multijugador
    function loadMultiplayerQuestion() {
        if (multiplayerData.currentQuestionIndex >= multiplayerData.totalQuestions) {
            endMultiplayerGame();
            return;
        }
        
        const currentQuestion = multiplayerData.currentQuestions[multiplayerData.currentQuestionIndex];
        multiplayerData.currentQuestionAnswered = false;
        
        // Actualizar UI con pregunta
        document.getElementById('multiplayer-question-text').textContent = currentQuestion.text;
        document.getElementById('multiplayer-feedback-text').textContent = "";
        document.getElementById('multiplayer-feedback-text').className = "feedback-animation";
        document.getElementById('multiplayer-next-question-button').style.display = 'none';
        
        // Agregar contador de preguntas
        const currentQ = multiplayerData.currentQuestionIndex + 1;
        const questionCounter = document.createElement('div');
        questionCounter.className = 'question-counter-multiplayer';
        questionCounter.textContent = `Pregunta: ${currentQ}/${multiplayerData.totalQuestions}`;
        
        // Intentar eliminar contador anterior si existe
        const oldCounter = document.querySelector('.question-counter-multiplayer');
        if (oldCounter) {
            oldCounter.remove();
        }
        
        // Insertar nuevo contador después del indicador de turno
        const turnIndicator = document.querySelector('.player-turn-indicator');
        if (turnIndicator && turnIndicator.parentNode) {
            turnIndicator.parentNode.insertBefore(questionCounter, turnIndicator.nextSibling);
        }
        
        // Crear o actualizar el temporizador
        let timerElement = document.getElementById('multiplayer-timer');
        if (!timerElement) {
            timerElement = document.createElement('div');
            timerElement.id = 'multiplayer-timer';
            timerElement.className = 'multiplayer-timer';
            // Insertar después del contador de preguntas
            if (questionCounter && questionCounter.parentNode) {
                questionCounter.parentNode.insertBefore(timerElement, questionCounter.nextSibling);
            }
        } else {
            // Si ya existe, asegurarse de que tiene la clase correcta
            timerElement.className = 'multiplayer-timer';
        }
        
        // Iniciar el temporizador
        startMultiplayerTimer();
        
        // Manejar imagen de la pregunta
        const questionImage = document.getElementById('multiplayer-question-image');
        const imageInfoText = document.getElementById('multiplayer-image-value-info');
        
        if (currentQuestion.image) {
            questionImage.src = currentQuestion.image;
            questionImage.alt = currentQuestion.image_alt || "Imagen de la pregunta";
            questionImage.style.display = 'block';
            
            // Si hay información adicional sobre la imagen
            if (currentQuestion.image_info) {
                imageInfoText.textContent = currentQuestion.image_info;
                imageInfoText.style.display = 'block';
            } else if (currentQuestion.values_on_image) {
                // Manejar valores en la imagen para preguntas de tipo identify_part
                let infoParts = [];
                for (const key in currentQuestion.values_on_image) {
                    infoParts.push(`${key.toUpperCase()}: ${currentQuestion.values_on_image[key]}`);
                }
                imageInfoText.textContent = `Valores en imagen: ${infoParts.join(', ')}`;
                imageInfoText.style.display = 'block';
            } else {
                imageInfoText.style.display = 'none';
            }
        } else {
            questionImage.style.display = 'none';
            imageInfoText.style.display = 'none';
        }
        
        // Opciones de respuesta
        const optionsContainer = document.getElementById('multiplayer-options-container');
        optionsContainer.innerHTML = ''; // Limpiar opciones anteriores
        
        // Copiar opciones para no alterar el objeto original
        const options = [...currentQuestion.options];
        
        // Barajar opciones
        shuffleArray(options);
        
        // Guardar las opciones barajadas en la pregunta actual para referencia
        currentQuestion.shuffledOptions = [...options];
        
        // Crear botones para las opciones
        options.forEach((option, index) => {
            const button = document.createElement('button');
            
            // Manejar opciones con imágenes (visual_select)
            if (currentQuestion.type === 'visual_select' && option.image) {
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
            
            // Agregar evento click
            button.addEventListener('click', () => {
                if (!multiplayerData.currentQuestionAnswered) {
                    handleMultiplayerAnswerSelection(index, option, currentQuestion.feedback);
                }
            });
            
            optionsContainer.appendChild(button);
        });
        
        // Actualizar UI para mostrar de quién es el turno
        updateMultiplayerTurnUI();
    }

    // Iniciar temporizador para el modo multijugador
    function startMultiplayerTimer() {
        // Limpiar cualquier temporizador anterior
        stopMultiplayerTimer();
        
        // Establecer el tiempo inicial
        multiplayerData.timerValue = 15;
        
        // Actualizar el elemento del temporizador
        updateMultiplayerTimerDisplay();
        
        // Iniciar el intervalo
        multiplayerData.timerInterval = setInterval(() => {
            multiplayerData.timerValue--;
            updateMultiplayerTimerDisplay();
            
            // Si el tiempo se agota
            if (multiplayerData.timerValue <= 0) {
                handleMultiplayerTimeout();
            }
        }, 1000);
    }

    // Detener el temporizador del modo multijugador
    function stopMultiplayerTimer() {
        if (multiplayerData.timerInterval) {
            clearInterval(multiplayerData.timerInterval);
            multiplayerData.timerInterval = null;
        }
    }
    
    // Actualizar la visualización del temporizador
    function updateMultiplayerTimerDisplay() {
        const timerElement = document.getElementById('multiplayer-timer');
        if (timerElement) {
            timerElement.textContent = `Tiempo: ${multiplayerData.timerValue}`;
            
            // Agregar efectos visuales cuando queda poco tiempo
            if (multiplayerData.timerValue <= 5) {
                timerElement.classList.add('low-time');
            } else {
                timerElement.classList.remove('low-time');
            }
        }
    }

    // Manejar cuando se agota el tiempo en el modo multijugador
    function handleMultiplayerTimeout() {
        stopMultiplayerTimer();
        
        if (multiplayerData.currentQuestionAnswered) return; // Ya se respondió la pregunta
        
        multiplayerData.currentQuestionAnswered = true;
        
        const feedbackText = document.getElementById('multiplayer-feedback-text');
        feedbackText.textContent = "¡Tiempo Agotado!";
        feedbackText.className = "feedback-animation incorrect show";
        
        // Reproducir sonido de incorrecto
        playSoundFeedback(false);
        
        // Desactivar todas las opciones
        const optionsContainer = document.getElementById('multiplayer-options-container');
        const optionButtons = optionsContainer.querySelectorAll('button');
        optionButtons.forEach(button => button.disabled = true);
        
        // Obtener la pregunta actual
        const currentQuestion = multiplayerData.currentQuestions[multiplayerData.currentQuestionIndex];
        
        // Marcar la opción correcta
        optionButtons.forEach((button, index) => {
            // Verificar si esta opción es la correcta usando el texto o la imagen
            let isCorrect = false;
            
            // Si es un botón con imagen, verificar por el texto en el span si existe
            if (button.classList.contains('image-option') && button.querySelector('span')) {
                const buttonText = button.querySelector('span').textContent;
                isCorrect = currentQuestion.options.some(opt => opt.text === buttonText && opt.correct);
            } else {
                // Si es un botón normal, verificar por el texto
                isCorrect = currentQuestion.options.some(opt => opt.text === button.textContent && opt.correct);
            }
            
            if (isCorrect) {
                button.classList.add('correct');
            }
        });
        
        // Registrar respuesta incorrecta para el jugador actual
        if (multiplayerData.currentTurn === 1) {
            multiplayerData.player1.incorrectAnswers++;
        } else {
            multiplayerData.player2.incorrectAnswers++;
        }
        
        // Mostrar el botón para la siguiente pregunta
        setTimeout(() => {
            document.getElementById('multiplayer-next-question-button').style.display = 'block';
        }, 400);
    }

    // Manejar selección de respuesta en modo multijugador
    function handleMultiplayerAnswerSelection(selectedIndex, selectedOption, feedbackMessages) {
        if (multiplayerData.currentQuestionAnswered) return;
        
        multiplayerData.currentQuestionAnswered = true;
        stopMultiplayerTimer(); // Detener el temporizador al seleccionar una respuesta
        
        const optionsContainer = document.getElementById('multiplayer-options-container');
        const optionButtons = optionsContainer.querySelectorAll('button');
        const feedbackText = document.getElementById('multiplayer-feedback-text');
        
        // Desactivar todas las opciones
        optionButtons.forEach(button => button.disabled = true);
        
        // Obtener la pregunta actual
        const currentQuestion = multiplayerData.currentQuestions[multiplayerData.currentQuestionIndex];
        
        // Marcar opción correcta e incorrecta
        optionButtons.forEach((button, index) => {
            // Verificar si esta opción es la correcta usando el texto o la imagen
            let isCorrect = false;
            
            // Si es un botón con imagen, verificar por el texto en el span si existe
            if (button.classList.contains('image-option') && button.querySelector('span')) {
                const buttonText = button.querySelector('span').textContent;
                isCorrect = currentQuestion.options.some(opt => opt.text === buttonText && opt.correct);
            } else {
                // Si es un botón normal, verificar por el texto
                isCorrect = currentQuestion.options.some(opt => opt.text === button.textContent && opt.correct);
            }
            
            // Marcar la opción correcta
            if (isCorrect) {
                button.classList.add('correct');
            }
            
            // Marcar la opción incorrecta seleccionada
            if (index === selectedIndex && !selectedOption.correct) {
                button.classList.add('incorrect');
            }
        });
        
        // Mostrar retroalimentación
        if (selectedOption.correct) {
            feedbackText.textContent = feedbackMessages.correct || "¡Correcto!";
            feedbackText.className = "feedback-animation correct";
            playSoundFeedback(true);
            
            // Actualizar puntuación del jugador actual
            if (multiplayerData.currentTurn === 1) {
                multiplayerData.player1.score += 10;
                multiplayerData.player1.correctAnswers++;
                document.getElementById('player1-points').textContent = multiplayerData.player1.score;
                document.getElementById('player1-points').classList.add('updated');
                setTimeout(() => document.getElementById('player1-points').classList.remove('updated'), 1000);
            } else {
                multiplayerData.player2.score += 10;
                multiplayerData.player2.correctAnswers++;
                document.getElementById('player2-points').textContent = multiplayerData.player2.score;
                document.getElementById('player2-points').classList.add('updated');
                setTimeout(() => document.getElementById('player2-points').classList.remove('updated'), 1000);
            }
        } else {
            feedbackText.textContent = feedbackMessages.incorrect || "Incorrecto";
            feedbackText.className = "feedback-animation incorrect";
            playSoundFeedback(false);
            
            // Registrar respuesta incorrecta
            if (multiplayerData.currentTurn === 1) {
                multiplayerData.player1.incorrectAnswers++;
            } else {
                multiplayerData.player2.incorrectAnswers++;
            }
        }
        
        // Mostrar animación de retroalimentación
        setTimeout(() => {
            feedbackText.classList.add('show');
        }, 50);
        
        // Mostrar botón para siguiente pregunta
        setTimeout(() => {
            document.getElementById('multiplayer-next-question-button').style.display = 'block';
        }, 400);
    }

    // Botón para siguiente pregunta en multijugador
    document.getElementById('multiplayer-next-question-button').addEventListener('click', () => {
        multiplayerData.currentQuestionIndex++;
        
        // Cambiar turno
        multiplayerData.currentTurn = multiplayerData.currentTurn === 1 ? 2 : 1;
        
        // Cargar siguiente pregunta
        loadMultiplayerQuestion();
    });

    // Actualizar interfaz de usuario en multijugador
    function updateMultiplayerUI() {
        // Mostrar nombres de jugadores
        document.getElementById('display-player1-name').textContent = multiplayerData.player1.name;
        document.getElementById('display-player2-name').textContent = multiplayerData.player2.name;
        
        // Mostrar puntuaciones
        document.getElementById('player1-points').textContent = multiplayerData.player1.score;
        document.getElementById('player2-points').textContent = multiplayerData.player2.score;
    }

    // Actualizar interfaz para mostrar de quién es el turno
    function updateMultiplayerTurnUI() {
        const turnIndicator = document.querySelector('.player-turn-indicator');
        const player1Score = document.getElementById('player1-score');
        const player2Score = document.getElementById('player2-score');
        const currentPlayerNameSpan = document.getElementById('current-player-name');
        
        if (multiplayerData.currentTurn === 1) {
            turnIndicator.className = 'player-turn-indicator player1-turn';
            currentPlayerNameSpan.textContent = multiplayerData.player1.name;
            player1Score.classList.add('active');
            player2Score.classList.remove('active');
        } else {
            turnIndicator.className = 'player-turn-indicator player2-turn';
            currentPlayerNameSpan.textContent = multiplayerData.player2.name;
            player1Score.classList.remove('active');
            player2Score.classList.add('active');
        }
    }

    // Finalizar juego multijugador
    function endMultiplayerGame() {
        // Asegurarse de detener el temporizador
        stopMultiplayerTimer();
        
        showScreen('multiplayer-results-screen');
        
        // Actualizar datos de jugadores en la pantalla de resultados
        document.getElementById('result-player1-name').textContent = multiplayerData.player1.name;
        document.getElementById('result-player2-name').textContent = multiplayerData.player2.name;
        
        document.getElementById('player1-final-points').textContent = multiplayerData.player1.score;
        document.getElementById('player2-final-points').textContent = multiplayerData.player2.score;
        
        document.getElementById('player1-correct-answers').textContent = multiplayerData.player1.correctAnswers;
        document.getElementById('player2-correct-answers').textContent = multiplayerData.player2.correctAnswers;
        
        document.getElementById('player1-incorrect-answers').textContent = multiplayerData.player1.incorrectAnswers;
        document.getElementById('player2-incorrect-answers').textContent = multiplayerData.player2.incorrectAnswers;
        
        // Determinar ganador
        const winnerContainer = document.getElementById('winner-container');
        
        if (multiplayerData.player1.score > multiplayerData.player2.score) {
            winnerContainer.innerHTML = `<div class="winner-announcement">
                ¡${multiplayerData.player1.name} gana!
            </div>`;
            document.getElementById('player1-result').classList.add('winner');
            document.getElementById('player2-result').classList.remove('winner');
        } else if (multiplayerData.player2.score > multiplayerData.player1.score) {
            winnerContainer.innerHTML = `<div class="winner-announcement">
                ¡${multiplayerData.player2.name} gana!
            </div>`;
            document.getElementById('player1-result').classList.remove('winner');
            document.getElementById('player2-result').classList.add('winner');
        } else {
            winnerContainer.innerHTML = `<div class="tie-result">
                ¡Empate!
            </div>`;
            document.getElementById('player1-result').classList.remove('winner');
            document.getElementById('player2-result').classList.remove('winner');
        }
    }

    // Botón para jugar de nuevo en modo multijugador
    document.getElementById('play-again-multiplayer-button').addEventListener('click', () => {
        showScreen('multiplayer-setup-screen');
    });

    // Botón para salir del juego multijugador
    document.getElementById('quit-multiplayer-button').addEventListener('click', () => {
        showScreen('start-screen');
    });

});