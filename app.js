const TelegramBot = require('node-telegram-bot-api');
const pool = require('./db')

const token = 'YOUR_API_KEY_HERE';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/add (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const title = match[1]
    const result = await pool.query('select * from "teletodo" where msgid = $1 and title = $2', [chatId, title])
    if (result.rows.length) {
        const resp = `Task with title"${title}" already exists :)`;
        bot.sendMessage(chatId, resp);
    }
    else {
        const query = 'insert into "teletodo" ("msgid", "title", "description") values ($1, $2, $3)'
        const values = [chatId, title, title]
        await pool.query(query, values)
        const resp = `ToDO Added :)`;
        bot.sendMessage(chatId, resp);
    }

});
bot.onText(/\/delete (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const title = match[1]
    const result = await pool.query('select * from "teletodo" where msgid = $1 and title = $2', [chatId, title])
    if (result.rows.length) {

        await pool.query('delete from "teletodo" where msgid = $1 and title = $2', [chatId, title])
        const resp = `Task "${title}" deleted :)`;
        bot.sendMessage(chatId, resp);
    }
    else {
        const resp = `No task named ${title} :(`;
        bot.sendMessage(chatId, resp);
    }
});

bot.onText(/\/list/, async (msg, match) => {
    const chatId = msg.chat.id;
    const result = await pool.query('select * from "teletodo" where msgid = $1', [chatId])
    console.log(result.rows)
    if (result.rows.length) {
        let resp = ""
        for (let i = 0; i < result.rows.length; i++) {
            console.log(result.rows[i].title)
            resp += `${i + 1}) ` + result.rows[i].title + '\n'
        }
        bot.sendMessage(chatId, resp);
    }
    else {
        const resp = `You haven't created any tasks :(`;
        bot.sendMessage(chatId, resp);
    }
});

bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = `/list          - to list ur ToDos \n` +
        `/add <title>   - to add a ToDo \n` +
        `/delete <title>- to delete a ToDo`;
    bot.sendMessage(chatId, resp);
});
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = `/list          - to list ur ToDos \n` +
        `/add <title>   - to add a ToDo \n` +
        `/delete <title>- to delete a ToDo`;
    bot.sendMessage(chatId, resp);
});

// bot.on('message', (msg) => {

//     console.log(msg.text)
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Received your message');
// });