const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`starting server at port: ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

//database configuration
const database = new Datastore('database.db');
database.loadDatabase();

//route for endpoint get all results from the db
app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if(err){
            response.end();
            return;
        }
    response.json(data);

    });       
});

//route for endpoint to post data that comes from the client in to the
app.post('/api', (request, response) => {
    console.log('i got a request');
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
    console.log(data);
});

//route for endpoint to get data with the lat & lon of the client for pasted to the endpoint of the externals apis
app.get('/weather/:latlon', async (request, response) => {
    //params of the request
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);

    // external endpoint to the Weather api'
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
    const weather_response = await fetch(weather_url);
    const weather_json_data = await weather_response.json();

    // external endpoint to the AQ api
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_json_data = await aq_response.json();

    // Send back both data results to the client
    const data = {
        weather: weather_json_data,
        air_quality: aq_json_data
    }
    response.json(data);   
});