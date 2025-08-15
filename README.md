# 🤖 Chat con DeepSeek Coder - Microservicio Ollama

Una aplicación web simple y rápida para chatear con el modelo **DeepSeek Coder** a través de la API de Ollama, especializada en programación y desarrollo de software.

## ✨ Características

- 🚀 **Chat en tiempo real** con DeepSeek Coder
- ⚡ **Respuestas optimizadas** para mayor velocidad
- 💻 **Especializado en programación** y desarrollo
- 🎨 **Interfaz simple y funcional** 
- 📱 **Diseño responsive** para móviles y escritorio
- 🔗 **Conexión directa** a Ollama API
- 🗑️ **Función para limpiar** el historial del chat

## 🏗️ Arquitectura del Proyecto

```
microservicio01/
├── app.py                 # Servidor Flask principal
├── requirements.txt       # Dependencias de Python
├── README.md             # Este archivo
├── templates/
│   └── index.html        # Página HTML del chat
└── static/
    ├── style.css         # Estilos CSS
    └── script.js         # Lógica JavaScript del chat
```

## 🚀 Instalación y Configuración

### Prerrequisitos

1. **Python 3.7+** instalado en tu sistema
2. **Ollama** ejecutándose en `localhost:11434`
3. **Modelo DeepSeek Coder** descargado en Ollama

### Pasos de instalación

1. **Clona o descarga** este proyecto
2. **Instala las dependencias**:
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Asegúrate de que Ollama esté ejecutándose**:
   ```bash
   # En otra terminal
   ollama serve
   ```

4. **Descarga el modelo DeepSeek Coder** (si no lo tienes):
   ```bash
   ollama pull deepseek-coder
   ```

## 🎯 Uso

### Iniciar el microservicio

```bash
python3 app.py
```

El servicio estará disponible en:
- 🌐 **Página web**: http://localhost:5000
- 🔗 **API de chat**: http://localhost:5000/api/chat

### Usar la aplicación

1. **Abre tu navegador** y ve a http://localhost:5000
2. **Verifica el estado** de conexión con Ollama
3. **Escribe tu pregunta** de programación en el campo de texto
4. **Presiona Enter** o haz clic en "Enviar"
5. **Recibe la respuesta** de DeepSeek Coder en tiempo real
6. **Usa "🗑️ Limpiar Chat"** para empezar una nueva conversación

## ⚡ Optimizaciones de Velocidad

El proyecto incluye varias optimizaciones para respuestas más rápidas:

### Parámetros del modelo optimizados:
- **`temperature: 0.1`** - Respuestas más consistentes y rápidas
- **`top_p: 0.1`** - Menor aleatoriedad = mayor velocidad
- **`top_k: 10`** - Menos opciones = respuestas más rápidas
- **`num_predict: 100`** - Limita la longitud de respuesta
- **`repeat_penalty: 1.0`** - Evita repeticiones innecesarias

### Configuraciones del servidor:
- **Timeout reducido** de 30 a 15 segundos
- **Indicadores de carga** para mejor experiencia de usuario

## 📡 API Endpoints

### GET /
Página principal del chat web.

### POST /api/chat
Proxy para la API de Ollama. Envía un mensaje al modelo DeepSeek Coder.

**Request:**
```json
{
    "message": "Tu pregunta de programación aquí"
}
```

**Response:**
```json
{
    "model": "deepseek-coder",
    "message": {
        "content": "Respuesta del modelo"
    },
    "usage": {...}
}
```

### GET /api/respuesta
Endpoint de prueba que retorna un mensaje simple.

## 🔧 Configuración

### Cambiar el modelo de IA

Para usar un modelo diferente a DeepSeek Coder, modifica la variable en `app.py`:

```python
# En la función chat()
"model": "llama2"  # o cualquier otro modelo disponible
```

### Cambiar el puerto

Modifica la línea final en `app.py`:

```python
app.run(host='0.0.0.0', port=8080)  # Puerto 8080
```

### Ajustar parámetros de velocidad

Modifica los parámetros en `app.py` para ajustar la velocidad vs. calidad:

```python
"options": {
    "temperature": 0.1,    # 0.0 = más rápido, 1.0 = más creativo
    "top_p": 0.1,         # 0.0 = más rápido, 1.0 = más variado
    "num_predict": 100,   # Menor = más rápido, Mayor = respuestas más largas
}
```

## 🐛 Solución de Problemas

### Error de conexión con Ollama

1. **Verifica que Ollama esté ejecutándose**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Asegúrate de que el modelo esté descargado**:
   ```bash
   ollama list
   ```

3. **Descarga el modelo si no está disponible**:
   ```bash
   ollama pull deepseek-coder
   ```

4. **Reinicia Ollama** si es necesario:
   ```bash
   pkill ollama
   ollama serve
   ```

### Puerto 5000 ocupado (macOS)

En macOS, el puerto 5000 puede estar ocupado por AirPlay. Solucion:

1. **Deshabilitar AirPlay Receiver**:
   - System Preferences → Sharing → AirPlay Receiver


### Problemas de dependencias

Si hay problemas con las dependencias:

```bash
pip3 install --upgrade pip
pip3 install -r requirements.txt --force-reinstall
```

## 💻 Tecnologías Utilizadas

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: Ollama REST API
- **Modelo de IA**: DeepSeek Coder
- **Estilos**: CSS personalizado con gradientes y animaciones

## 🎨 Personalización

### Cambiar colores

Modifica las variables CSS en `static/style.css`:

```css
body {
    background: linear-gradient(135deg, #tu-color 0%, #otro-color 100%);
}
```

### Agregar funcionalidades

El archivo `static/script.js` está estructurado de manera modular. Puedes:

- Agregar nuevos tipos de mensajes
- Implementar historial de conversaciones
- Agregar exportación de chats
- Integrar con otras APIs

## 📱 Compatibilidad

- ✅ **Chrome** 80+
- ✅ **Firefox** 75+
- ✅ **Safari** 13+
- ✅ **Edge** 80+
- ✅ **Móviles** (iOS Safari, Chrome Mobile)

## 🔍 Funciones Especiales

### Verificación automática de conexión
La aplicación verifica automáticamente:
- Estado de conexión con Ollama
- Disponibilidad del modelo deepseek-coder

### Indicadores de estado
- 🟢 **Verde**: Conectado a Ollama
- 🔴 **Rojo**: Sin conexión
- 🟡 **Amarillo**: Error de conexión

### Función de limpieza
- Botón "🗑️ Limpiar Chat" para reiniciar la conversación
- Útil para empezar nuevos temas o proyectos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request


### Evidencia: Funcionamiento del LLm
![Evidencia 1](screenshots/evidencia1.png)

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de solución de problemas
2. Verifica que Ollama esté funcionando correctamente
3. Asegúrate de que el modelo deepseek-coder esté descargado
4. Revisa los logs del servidor Flask
5. Abre un issue en el repositorio

## 🚀 Roadmap

### Próximas funcionalidades:
- [ ] Múltiples modelos de IA

---

**¡Disfruta programando con DeepSeek Coder! 🚀💻**

*Desarrollado con ❤️ para la comunidad de desarrolladores* 