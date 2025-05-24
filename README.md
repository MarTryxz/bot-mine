# Bot de Minecraft con IA (Ollama & Mineflayer)

Este es un bot de Minecraft que utiliza la API de Ollama para generar respuestas inteligentes usando un modelo de lenguaje como Mistral. El bot está construido con Mineflayer y tiene capacidades de interacción tanto con el mundo como con otros jugadores a través de comandos de chat.

## Características

- **Integración con Ollama:** Permite al bot responder preguntas utilizando un modelo de lenguaje configurado (por defecto, Mistral).
- **Comando de Chat `!mistral`:** Los jugadores pueden interactuar con el modelo de IA enviando mensajes en el chat con el formato `!mistral <tu pregunta>`.
- **Observación del Jugador Cercano:** El bot automáticamente mira al jugador más cercano.
- **Movimiento Controlado por Comandos:**
    - `!move start`: Inicia el movimiento del bot hacia adelante.
    - `!move stop`: Detiene el movimiento del bot.
- **Manejo de Errores Mejorado:** Proporciona feedback en la consola y en el chat sobre el estado de las operaciones (ej. conexión con Ollama).
- **Configurable:** Parámetros clave como los detalles del servidor de Minecraft, la configuración de Ollama y el nombre del bot se pueden ajustar fácilmente.
- **Pruebas Unitarias:** Incluye pruebas para la lógica de interacción con la API de Ollama.

## Requisitos

- Node.js (versión 14 o superior)
- Ollama instalado y corriendo localmente con un modelo descargado (ej. `ollama pull mistral`).
- Minecraft Java Edition (versión compatible con Mineflayer).
- Un servidor de Minecraft corriendo.

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/MarTryxz/bot-mine.git
    cd bot-mine
    ```

2.  Instala las dependencias (incluyendo dependencias de desarrollo para pruebas):
    ```bash
    npm install
    ```

3.  Asegúrate de que Ollama esté sirviendo el modelo deseado:
    ```bash
    ollama serve
    ```
    (Y que hayas descargado un modelo, por ejemplo: `ollama pull mistral`)

## Uso

1.  **Configura el Bot (Opcional):**
    Antes de iniciar, puedes revisar y ajustar las constantes definidas al inicio del archivo `index.js` (ver sección "Configuración" más abajo). Por defecto, el bot intentará conectarse a un servidor en `localhost` en el puerto `59647` y usará el modelo `mistral` de Ollama.

2.  Ejecuta el bot:
    ```bash
    node index.js
    ```
    o usando el script de npm:
    ```bash
    npm run start
    ```
    La consola mostrará mensajes de log, incluyendo cuando el bot se conecte al servidor de Minecraft.

3.  Conéctate al mismo servidor de Minecraft donde el bot está.

4.  Para interactuar con el bot en el chat de Minecraft:
    *   El bot te saludará (`Hello World! I am ready.`) cuando aparezca en el mundo.
    *   **Consultar a la IA:** Escribe `!mistral <tu pregunta>` (ej. `!mistral ¿Cuál es la capital de Francia?`). El bot responderá con `Thinking...` y luego `Mistral: <respuesta>`.
    *   **Iniciar Movimiento:** Escribe `!move start` para que el bot comience a moverse hacia adelante.
    *   **Detener Movimiento:** Escribe `!move stop` para que el bot deje de moverse.
    *   El bot mirará automáticamente al jugador más cercano.

## Ejecución de Pruebas Unitarias

Este proyecto utiliza Jest para las pruebas unitarias. Las pruebas se centran en la función `getMistralResponse` que maneja la comunicación con la API de Ollama.

Para ejecutar las pruebas:

1.  Asegúrate de haber instalado todas las dependencias (incluyendo `devDependencies`):
    ```bash
    npm install
    ```
2.  Ejecuta el comando de prueba:
    ```bash
    npm test
    ```
    Esto ejecutará los archivos de prueba (ubicados en `*.test.js`) y mostrará los resultados en la consola.

## Configuración

Puedes personalizar el bot modificando las siguientes constantes al inicio del archivo `index.js`:

-   **Conexión a Ollama:**
    -   `OLLAMA_API_URL`: URL del servicio Ollama (por defecto `'http://localhost:11434/api/generate'`).
    -   `OLLAMA_MODEL`: Nombre del modelo de Ollama a utilizar (por defecto `'mistral'`).
    -   `OLLAMA_MAX_TOKENS`: Número máximo de tokens para la respuesta de Ollama (por defecto `500`).

-   **Conexión del Bot de Minecraft:**
    -   `BOT_HOST`: Dirección del servidor de Minecraft (por defecto `'localhost'`).
    -   `BOT_PORT`: Puerto del servidor de Minecraft (por defecto `59647`).
    -   `BOT_USERNAME`: Nombre que usará el bot en el juego (por defecto `'Miner'`).

-   **Movimiento (para el movimiento pulsante actual):**
    -   `MOVEMENT_INTERVAL`: Intervalo en milisegundos para el pulso de movimiento (por defecto `100`). (Nota: Para un movimiento continuo suave, los comandos `!move start` y `!move stop` gestionan el estado directamente).

## Contribución

Si deseas contribuir al proyecto:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama para tu característica (`git checkout -b feature/AmazingFeature`).
3.  Realiza tus cambios y haz commit (`git commit -m 'Add some AmazingFeature'`).
4.  Haz push a tu rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Autor

Creado por MarTryxz (Actualizado y refactorizado durante la sesión de IA)
