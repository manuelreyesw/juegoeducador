document.addEventListener('DOMContentLoaded', () => {
    // --- Variables del Juego ---
    let nombreJugador = "Jugador"; // Nombre por defecto
    let monedasRecolectadas = 0;
    let vidas = 3;
    const TOTAL_MONEDAS = 10;
    let preguntaActiva = null;
    let gameOver = false;

    const contadorMonedas = document.getElementById('contador-monedas');
    const contadorVidas = document.getElementById('contador-vidas');
    const personaje = document.getElementById('personaje');
    
    // Elementos del DOM para la funcionalidad
    const monedas = document.querySelectorAll('.moneda');
    const bombas = document.querySelectorAll('.bomba');
    const musicaFondo = document.getElementById('musica-fondo');
    const contenidoJuego = document.getElementById('contenido-juego'); 
    const modalInicio = document.getElementById('modal-inicio'); 
    const modalPregunta = document.getElementById('modal-pregunta');

    // Configuración de movimiento 2D
    let personajePosicionX = 10;
    let personajePosicionY = 10; 
    const velocidad = 5; 
    const maxPosicionX = 95; 
    const maxPosicionY = 250; 
    const minPosicionY = 10;

    // --- Banco de Preguntas COMPLETO (10 Preguntas) ---
    const bancoPreguntas = [
        { pregunta: "¿Qué batalla selló la independencia del actual Ecuador el 24 de mayo de 1822?", opciones: ["Batalla de Pichincha", "Batalla de Boyacá", "Batalla de Junín"], respuestaCorrecta: "Batalla de Pichincha" },
        { pregunta: "¿Cuál fue el primer presidente constitucional de la República del Ecuador en 1830?", opciones: ["Juan José Flores", "Gabriel García Moreno", "Vicente Rocafuerte"], respuestaCorrecta: "Juan José Flores" },
        { pregunta: "¿A qué país se anexionó Ecuador antes de ser una república independiente?", opciones: ["Gran Colombia", "Perú", "Virreinato del Río de la Plata"], respuestaCorrecta: "Gran Colombia" },
        { pregunta: "¿Cuál es la cultura precolombina más antigua de Ecuador, conocida por sus figurillas de cerámica?", opciones: ["Cultura Valdivia", "Cultura Tuncahuán", "Cultura Tolita"], respuestaCorrecta: "Cultura Valdivia" },
        { pregunta: "¿Qué evento de 1809 es conocido como el 'Primer Grito de Independencia'?", opciones: ["La instalación de la Junta Soberana de Quito", "La Batalla de Pichincha", "La Revolución Liberal"], respuestaCorrecta: "La instalación de la Junta Soberana de Quito" },
        { pregunta: "¿Cuál de estos presidentes impulsó grandes obras de infraestructura como el ferrocarril a la Costa (siglo XIX/XX)?", opciones: ["Eloy Alfaro", "Jaime Roldós Aguilera", "José María Velasco Ibarra"], respuestaCorrecta: "Eloy Alfaro" },
        { pregunta: "¿Qué personaje histórico lideró la defensa inca contra la conquista española en el norte de Ecuador?", opciones: ["Rumiñahui", "Atahualpa", "Túpac Yupanqui"], respuestaCorrecta: "Rumiñahui" },
        { pregunta: "¿En qué siglo se instauró la Real Audiencia de Quito como una división administrativa del Imperio Español?", opciones: ["Siglo XVI", "Siglo XVII", "Siglo XVIII"], respuestaCorrecta: "Siglo XVI" },
        { pregunta: "¿Qué presidente ecuatoriano es conocido por haber firmado la abolición de la esclavitud en 1851?", opciones: ["José María Urbina", "Juan José Flores", "Gabriel García Moreno"], respuestaCorrecta: "José María Urbina" },
        { pregunta: "¿Cuál es el nombre del tratado que definió la frontera con Perú tras el conflicto de 1941?", opciones: ["Protocolo de Río de Janeiro", "Tratado de Ancon", "Acuerdo de Cartagena"], respuestaCorrecta: "Protocolo de Río de Janeiro" }
    ];

    // --- FUNCIONES PRINCIPALES ---

    // 1. Iniciar Juego (Llamada desde el botón en index.html)
    window.iniciarJuego = function() {
        const inputNombre = document.getElementById('nombre-jugador').value;
        if (inputNombre.trim() !== "") {
            nombreJugador = inputNombre.trim();
        }

        modalInicio.style.display = 'none';
        contenidoJuego.style.display = 'block';

        // Iniciar la música (funciona porque está ligada al clic)
        musicaFondo.play().catch(error => {
            console.log("Error al reproducir música.");
        });

        actualizarHUD();
    }

    function actualizarHUD() {
        contadorMonedas.textContent = monedasRecolectadas;
        contadorVidas.textContent = vidas;
    }

    function revisarFinDeJuego(victoria) {
        gameOver = true;
        modalPregunta.style.display = 'none';
        musicaFondo.pause(); 

        document.getElementById('texto-final').textContent = victoria
            ? `🎉 ¡Felicidades, ${nombreJugador}! Lograste las 10 monedas. Eres un experto en la historia de Ecuador.`
            : `💀 ¡Juego Terminado, ${nombreJugador}! Te quedaste sin vidas. Sigue estudiando la historia.`;
        
        document.getElementById('mensaje-final').style.display = 'flex';
    }

    function mostrarPregunta(index, monedaElemento) {
        if (monedaElemento.classList.contains('recogida') || gameOver) return;
        
        preguntaActiva = { ...bancoPreguntas[index], elemento: monedaElemento, index: index };
        
        document.getElementById('texto-pregunta').textContent = preguntaActiva.pregunta;
        const opcionesRespuesta = document.getElementById('opciones-respuesta');
        opcionesRespuesta.innerHTML = '';
        
        const opcionesMezcladas = preguntaActiva.opciones.sort(() => Math.random() - 0.5);

        opcionesMezcladas.forEach(opcion => {
            const boton = document.createElement('button');
            boton.textContent = opcion;
            boton.onclick = () => responderPregunta(opcion);
            opcionesRespuesta.appendChild(boton);
        });

        modalPregunta.style.display = 'flex';
    }

    function responderPregunta(respuesta) {
        if (!preguntaActiva) return;

        modalPregunta.style.display = 'none';

        if (respuesta === preguntaActiva.respuestaCorrecta) {
            // NOTIFICACIÓN DE ACIERTO
            alert("✅ ¡Respuesta Correcta! Has ganado una moneda de oro.");
            
            monedasRecolectadas++;
            preguntaActiva.elemento.classList.add('recogida');
            preguntaActiva.elemento.style.visibility = 'hidden'; 
            
            if (monedasRecolectadas >= TOTAL_MONEDAS) {
                revisarFinDeJuego(true);
            }
        } else {
            // NOTIFICACIÓN DE ERROR
            alert(`❌ ¡Respuesta Incorrecta! La respuesta correcta era: ${preguntaActiva.respuestaCorrecta}. Intenta con otra moneda.`);
        }

        actualizarHUD();
        preguntaActiva = null;
    }

    // --- Lógica de Colisiones ---

    // Función de colisión 2D con tolerancia (Asegura la detección)
    function verificarInterseccion(obj1, obj2) {
        const rect1 = obj1.getBoundingClientRect();
        const rect2 = obj2.getBoundingClientRect();
        
        const tolerancia = 20; 

        return (
            rect1.left < rect2.right - tolerancia &&
            rect1.right > rect2.left + tolerancia &&
            rect1.top < rect2.bottom - tolerancia &&
            rect1.bottom > rect2.top + tolerancia
        );
    }

    function revisarColisiones() {
        if (gameOver || modalPregunta.style.display === 'flex') return;

        // A) Colisión con Monedas
        for (let i = 0; i < monedas.length; i++) {
            const moneda = monedas[i];
            const questionIndex = parseInt(moneda.getAttribute('data-index'));

            if (moneda.style.visibility !== 'hidden' && verificarInterseccion(personaje, moneda)) {
                mostrarPregunta(questionIndex, moneda);
                return; 
            }
        }

        // B) Colisión con Peligros (Calaveras)
        bombas.forEach((bomba) => {
            if (bomba.style.visibility !== 'hidden' && !bomba.classList.contains('impactada') && verificarInterseccion(personaje, bomba)) {
                
                bomba.classList.add('impactada');
                
                vidas--;
                actualizarHUD();
                
                if (vidas <= 0) {
                    revisarFinDeJuego(false);
                } else {
                    alert("💀 ¡Has tocado un peligro! Has perdido una vida."); 
                }

                bomba.style.visibility = 'hidden';
                setTimeout(() => {
                    bomba.classList.remove('impactada');
                    bomba.style.visibility = 'visible';
                }, 2000); 
            }
        });
    }

    // 2. Movimiento del Personaje (Activado por Teclado)
    document.addEventListener('keydown', (e) => {
        if (modalPregunta.style.display === 'flex' || gameOver || contenidoJuego.style.display === 'none') return;

        // Movimiento Horizontal
        if (e.key === 'ArrowRight') {
            personajePosicionX = Math.min(personajePosicionX + velocidad, maxPosicionX);
        } else if (e.key === 'ArrowLeft') {
            personajePosicionX = Math.max(personajePosicionX - velocidad, 0);
        }
        // Movimiento Vertical
        else if (e.key === 'ArrowUp') {
            personajePosicionY = Math.min(personajePosicionY + velocidad * 4, maxPosicionY); 
        } else if (e.key === 'ArrowDown') {
            personajePosicionY = Math.max(personajePosicionY - velocidad * 4, minPosicionY);
        }

        // Aplicar posiciones
        personaje.style.left = personajePosicionX + '%';
        personaje.style.bottom = personajePosicionY + 'px';
        
        revisarColisiones();
    });

    // Inicializar: Ocultar el juego y mostrar el inicio
    contenidoJuego.style.display = 'none';
    modalInicio.style.display = 'flex';
});