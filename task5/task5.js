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
  if (msg.text === "/weather") {
    bot.sendMessage(msg.chat.id, "You chose weather", {
      reply_markup: {
        keyboard: [["Forecast in Kryvyy Rih"], ["Back to main"]],
      },
    });
  } else if (msg.text === "Forecast in Kryvyy Rih") {
    bot.sendMessage(msg.chat.id, "Kryvyy Rih", {
      reply_markup: {
        keyboard: [
          ["at intervals of 3 hours", "at intervals of 6 hours"],
          ["Back to main"],
        ],
      },
    });
  } else if (msg.text.includes("at intervals of")) {
    if (msg.text.split(" ").at(-2) === "3") {
      sendMsgSetUpdate(msg.chat.id, 10800000);
    } else if (msg.text.split(" ").at(-2) === "6") {
      sendMsgSetUpdate(msg.chat.id, 21600000);
    }
    const response = await getWeather();
    const { weather, name, wind, main } = response;
    bot.sendMessage(
      msg.chat.id,
      `Now in ${name} is ${weather[0].description}\n
    Temperature - ${Math.round(main.temp - 273)}, feels like - ${Math.round(
        main.feels_like - 273
      )}\n
        Wind speed - ${Math.round(wind.speed)}`
    );
  } else if (msg.text === "/currency") {
    bot.sendMessage(msg.chat.id, "Kryvyy Rih", {
      reply_markup: {
        keyboard: [["USD", "EUR"], ["Back to main"]],
      },
    });
  } else if (msg.text === "USD" || msg.text === "EUR") {
    const response = await getCurrencyCourse();
    bot.sendMessage(
      msg.chat.id,
      `Currency: ${msg.text === "EUR" ? response[0].ccy : response[1].ccy}\n
      buy - ${msg.text === "EUR" ? response[0].buy : response[1].buy}\n
      sale - ${msg.text === "EUR" ? response[0].sale : response[1].sale}`
    );
  } else {
    bot.sendMessage(msg.chat.id, "Welcome", {
      reply_markup: {
        keyboard: [["/weather"], ["/currency"]],
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

function getCurrencyCourse() {
  return axios
    .get(`https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5`)
    .then((res) => res.data);
}
