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



const { MongoClient, ServerApiVersion } = require('mongodb');
const headers = {
  "accept": "application/json",
  "Accept-Encoding": "gzip",
}

const tomorrowApiKey = "rt6KkyZOCA8PELgZmhqjbmw5Qw3vpYTm";
const geocodingApiKey = "AIzaSyAuY31y568J2ld6PjerQJ1Pp1SG1aZe1yE";
const ipinfoKey = "5b2286d51fefe2"; 
const mapsApiKey = "AIzaSyAuY31y568J2ld6PjerQJ1Pp1SG1aZe1yE";

const path = require('path');
const express = require('express');
const axios = require('axios');
const { error } = require('console');
const app = express();

const uri = process.env.MONGODB_URI;


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
  const { city, state } = req.query;
  try {
    // console.log("inside server for addFavorite")
//  prompt: how do I get MongoDb to work with this assignment? - 1 line - https://chatgpt.com/share/672eedda-3c38-800b-b507-3d11cc7aa0ec
    await favorites_list.insertOne({
      City: city,
      State: state, 
    });
  } catch (error) {
    console.error('Error adding to DB:', error);
  }
});

app.get('/api/removeFavorite', async (req, res) => {
  const { city, state } = req.query;
  try {
    // console.log("inside server for removeFavorite")
    await favorites_list.deleteOne({
      City: city, //change this
      State: state, //change this
    }); //change this
  } catch (error) {
    console.error('Error adding to DB:', error);
  }
});

app.get('/api/customerFavorites', async (req, res) => {
  try {
    //  prompt: how do I get MongoDb to work with this assignment? - 1 lines -https://chatgpt.com/share/672eedda-3c38-800b-b507-3d11cc7aa0ec
    const favorites = await favorites_list.find().sort({ city: 1 }).toArray();
    res.json(favorites);
  } catch (error) {
    console.error('Error adding to DB:', error);
  }
});


// API call for Autocomplete --------> need to implement for maps too
//  prompt: how do I setup get city to print out to html component? - 10 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
app.get('/api/autocomplete', async (req, res) => {
  console.log("Autocomplete route hit");
  const input = req.query.input;
  console.log('input', input);
  try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: { 
              input, 
              key: mapsApiKey, 
              types: "(cities)"
          },
      });
      console.log('response.data', response.data);
      res.json(response.data);  // Ensure JSON response is sent
  } catch (error) {
      console.error('Error fetching autocomplete data:', error);
      res.status(500).json({ error: 'Failed to fetch autocomplete data' });
  }
});



// API call for Tomorrow.io
app.get('/api/weather', async (req, res) => {
  const { auto_loc, street, city, state } = req.query;
  var latitude = 0;
  var longitude = 0;
  try {
    if(auto_loc){
      const ipinfoResponse = await axios.get('https://ipinfo.io', {
        params: { 
          token: ipinfoKey
        },
        headers
      });
      let coords = ipinfoResponse.data['loc'].split(',')
      latitude = coords[0];
      longitude = coords[1];
    } else {
      const address = [street,city,state].join(', ');
      const coordinates = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { 
        params: {
          address, 
          key: geocodingApiKey
        },
        headers
      });
      latitude = coordinates.data['results'][0]['geometry']['location']['lat'];
      longitude = coordinates.data['results'][0]['geometry']['location']['lng'];
      let newaddress = coordinates.data['results'][0]['formatted_address'];
      console.log('address', newaddress);
    }
    
    const weatherData = await axios.get('https://api.tomorrow.io/v4/timelines', { 
      params: { 
        location:`${latitude},${longitude}`,
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
    console.log('weatherData', weatherData.data);
    res.json(weatherData.data);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'weather-application/dist/', 'index.html'));
});



// Redirect all traffic to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'weather-application/dist', 'index.html'));
});
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});