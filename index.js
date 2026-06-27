const CONFIG = {
    TELEFONO: "51900905472",
    MENSAJE_WA: "¡Hola Abraham! Te escribo para consultarte si puedo ir con un acompañante a tu cumple.",
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbziFruZ8LH0qn81fc8oSWKsjtv-TzAvKx8cx-bhQRkYR3mwjMFzNPs1wMEB8_tJvkqjEA/exec" 
};

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERENCIAS DE ELEMENTOS ---
    const waBtn = document.getElementById('whatsappLink');
    const splashScreen = document.getElementById('splashScreen');
    const formContainer = document.getElementById('formContainer');
    const btnIrAlFormulario = document.getElementById('btnIrAlFormulario');
    
    const music = document.getElementById('bgMusic');
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');

    // --- 2. CONFIGURACIÓN INICIAL ---
    if (waBtn) {
        waBtn.href = `https://wa.me/${CONFIG.TELEFONO}?text=${encodeURIComponent(CONFIG.MENSAJE_WA)}`;
    }

    // --- 3. LÓGICA DE MÚSICA Y MUTE ---
    
    const toggleMute = () => {
        if (music.paused) {
            music.play();
            muteBtn.classList.remove('muted');
            muteIcon.innerText = "🔊";
        } else {
            music.pause();
            muteBtn.classList.add('muted');
            muteIcon.innerText = "🔇";
        }
    };

    const startMusic = () => {
        if (music.paused && !muteBtn.classList.contains('muted')) {
            music.play().then(() => {
                muteBtn.classList.remove('muted');
                muteIcon.innerText = "🔊";
                eliminarEventosDeInicio();
            }).catch(e => {
                console.log("Esperando interacción para audio...");
            });
        }
    };

    // Escuchadores para "desbloquear" el audio
    const eliminarEventosDeInicio = () => {
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
        window.removeEventListener('scroll', startMusic);
    };

    document.addEventListener('click', startMusic);
    document.addEventListener('touchstart', startMusic);
    window.addEventListener('scroll', startMusic); 

    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        toggleMute();
    });

    // --- 4. TRANSICIÓN SPLASH -> FORMULARIO ---
    btnIrAlFormulario.addEventListener('click', () => {
        startMusic();

        splashScreen.style.transition = 'opacity 0.5s';
        splashScreen.style.opacity = '0';
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            formContainer.style.display = 'block';
            formContainer.classList.add('fade-in'); 
            window.scrollTo(0, 0);
        }, 500);
    });
});

// --- 5. LÓGICA DE ENVÍO DE FORMULARIO ---
const form = document.getElementById('invitacionForm');
const mensajeDiv = document.getElementById('mensaje');
const btnSubmit = document.getElementById('btnSubmit');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Enviando...";

        const formData = {
            nombre: document.getElementById('nombre').value,
            asistencia: document.querySelector('input[name="asistencia"]:checked').value
        };

        try {
            await fetch(CONFIG.WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', 
                body: JSON.stringify(formData)
            });

            // Ocultar el formulario y elementos extra
            form.style.display = "none";
            const extras = ['.info-box'];
            extras.forEach(selector => {
                const el = document.querySelector(selector);
                if(el) el.style.display = "none";
            });

            // Mostrar pantalla según la respuesta
            if (formData.asistencia === "Sí") {
                document.getElementById('nombreInvitadoSi').textContent = formData.nombre;
                const pantallaS = document.getElementById('confirmacionSi');
                pantallaS.style.display = 'block';
                pantallaS.classList.add('confirmacion-enter');
            } else {
                document.getElementById('nombreInvitadoNo').textContent = formData.nombre;
                const pantallaN = document.getElementById('confirmacionNo');
                pantallaN.style.display = 'block';
                pantallaN.classList.add('confirmacion-enter');
            }

        } catch (error) {
            console.error("Error de envío:", error);
            mensajeDiv.style.color = "red";
            mensajeDiv.innerText = "Error de conexión. Intenta de nuevo.";
            btnSubmit.disabled = false;
            btnSubmit.innerText = "ENVIAR RESPUESTA";
        }
    });
}