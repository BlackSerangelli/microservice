document.addEventListener('DOMContentLoaded', function() {
    const messagesDiv = document.getElementById('messages');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const statusSpan = document.getElementById('status');

    // Verificar conexión al cargar (usa el proxy del backend)
    checkConnection();

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });

    function checkConnection() {
        // Primero intentamos verificar a través del proxy local
        fetch('/api/respuesta')
            .then(response => {
                if (response.ok) {
                    statusSpan.textContent = 'Estado: Backend activo (proxy)';
                    statusSpan.style.color = '#4caf50';
                } else {
                    statusSpan.textContent = 'Estado: Backend no disponible';
                    statusSpan.style.color = '#f44336';
                }
            })
            .catch(err => {
                // Si falla, indicamos estado de desconexión
                statusSpan.textContent = 'Estado: Backend no responde';
                statusSpan.style.color = '#f44336';
                console.error('Error:', err);
            });
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        addMessage(message, 'user');
        userInput.value = '';

        // Llamar a la API a través del proxy backend
        callBackendAPI(message);
    }

    function callBackendAPI(message) {
        // Mostrar indicador de carga
        const loadingMessage = addMessage('⏳ Pensando...', 'assistant');

        const requestBody = {
            message: message
        };

        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            // Manejar distintos formatos de respuesta
            let text = '';
            if (data && data.message && data.message.content) {
                text = data.message.content;
            } else if (data && data.response) {
                text = data.response;
            } else {
                text = JSON.stringify(data);
            }

            loadingMessage.textContent = `${text}\n\n`;
            loadingMessage.className = 'message assistant';
        })
        .catch(error => {
            const errMsg = (error && (error.error || error.message)) || 'Error desconocido al contactar el backend';
            loadingMessage.textContent = `Error: ${errMsg}`;
            loadingMessage.className = 'message assistant error';
            console.error('Error:', error);
        });
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return messageDiv; // Retornar el elemento para poder modificarlo después
    }

    // Función para limpiar el chat (definida dentro del scope)
    window.clearChat = function() {
        messagesDiv.innerHTML = '';
        // Agregar mensaje de confirmación
        addMessage('Chat limpiado', 'assistant');
    };
});
