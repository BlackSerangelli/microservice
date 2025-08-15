from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    """Página principal del chat"""
    return render_template('index.html')

@app.route('/api/respuesta')
def respuesta():
    return jsonify({"mensaje": "que onda, son la respuesta!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy para la API de Ollama"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "Mensaje requerido"}), 400
        
        # Llamar a Ollama con parámetros optimizados para velocidad
        ollama_response = requests.post(
            'http://localhost:11434/api/chat',
            json={
                "model": "deepseek-coder",
                "messages": [{"role": "user", "content": user_message}],
                "stream": False,
                "options": {
                    "temperature": 0.1,  # Menor temperatura = respuestas más rápidas y consistentes
                    "top_p": 0.1,        # Menor top_p = respuestas más rápidas
                    "top_k": 10,         # Menor top_k = respuestas más rápidas
                    "num_predict": 1000,  # Limitar longitud de respuesta
                    "repeat_penalty": 1.0 # Evitar repeticiones
                }
            },
            
        )
        
        if ollama_response.status_code == 200:
            return jsonify(ollama_response.json())
        else:
            return jsonify({"error": "Error en Ollama"}), ollama_response.status_code
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Iniciando microservicio de chat...")
    print("📱 Página web: http://localhost:5000")
    print("🔗 API: http://localhost:5000/api/chat")
    app.run(host='0.0.0.0', port=5000)