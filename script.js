let selectedCamera = 1;
const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

// Función mágica para crear burbujas de chat
function appendMessage(sender, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${type}`; // type puede ser: 'sent', 'received' o 'system'

    if (type !== 'system') {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.innerText = sender;
        msgDiv.appendChild(headerDiv);
    }

    const textDiv = document.createElement('div');
    textDiv.innerText = text;
    msgDiv.appendChild(textDiv);

    chatWindow.appendChild(msgDiv);
    
    // Auto-scroll hacia abajo
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Lógica para seleccionar la cámara
document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        selectedCamera = e.target.dataset.cam;
        
        // Avisar en el chat
        appendMessage('', `Cambiaste el destino a Cámara ${selectedCamera}`, 'system');
    });
});

// Lógica para los botones rápidos (ahora lo envían de inmediato)
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        messageInput.value = e.target.innerText;
        document.getElementById('sendBtn').click(); // Simula un clic en enviar
    });
});

// Enviar con la tecla Enter
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('sendBtn').click();
    }
});

// Lógica principal de Enviar
document.getElementById('sendBtn').addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (!message) return;

    // 1. Lo mostramos en la pantalla inmediatamente como burbuja verde
    appendMessage(`YO -> CÁMARA ${selectedCamera}`, message, 'sent');
    messageInput.value = ''; // Limpiamos la caja

    try {
        // 2. Lo enviamos a Vercel/Pusher
        const res = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                target: `chat-camara-${selectedCamera}`,
                mensaje: message
            })
        });
        
        if (!res.ok) {
            appendMessage('', '❌ Error al entregar el mensaje', 'system');
        }
    } catch (error) {
        appendMessage('', '❌ Sin conexión a internet', 'system');
    }
});

// --- PREPARACIÓN PARA RECIBIR RESPUESTAS ---
// Cuando implementemos el botón en el iPad, las respuestas llegarán aquí.
// (Reemplaza 'TU_KEY_PUBLICA_AQUI' con la llave "key" de tu dashboard de Pusher)
const pusher = new Pusher('a7544f5eacb1f30eb5d7', {
    cluster: 'us2'
});

// El canal del director (donde todos los iPads mandan sus respuestas)
const directorChannel = pusher.subscribe('chat-director');
directorChannel.bind('respuesta-camara', function(data) {
    // Cuando un iPad responda, aparecerá una burbuja gris a la izquierda
    appendMessage(`CÁMARA ${data.camara_id}`, data.mensaje, 'received');
});