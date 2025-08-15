document.addEventListener('DOMContentLoaded', function() {
    const messagesDiv = document.getElementById('messages');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const statusSpan = document.getElementById('status');

    // Verificar conexión al cargar
    checkConnection();

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });

    function checkConnection() {
        fetch('http://localhost:11434/api/tags')
            .then(response => {
                if (response.ok) {
                    statusSpan.textContent = 'Estado: Conectado a Ollama';
                    statusSpan.style.color = '#4caf50';
                } else {
                    statusSpan.textContent = 'Estado: Error de conexión';
                    statusSpan.style.color = '#f44336';
                }
            })
            .catch(error => {
                statusSpan.textContent = 'Estado: Sin conexión a Ollama';
                statusSpan.style.color = '#f44336';
                console.error('Error:', error);
            });
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        addMessage(message, 'user');
        userInput.value = '';

        // Llamar a la API de Ollama
        callOllamaAPI(message);
    }

    function callOllamaAPI(message) {
        // Mostrar indicador de carga
        const loadingMessage = addMessage('⏳ Pensando...', 'assistant');
        
        const requestBody = {
            model: 'deepseek-coder',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            stream: false,
            options: {
                temperature: 0.1,
                top_p: 0.1,
                top_k: 10,
                num_predict: 100,
                repeat_penalty: 1.0
            }
        };

        fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const response = data.message.content;
            // Reemplazar el mensaje de carga con la respuesta real
            loadingMessage.textContent = `${response}\n\n`;
            loadingMessage.className = 'message assistant';
        })
        .catch(error => {
            // Reemplazar el mensaje de carga con el error
            loadingMessage.textContent = 'Error: No se pudo conectar con Ollama. Verifica que esté ejecutándose en localhost:11434';
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