const mineflayer = require('mineflayer');
const fetch = require('node-fetch');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 59647,
  username: 'Miner',
});

// Load pathfinder plugin
bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  bot.chat('Hello World!');
  
  // Initialize pathfinder movements
  const movements = new Movements(bot);
  bot.pathfinder.setMovements(movements);
});

function followPlayer() {
  const playerFilter = (entity) => entity.type === 'player';
  const playerEntity = bot.nearestEntity(playerFilter);
  
  if (!playerEntity) return;
  
  const mcData = require('minecraft-data')(bot.version);
  const movements = new Movements(bot, mcData);
  bot.pathfinder.setMovements(movements);
  
  // Set follow distance to 2 blocks
  const goal = new goals.GoalFollow(playerEntity, 2);
  bot.pathfinder.setGoal(goal, true);
}

bot.on('chat', async (username, message) => {
  if (message.startsWith('!mistral ')) {
    const pregunta = message.slice('!mistral '.length).trim();

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt: pregunta,
          stream: false,
          max_tokens: 500
        })
      });

      const data = await response.json();
      bot.chat(`Mistral: ${data.response}`);

    } catch (error) {
      console.error('Error:', error);
      bot.chat('Ocurrió un error al consultar a Mistral.');
    }
  }
});

// Update player following every tick
bot.on('physicTick', () => {
  followPlayer();
});

bot.on('error', (err) => {
  console.error('Error:', err);
});