const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs/promises");
const { program } = require("commander");

const { SECRET_TOKEN, CHAT_ID } = process.env;

const bot = new TelegramBot(SECRET_TOKEN, {
  polling: true,
});
let id;

program
  .command("m")
  .alias("send-message")
  .argument("<string>", "Message text")
  .action(async (str) => {
    await postMessage(str);
    process.exit(0);
  });

program
  .command("p")
  .alias("send-photo")
  .argument("<path>", "Message text")
  .action(async (path) => {
    await postPhoto(path);
    process.exit(0);
  });

//   .option("-m, --send message <type>", "text message", postMessage)
//   .option("-p, --post image <url>", "url");
program.parse();

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  id = chatId;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on("message", (msg) => {
  if (msg.text === "/start") {
    const chatId = msg.chat.id;
    id = chatId;
  }

  const hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
    bot.sendMessage(getChatId(msg), `Hello dear ${msg.from.username}`);
  }

  const bye = "bye";
  if (msg.text.toString().toLowerCase().includes(bye)) {
    console.log(bye);
    bot.sendMessage(getChatId(msg), "Hope to see you around again , Bye");
  }
});

// function sendMessage(arg) {
//   bot.sendMessage(CHAT_ID, arg);
// }
// const img = fs.readFile("/task3/img/desktop-1920x1080.jpg");

function getChatId(msg) {
  return msg.chat.id;
}

async function postMessage(msg) {
  await bot.sendMessage(CHAT_ID, msg);
}

async function postPhoto(path) {
  await bot.sendPhoto(CHAT_ID, path);
}
