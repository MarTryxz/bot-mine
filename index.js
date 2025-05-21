// index.js

const mineflayer = require('mineflayer');
const fetch = require('node-fetch'); // Make sure this is the CommonJS version if you're not using ES modules

// Configuration constants
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'mistral';
const OLLAMA_MAX_TOKENS = 500;
const BOT_HOST = 'localhost';
const BOT_PORT = 59647;
const BOT_USERNAME = 'Miner';
const MOVEMENT_INTERVAL = 100; // ms
// const MOVEMENT_SPEED = 0.1; // Not directly used by setControlState, speed is implicit

// This function is now exported for testing
async function getMistralResponse(prompt) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return 'Prompt cannot be empty.';
  }

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        max_tokens: OLLAMA_MAX_TOKENS
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Ollama API error: ${response.status} ${response.statusText}`, errorBody);
      return `Error communicating with Mistral (HTTP ${response.status}). Please check server logs.`;
    }

    const data = await response.json();

    if (data && data.response) {
      return data.response;
    } else {
      console.warn('Ollama API response did not contain a "response" field:', data);
      return 'Mistral provided an empty or invalid response.';
    }

  } catch (error) {
    console.error('Error calling Ollama API:', error);
    if (error.code === 'ECONNREFUSED') {
      return 'Could not connect to Mistral service. Is Ollama running?';
    }
    return 'An unexpected error occurred while consulting Mistral.';
  }
}

// --- Main Bot Logic (to be called if not running tests) ---
function startBot() {
  const bot = mineflayer.createBot({
    host: BOT_HOST,
    port: BOT_PORT,
    username: BOT_USERNAME,
  });

  // --- Bot Event Handlers ---
  bot.once('spawn', () => {
    bot.chat('Hello World! I am ready.');
    console.log('Bot has spawned successfully.');
  });

  bot.on('error', (err) => {
    console.error('Bot encountered an error:', err);
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(`Bot kicked. Reason: ${reason}. Logged in: ${loggedIn}`);
  });

  bot.on('end', (reason) => {
    console.log(`Bot disconnected. Reason: ${reason}`);
  });

  // --- Core Functionalities ---
  function lookAtNearestPlayer() {
    const playerFilter = (entity) => entity.type === 'player';
    const playerEntity = bot.nearestEntity(playerFilter);
    if (!playerEntity) return;
    const pos = playerEntity.position.offset(0, playerEntity.height, 0);
    bot.lookAt(pos);
  }

  // --- Chat Commands ---
  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    if (message.startsWith('!mistral ')) {
      const question = message.slice('!mistral '.length).trim();
      bot.chat(`Thinking...`);
      const mistralResponse = await getMistralResponse(question); // Uses the exported function
      bot.chat(`Mistral: ${mistralResponse}`);
    }

    if (message.trim() === '!move start') {
      if (!isMoving) {
        startMovingInternal(); // Renamed to avoid conflict if we export startMoving
        bot.chat('Okay, I will start moving forward.');
      } else {
        bot.chat('I am already moving.');
      }
    }

    if (message.trim() === '!move stop') {
      if (isMoving) {
        stopMovingInternal(); // Renamed to avoid conflict
        bot.chat('Okay, I will stop moving.');
      } else {
        bot.chat('I am not currently moving.');
      }
    }
  });

  // --- Continuous Actions ---
  bot.on('physicTick', lookAtNearestPlayer);

  // --- Movement Logic ---
  let movementIntervalId = null;
  let isMoving = false; // This state should be managed within startBot scope

  function startMovingInternal() {
    if (isMoving) return;
    movementIntervalId = setInterval(() => {
      bot.setControlState('forward', true);
    }, MOVEMENT_INTERVAL);
    setTimeout(() => {
        if(isMoving) bot.setControlState('forward', false);
    }, MOVEMENT_INTERVAL + 50);
    isMoving = true;
    console.log('Bot started moving.');
  }

  function stopMovingInternal() {
    if (!isMoving || !movementIntervalId) return;
    clearInterval(movementIntervalId);
    movementIntervalId = null;
    bot.setControlState('forward', false);
    isMoving = false;
    console.log('Bot stopped moving.');
  }
}

// --- Exports for testing or external use ---
module.exports = {
  getMistralResponse,
  OLLAMA_API_URL, // Exporting constants used by the function might be useful for tests too
  OLLAMA_MODEL,
  OLLAMA_MAX_TOKENS
  // Potentially export other functions like startMoving, stopMoving if they were to be tested directly
};

// Start the bot only if this script is executed directly
if (require.main === module) {
  startBot();
}