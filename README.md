# 🤖 Chat con DeepSeek Coder - Web estática (proxy opcional)

Esta es una versión ligera de la aplicación para chatear con el modelo **DeepSeek Coder** a través de la API de Ollama.

Ahora la interfaz es puramente estática: `index.html` está en la raíz del proyecto y la lógica cliente (`/static/script.js`) realiza las llamadas HTTP directamente a la API de Ollama (por defecto `http://localhost:11434`).

Si necesitas un proxy por restricciones CORS, hay un `app.py` de ejemplo en el repositorio; de lo contrario puedes servir la web directamente con un servidor estático.

## ✅ Qué cambió

- `index.html` está en la raíz del proyecto (ya no usamos `templates/`).
- Las llamadas al modelo se hacen desde el navegador hacia `http://localhost:11434/api/chat`.
- El servidor Flask ya no es necesario para servir la app; está incluido solo como referencia.

## 📁 Estructura del proyecto

```
microservicio01/
├── app.py                 # (opcional) proxy ejemplo — no necesario para la versión estática
├── requirements.txt       # Dependencias (solo si usas el proxy Flask)
├── README.md              # Este archivo
├── index.html             # Página HTML del chat (ahora en la raíz)
└── static/
   ├── style.css         # Estilos CSS
   └── script.js         # Lógica JavaScript del chat
```

## 🚀 Ejecutar localmente (rápido)

1. Arranca Ollama y asegúrate de que el modelo esté disponible:

```bash
ollama serve
ollama pull deepseek-coder
```

2. Sirve la aplicación estática desde la raíz del proyecto:

```bash
python3 -m http.server 8080
```

3. Abre en el navegador:

- http://localhost:8080

Si prefieres mantener la URL antigua `/templates/index.html`, crea una carpeta `templates` con un `index.html` que redirija a `/index.html`.

## ⚠️ Nota sobre CORS

Si el navegador bloquea las peticiones a `http://localhost:11434` por CORS verás errores en la consola. Opciones:

- Habilitar CORS en Ollama (si está soportado).
- Ejecutar un proxy local que añada los headers CORS.
- Usar el proxy `app.py` incluido (requiere Python/Flask).

## 🧭 Uso

1. Verifica que Ollama esté corriendo:

```bash
curl http://localhost:11434/api/tags
```

2. Escribe tu pregunta en la interfaz y presiona Enviar.

3. Usa "🗑️ Limpiar Chat" para reiniciar la conversación.

## 🐛 Solución de Problemas

Si algo no carga (404):

- Asegúrate de iniciar el servidor estático desde la raíz del proyecto.
- Verifica que `static/style.css` y `static/script.js` existan.
- Abre DevTools → Network y comprueba las rutas que fallan.

Si la API da errores, revisa los logs de Ollama y el estado del modelo.

---

Si quieres que actualice otra parte del README o que elimine `app.py` por completo, lo hago.
