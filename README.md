# Bot de Minecraft con IA

Este es un bot de Minecraft que utiliza la API de Ollama para generar respuestas inteligentes usando el modelo Mistral. El bot está construido con Mineflayer y tiene capacidades de interacción tanto con el mundo como con otros jugadores.

## Características

- Integración con Ollama para respuestas de IA
- Sistema de chat con comando `!mistral`
- Seguimiento automático al jugador más cercano
- Movimiento automático del bot
- Manejo de errores básico

## Requisitos

- Node.js (versión 14 o superior)
- Ollama instalado y corriendo localmente
- Minecraft (versión compatible con Mineflayer)
- Servidor de Minecraft corriendo en localhost:59647

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/MarTryxz/bot-mine.git
cd bot-mine
```

2. Instala las dependencias:
```bash
npm install
```

3. Asegúrate de que Ollama esté corriendo:
```bash
ollama serve
```

## Uso

1. Ejecuta el bot:
```bash
node index.js
```

2. Conéctate a Minecraft usando:
   - Host: localhost
   - Puerto: 59647
   - Username: Tu elección

3. Para interactuar con el bot:
   - El bot te saludará automáticamente al conectarte
   - Usa el comando `!mistral` seguido de tu pregunta para obtener respuestas de IA
   - El bot te seguirá automáticamente
   - El bot se moverá automáticamente por el mundo

## Configuración

Puedes personalizar el bot modificando el archivo `index.js`:

- Cambiar el nombre del bot (actualmente "Miner")
- Cambiar el puerto de conexión
- Modificar la configuración de Ollama
- Ajustar el comportamiento del movimiento

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia ISC - consulta el archivo LICENSE para más detalles.

## Autor

Creado por MarTryxz
