import axios from "axios";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const app=express();
const port=4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //why this code
app.get("/",async(req,res)=>{
  try {
    const apiKey = "676e00e04ff7174c6f4019ae28ac3bcf"; // Replace this
    const response=await axios.get("https://api.openweathermap.org/data/2.5/weather", {
  params: {
    q: "Chennai",
    appid: apiKey,
    units: "metric"
  }
});
// Temperature (°C)	Description	What It Feels Like
// 0–10°C	❄️ Very Cold	Wear jackets, gloves, stay warm
// 11–16°C	🧥 Cold	Light jacket or sweater
// 17–21°C	🌤️ Cool & Pleasant	Comfortable indoors/outdoors
// 22–25°C	😊 Ideal Room Temp	Most comfortable indoors
// 26–29°C	🔆 Warm	Start sweating, fan needed
// 30–35°C	☀️ Hot	AC recommended
// 36°C+	🥵 Very Hot	Avoid going outside, drink water
let currenttemperature = response.data.main.feels_like;
let condition = "";

if (currenttemperature < 11) {
  condition = "Freezing";
} else if (currenttemperature < 17) {
  condition = "Chilly";
} else if (currenttemperature < 22) {
  condition = "Cool Breeze";
} else if (currenttemperature < 26) {
  condition = "Perfect";
} else if (currenttemperature < 30) {
  condition = "Warm Comfort";
} else if (currenttemperature < 36) {
  condition = "Hot & Humid";
} else {
  condition = "Scorching";
}

console.log("Feels like:", currenttemperature, "°C");
console.log("Condition:", condition);

var windspeed=response.data.wind.speed;
console.log(windspeed)
var windcondition=""
if (windspeed <= 1.3) {
  windcondition = "Calm air";
} else if (windspeed <= 5) {
  windcondition = "Light Breeze";
} else if (windspeed <= 8) {
  console.log("hello");
  windcondition = "Moderate Breeze";
} else if (windspeed <= 14) {
  windcondition = "Strong Breeze";
} else if (windspeed <= 20) {
  windcondition = "Strong Wind";
} else if (windspeed <= 28) {
  windcondition = "Storm";
} else {
  windcondition = "Cyclone";
}

console.log("Wind Speed:", windspeed);
console.log("Condition:", windcondition);


//?Rain prediction
var rainmessage="No rain Expected"
const weathermain=response.data.weather[0].main;
const humidity=response.data.main.humidity;
const clouds=response.data.clouds.all;
const pressure=response.data.main.pressure;

if(weathermain=="Rain"||weathermain=="Drizzle"||weathermain=="Thunderstorm"){
  rainmessage="Rain is on your head";
}
if(humidity>70 && clouds >80 && currenttemperature > 10 && currenttemperature < 35 && pressure<1005){
  rainmessage="High change of rain";
}



console.log(response.data)
res.render("index.ejs",{message:rainmessage,temp:response.data.main.feels_like,mood:condition,aircondition:windcondition});

  } catch (error) {
    console.log("Error:",error.message);
  }
  
})
app.listen(port,()=>{
  console.log("Server listening on port 4000");
})
