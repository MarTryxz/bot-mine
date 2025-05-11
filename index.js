const mineflayer = require('mineflayer');
const fetch = require('node-fetch');

const bot = mineflayer.createBot({
  host: 'localhost', // default 'localhost'
  port: 59647, // default 59647
  username: 'Miner', // default 'Bot'
});

bot.once('spawn', () => {
  bot.chat('Hello World!');
});

function lookAtNearestPlayer() {
  const playerFilter = (entity) => entity.type === 'player';
  const PlayerEntity = bot.nearestEntity(playerFilter);
  if (!PlayerEntity) return;

  const pos = PlayerEntity.position.offset(0, PlayerEntity.height, 0);
  bot.lookAt(pos);
}

bot.on('chat', async (username, message) => {
  // Si el mensaje empieza con "!mistral"
  if (message.startsWith('!mistral ')) {
    // Extrae la pregunta del mensaje
    const pregunta = message.slice('!mistral '.length).trim();

    try {
      // Llama a la API de Ollama
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral', // Usa tu modelo personalizado
          prompt: pregunta,
          stream: false, // Respuesta en un solo bloque
          max_tokens: 500 // Cantidad máxima de tokens a generar
        })
      });

      const data = await response.json();

      // Envia la respuesta al chat de Minecraft
      bot.chat(`Mistral: ${data.response}`);

    } catch (error) {
      console.error('Error:', error);
      bot.chat('Ocurrió un error al consultar a Mistral.');
    }
  }
});

bot.on('physicTick', () => {
  lookAtNearestPlayer();
});

// Haremos un pequeño padfinding para que el bot se mueva
setInterval(() => {
  bot.moveForward(0.1);
}, 100); // El bot se mueve cada 100 milisegundos

// Si queremos que vaya a un lugar específico, podemos usar este código
/*
bot.once('spawn', () => {
  bot.moveTo(0, 100, 0);
});
*/

bot.on('error', (err) => {
  console.error('Error:', err);
}); // este pequeño evento se dispara cuando ocurre un error en el bot