from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
import logging

CWD = os.path.dirname(os.path.abspath(__file__))
# Explicitly set template and static folders to avoid TemplateNotFound when the
# app is started from a different working directory or imported as a module.
app = Flask(__name__, template_folder=os.path.join(CWD, 'templates'), static_folder=os.path.join(CWD, 'static'))
CORS(app)

# Configuración via environment variables
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
MODEL = os.getenv('MODEL', 'deepseek-coder')
TIMEOUT = int(os.getenv('OLLAMA_TIMEOUT', '15'))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route('/')
def index():
    """Página principal del chat"""
    return render_template('index.html')


@app.route('/api/respuesta')
def respuesta():
    return jsonify({"mensaje": "que onda, son la respuesta!"})


@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy para la API de Ollama.

    Acepta dos formatos de petición:
    - {"message": "texto"}  -> se envía como message al modelo configurado
    - cuerpo completo compatible con la API de Ollama (containing 'messages') -> se reenvía tal cual
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "JSON inválido"}), 400

    if not data:
        return jsonify({"error": "Cuerpo JSON requerido"}), 400

    # Construir el payload para Ollama
    if isinstance(data, dict) and 'message' in data and isinstance(data.get('message'), str):
        user_message = data.get('message').strip()
        if not user_message:
            return jsonify({"error": "Mensaje requerido"}), 400

        payload = {
            "model": MODEL,
            "messages": [{"role": "user", "content": user_message}],
            "stream": False,
            "options": data.get('options', {
                "temperature": 0.1,
                "top_p": 0.1,
                "top_k": 10,
                "num_predict": 100,
                "repeat_penalty": 1.0
            })
        }
    else:
        # Suponemos que el cliente envió ya el formato completo
        payload = data.copy()
        # Garantizar que exista el campo model
        if 'model' not in payload:
            payload['model'] = MODEL

    try:
        logger.info('Enviando petición a Ollama: %s/api/chat (model=%s)', OLLAMA_URL, payload.get('model'))
        ollama_response = requests.post(f'{OLLAMA_URL}/api/chat', json=payload, timeout=TIMEOUT)
    except requests.exceptions.Timeout:
        logger.exception('Timeout al contactar Ollama')
        return jsonify({"error": "Timeout al conectar con Ollama"}), 504
    except requests.exceptions.RequestException as exc:
        logger.exception('Error al conectar con Ollama: %s', exc)
        return jsonify({"error": "No se pudo conectar con Ollama"}), 502

    try:
        resp_json = ollama_response.json()
    except ValueError:
        logger.error('Respuesta no-JSON de Ollama: %s', ollama_response.text)
        return jsonify({"error": "Respuesta no válida de Ollama"}), 502

    if ollama_response.status_code == 200:
        return jsonify(resp_json)
    else:
        logger.error('Ollama devolvió error %s: %s', ollama_response.status_code, resp_json)
        return jsonify({"error": "Error en Ollama", "details": resp_json}), ollama_response.status_code


if __name__ == '__main__':
    logger.info('🚀 Iniciando microservicio de chat...')
    logger.info('📱 Página web: http://localhost:5001')
    logger.info('🔗 API: http://localhost:8080/api/chat')
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5001')))
