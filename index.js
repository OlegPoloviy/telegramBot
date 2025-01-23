import "dotenv/config"
import TelegramApi from "node-telegram-bot-api"

const token = process.env.BOT_TOKEN

const bot = new TelegramApi(token,{polling: true})




const start = () => {
    bot.setMyCommands([
        {command: '/start',description: 'Starts the bot'},
        {command: '/info',description: 'Info about the user'},
    ])

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;

        if(text === '/start'){
            await bot.sendSticker(chatId,'https://cdn2.combot.org/memnayabredyatina_by_fstikbot/webp/60xf09fa4b2.webp')
            return bot.sendMessage(chatId, 'Welcome to the bot!');
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, 'Your name is ' + message.from.first_name);
        }

        return bot.sendMessage(chatId,'I dont know what you want')
    })
}

start();