const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const { WEATHER_BOT_TOKEN, WEATHER_API_KEY } = process.env;
const REQUEST_ADDRESS = "https://api.openweathermap.org";

const bot = new TelegramBot(WEATHER_BOT_TOKEN, { polling: true });

const lat = 47.90966;
const lon = 33.38044;
let intervalId;

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  bot.sendMessage(chatId, resp);
});

bot.on("message", async (msg) => {
  if (msg.text === "Forecast in Kryvyy Rih") {
    bot.sendMessage(msg.chat.id, "Kryvyy Rih", {
      reply_markup: {
        keyboard: [["at intervals of 3 hours", "at intervals of 6 hours"]],
      },
    });
  } else if (msg.text.includes("at intervals of")) {
    if (msg.text.split(" ").at(-2) === "3") {
      sendMsgSetUpdate(msg.chat.id, 10800000);
    } else {
      sendMsgSetUpdate(msg.chat.id, 21600000);
    }
  } else {
    bot.sendMessage(msg.chat.id, "Welcome", {
      reply_markup: {
        keyboard: [["Forecast in Kryvyy Rih"]],
      },
    });
  }
});

function getWeather() {
  return axios
    .get(
      `${REQUEST_ADDRESS}/data/2.5/weather?lat=${lat}&lon=${lon}&dt=${Date.now()}&appid=${WEATHER_API_KEY}`
    )
    .then((res) => res.data);
}

function sendMsgSetUpdate(id, time) {
  if (intervalId) {
    clearInterval(intervalId);
  }
  setInterval(async () => {
    const { weather, main, wind, name } = await getWeather();
    bot.sendMessage(
      id,
      `Now in ${name} is ${weather[0].main}.\n
      Temperature: ${Math.round(main.temp - 273)}, feels like: ${Math.round(
        main.feels_like - 273
      )}.\n
      Wind speed: ${Number.parseFloat(wind.speed).toFixed(1)}`
    );
  }, time);
}
