const axios = require( 'axios' );
const User = require('../models/User');

exports.storeUser= async(chatId, name, city, country) => {
  const user = await User.findOneAndUpdate(
    { chatId: chatId },
    { name, city, country },
    { upsert: true, new: true }
  );
  return user;
}

exports.generateWeatherReport = async (city, country) => {
  const apiKey = process.env.WEATHER_API;
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    const weather = data.weather[0].description;
    const temperature = data.main.temp
    const city = data.name;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
          2
        )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;
    return message;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return "Unable to fetch weather data at the moment.";
  }
}

