// const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config();
// const headers = {
//   "accept": "application/json",
//   "Accept-Encoding": "gzip",
// }

// const tomorrowApiKey = process.env.TOMORROW_API_KEY;
// const geocodingApiKey = process.env.GEOCODING_API_KEY;
// const ipinfoKey = process.env.IPINFO_KEY;
// const mapsApiKey = process.env.MAPS_API_KEY;
// console.log("TOMORROW_API_KEY:", tomorrowApiKey);
// console.log("GEOCODING_API_KEY:", geocodingApiKey);
// console.log("IPINFO_KEY:", ipinfoKey);
// console.log("MAPS_API_KEY:", mapsApiKey);

// const path = require('path');
// const express = require('express');
// const axios = require('axios');
// const { error } = require('console');
// const app = express();

const IMAGE_CODES = {
  1000: ["clear_day.svg", "Clear"],
  1001: ["cloudy.svg", "Cloudy"],
  1100: ["mostly_clear_day.svg", "Mostly Cloudy"],
  1101: ["partly_cloudy_day.svg", "Partly Cloudy"],
  1102: ["mostly_cloudy.svg", "Mostly Cloudy"],
  2000: ["fog.svg", "Fog"],
  2100: ["fog_light.svg", "Light Fog"],
  4000: ["drizzle.svg", "Drizzle"],
  4001: ["rain.svg", "Rain"],
  4200: ["rain_light.svg", "Light Rain"],
  4201: ["rain_heavy.svg", "Heavy Rain"],
  5000: ["snow.svg", "Snow"],
  5001: ["flurries.svg", "Flurries"],
  5100: ["snow_light.svg", "Light Snow"],
  5101: ["snow_heavy.svg", "Heavy Snow"],
  6001: ["freezing_rain.svg", "Freezing Rain"],
  6200: ["freezing_rain_light.svg", "Light Freezing Rain"],
  6201: ["freezing_rain_heavy.svg", "Heavy Freezing Rain"],
  7000: ["ice_pellets.svg", "Ice Pellets"],
  7101: ["ice_pellets_heavy.svg", "Heavy Ice Pellets"],
  7102: ["ice_pellets_light.svg", "Light Ice Pellets"],
  8000: ["tstorm.svg", "Thunderstorm"]
}


const { MongoClient, ServerApiVersion } = require('mongodb');
const headers = {
  "accept": "application/json",
  "Accept-Encoding": "gzip",
}

const tomorrowApiKey = "rt6KkyZOCA8PELgZmhqjbmw5Qw3vpYTm";
const geocodingApiKey = "AIzaSyAuY31y568J2ld6PjerQJ1Pp1SG1aZe1yE";
const ipinfoKey = "5b2286d51fefe2"; 
const mapsApiKey = "AIzaSyAuY31y568J2ld6PjerQJ1Pp1SG1aZe1yE";
const uri = "mongodb+srv://theanthonycarreon:Notorious18!@assignment3.gevhk.mongodb.net/?retryWrites=true&w=majority&appName=Assignment3";

const path = require('path');
const express = require('express');
const axios = require('axios');
const { error } = require('console');
const app = express();

// const uri = mongodb_URL;

app.use(express.json());

// Serve static files from the 'public' directory (Angular app)
app.use(express.static(path.join(__dirname, 'weather-application/dist')));


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  tlsInsecure: false
});

// //  prompt: how do I get MongoDb to work with this assignment? - 2 lines -https://chatgpt.com/share/672eedda-3c38-800b-b507-3d11cc7aa0ec
client.connect().then(() => console.log("Connected to MongoDB")).catch(err => console.error("MongoDB connection error:", err));
const favorites_list = client.db('Assignment3').collection('Favorites');

app.get('/api/addFavorite', async (req, res) => {
  const { latitude, longitude, city, state } = req.query;
  try {
//  prompt: how do I get MongoDb to work with this assignment? - 1 line - https://chatgpt.com/share/672eedda-3c38-800b-b507-3d11cc7aa0ec
    await favorites_list.insertOne({
      Latitude: latitude,
      Longitude: longitude, 
      City: city,
      State: state, 
    });
  } catch (error) {
    console.error('Error adding to DB:', error);
  }
});

app.get('/api/removeFavorite', async (req, res) => {
  const { latitude, longitude, city, state } = req.query;
  try {
    // console.log("inside server for removeFavorite")
    await favorites_list.deleteOne({
      Latitude: latitude,
      Longitude: longitude, 
      City: city, 
      State: state,
    }); 
  } catch (error) {
    console.error('Error removing from DB:', error);
  }
});

app.get('/api/customerFavorites', async (req, res) => {
  try {
    //  prompt: how do I get MongoDb to work with this assignment? - 1 lines -https://chatgpt.com/share/672eedda-3c38-800b-b507-3d11cc7aa0ec
    const favorites = await favorites_list.find().sort({ city: 1 }).toArray();
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
app.get('/api/map', async (req, res) => {
  const { latitude, longitude} = req.query
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: { 
        location: `${latitude},${longitude}`,
          key: mapsApiKey, 
        },
      });
      res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});


app.get('/api/dayView', async (req, res) => {
  const { latitude , longitude} = req.query; //might need longitude and latitude
  try {
    const weatherData = await axios.get('https://api.tomorrow.io/v4/timelines', { 
      params: { 
        location:`${latitude},${longitude}`,
        fields: ["temperature", "temperatureApparent", "temperatureMin", "temperatureMax", "windSpeed"
          , "windDirection", "humidity", "pressureSeaLevel", "uvIndex", "weatherCode", "precipitationProbability",
              "precipitationType", "sunriseTime", "sunsetTime", "visibility", "moonPhase", "cloudCover", "temperatureApparent"],
              timesteps: "1d",
              timezone: "America/Los_Angeles",
              units: "imperial",
              apikey: tomorrowApiKey
      },
      headers 
    });
    res.json(weatherData.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
// app.get('/api/tempChart', async (req, res) => {
//   const {  latitude , longitude } = req.query; //might need longitude and latitude
//   try {
//     const tempChart = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', { //change link
//       params: { 
//           // address, 
//           key: mapsApiKey, 
//       },
//     });
//     res.
//     res.json(tempChart);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// });
app.get('/api/meteogram', async (req, res) => {
  const {  latitude , longitude } = req.query; //might need longitude and latitude
  // `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`
  try {
    const meteogramChart = await axios.get('https://api.met.no/weatherapi/locationforecast/2.0/compact', { 
      params: { 
        lat: latitude,
        lon: longitude,
      },
      headers: {
        'User-Agent': 'Assignment3 (theanthonycarreon@gmail.com)'
      }
    });
    // console.log('meteogramChart (inside server.js)', meteogramChart)
    res.json({meteogramChart: meteogramChart.data, latitude, longitude});

  } catch (error) {
    console.error('Error fetching data:', error);
  }
});


// API call for Autocomplete --------> need to implement for maps too
//  prompt: how do I setup get city to print out to html component? - 10 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
app.get('/api/autocomplete', async (req, res) => {
  const { input } = req.query;
  try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: { 
              input, 
              key: mapsApiKey, 
              types: "(cities)"
          },
      });
      res.json(response.data);  
  } catch (error) {
      console.error('Error fetching autocomplete data:', error);
      res.status(500).json({ error: 'Failed to fetch autocomplete data' });
  }
});



// API call for Tomorrow.io
app.get('/api/weather', async (req, res) => {
  let inputLatitude = 0;
  let inputLongitude = 0;
  let inputAddress = '';
  const { auto_loc, street, city, state } = req.query;
  try {
    if(auto_loc === 'true'){
      const ipinfoResponse = await axios.get('https://ipinfo.io', {
        params: { 
          token: ipinfoKey
        },
        headers
      });
      let coords = ipinfoResponse.data['loc'].split(',')
      inputLatitude = parseFloat(coords[0]);
      inputLongitude = parseFloat(coords[1]);
      inputAddress = ipinfoResponse.data['city'] + ', ' + ipinfoResponse.data['region'];
    } else {
      const address = [street,city,state].join(', ');
      const coordinates = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { 
        params: {
          address, 
          key: geocodingApiKey
        },
        headers
      });
      inputLatitude = coordinates.data['results'][0]['geometry']['location']['lat'];
      inputLongitude = coordinates.data['results'][0]['geometry']['location']['lng'];
       // prompt: how do I split the response? - 4 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
      const temp = coordinates.data['results'][0]['formatted_address'].split(',');
      const city = temp[1].trim(); 
      const state = temp[2].trim().split(' ')[0];
      const cityState = `${city}, ${state}`;
      inputAddress = cityState;
      console.log(inputAddress);
    }
    
    const weatherData = await axios.get('https://api.tomorrow.io/v4/timelines', { 
      params: { 
        location:`${inputLatitude},${inputLongitude}`,
        fields: ["temperature", "temperatureApparent", "temperatureMin", "temperatureMax", "windSpeed"
          , "windDirection", "humidity", "pressureSeaLevel", "uvIndex", "weatherCode", "precipitationProbability",
              "precipitationType", "sunriseTime", "sunsetTime", "visibility", "moonPhase", "cloudCover"],
              timesteps: "1d",
              timezone: "America/Los_Angeles",
              units: "imperial",
              apikey: tomorrowApiKey
      },
      headers 
    });

    weatherData.data.data.timelines[0].intervals.forEach(interval => {
    const weatherCode = interval.values.weatherCode;
    const [imageFile, description] = IMAGE_CODES[weatherCode] || ["clear_day.svg", "Clear"];
    interval.values.icon = imageFile;
    interval.values.status = description;
   });

    res.json({weatherData: weatherData.data, latitude: inputLatitude, longitude: inputLongitude, address: inputAddress});

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/', (req, res) => {
  console.log('inside app.get(/)');
  res.sendFile(path.join(__dirname, 'weather-application/dist/', 'index.html'));
});



// Redirect all traffic to index.html
app.get('*', (req, res) => {
  console.log('inside app.get(*)');
  res.sendFile(path.join(__dirname, 'weather-application/dist', 'index.html'));
});
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});