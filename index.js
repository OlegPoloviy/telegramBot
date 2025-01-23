import "dotenv/config";
import TelegramApi from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
const bot = new TelegramApi(token, { polling: true });

// Game options for inline keyboard
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                { text: '1', callback_data: '1' },
                { text: '2', callback_data: '2' },
                { text: '3', callback_data: '3' }
            ],
            [
                { text: '4', callback_data: '4' },
                { text: '5', callback_data: '5' },
                { text: '6', callback_data: '6' }
            ],
            [
                { text: '7', callback_data: '7' },
                { text: '8', callback_data: '8' },
                { text: '9', callback_data: '9' }
            ],
            [{ text: '0', callback_data: '0' }]
        ]
    })
};

// Option to replay the game
const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: 'Play Again', callback_data: 'again' }]]
    })
};

// Store chat states (e.g., random numbers)
const chats = {};

// Start a new game
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "I'm thinking of a number between 0 and 9. Can you guess it?");
    const randomNumber = Math.floor(Math.random() * 10); // Generate random number
    chats[chatId] = randomNumber; // Store it for the chat
    await bot.sendMessage(chatId, "Make your guess!", gameOptions);
};

// Handle /start command
const sendWelcomeMessage = async (chatId) => {
    await bot.sendSticker(chatId, 'https://cdn2.combot.org/memnayabredyatina_by_fstikbot/webp/60xf09fa4b2.webp');
    await bot.sendMessage(chatId, 'Welcome to the bot! Use /game to play a fun number guessing game.');
};

// Handle /info command
const sendInfoMessage = async (chatId, user) => {
    await bot.sendMessage(chatId, `Your name is ${user.first_name}. Nice to meet you!`);
};

// Initialize the bot and commands
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Starts the bot' },
        { command: '/info', description: 'Info about the user' },
        { command: '/game', description: 'Starts the game' }
    ]);

    // Message event listener
    bot.on('message', async (message) => {
        const text = message.text;
        const chatId = message.chat.id;

        if (text === '/start') {
            return sendWelcomeMessage(chatId);
        }

        if (text === '/info') {
            return sendInfoMessage(chatId, message.from);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        // Fallback for unrecognized messages
        return bot.sendMessage(chatId, "I don't understand that command. Try /start, /info, or /game.");
    });

    // Callback query event listener (button clicks)
    bot.on('callback_query', async (msg) => {
        const data = msg.data; // The data from the button
        const chatId = msg.from.id;

        if (!chats[chatId] && data !== 'again') {
            return bot.sendMessage(chatId, "No active game found. Use /game to start a new one!");
        }

        if (data === 'again') {
            return startGame(chatId);
        }

        const guessedNumber = parseInt(data, 10);
        const correctNumber = chats[chatId];

        if (guessedNumber === correctNumber) {
            await bot.sendMessage(chatId, `🎉 Correct! The number was ${correctNumber}.`, againOptions);
        } else {
            await bot.sendMessage(chatId, `❌ Wrong! The number was ${correctNumber}.`, againOptions);
        }
    });
};

start();
