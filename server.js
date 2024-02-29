const path = require("path");
require("dotenv").config();

const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const telegramBot = require("node-telegram-bot-api");

const main = require("./util/database"); //database import
const {
  storeUser,
  generateWeatherReport,
} = require("./controllers/botController");
const User = require("./models/User");
const { cronSchedule } = require("./botServices/bot");

//routes
const adminRoutes = require("./routes/admin");

const server = express();
server.use(express.static(path.resolve(__dirname, "build")));
server.use(cors());

server.use(express.json());

const botToken = process.env.BOT_KEY;

const bot = new telegramBot(botToken, { polling: true });
// function for cron scheduling
const cronJob = async () => {
  const number = await cronSchedule();
  let schedule = `* * ${number} * * *`;
  cron.schedule(schedule, async () => {
    try {
      // Fetch all users who have opted in to receive daily updates
      const users = await User.find();

      // Iterate over each user and send weather updates
      for (const user of users) {
        if (user.allowed != "true") {
          await bot.sendMessage(user.chatId, "you have been blocked by Admin");
        } else {
          const { city, country } = user;
          const weatherData = await generateWeatherReport(city, country);
          await bot.sendMessage(
            user.chatId,
            `Daily Weather Update for ${city}, ${country}:\n${weatherData}`
          );
        }
      }
    } catch (error) {
      console.error("Error sending daily updates:", error);
    }
  });
};
// scheduled the job  to run every day at 8 am
// cronJob();

server.use("/admin", adminRoutes);

server.get("*", (req, res) => {
  res.sendFile(path.resolve("build","index.html"));
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome! Please provide your name, city, and country, separated by commas (e.g., John Doe, City, Country)."
  );
});

bot.on("text", async (msg) => {
  try {
    if (msg.text.startsWith("/")) {
      // Ignore command messages, as they're handled separately
      return;
    }
    const chatId = msg.chat.id;
    const userData = msg.text.split(",").map((item) => item.trim());

    if (userData.length !== 3) {
      throw new Error(
        "Invalid format. Please provide your name, city, and country, separated by commas."
      );
    }

    const [name, city, country] = userData;

    const user = await storeUser(chatId, name, city, country);
    if (user.allowed != "true") {
      await bot.sendMessage(user.chatId, "you have been blocked by Admin");
    } else {
      const weatherData = await generateWeatherReport(city, country);
      await bot.sendMessage(
        chatId,
        `Weather update for ${city}, ${country}:\n${weatherData}`
      );
    }
  } catch (error) {
    console.error("Error processing message:", error);
    await bot.sendMessage(
      msg.chat.id,
      "An error occurred. Please try again later."
    );
  }
});

main()
  .then(() => {
    server.listen(process.env.PORT || 5000, console.log("listening to port 5000"));
  })
  .catch((err) => console.log(err));

  