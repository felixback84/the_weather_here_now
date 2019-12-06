//global vars
let lat, lon;

//eval there is geolocation in browser
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air;
    try{
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);
      //fetch data of my server from the custom endpoint
      const api_url = `weather/${lat},${lon}`;
      const response = await fetch(api_url);
      const json = await response.json();
      //console.log with result json of external api
      console.log(json);
      //print data in client
      weather = json.weather.currently;
      air = json.air_quality.results[0].measurements[0];

      document.getElementById('summary').textContent = weather.summary;
      document.getElementById('temp').textContent = weather.temperature;
      
      document.getElementById('aq_parameter').textContent = air.parameter;
      document.getElementById('aq_value').textContent = air.value;
      document.getElementById('aq_units').textContent = air.unit;
      document.getElementById('aq_date').textContent = air.lastUpdated;

    } catch(error){
      console.error(error);
      air = { value: -1 };
      document.getElementById('aq_value').textContent = 'No readings available';
    }

    //post data in database
    const data = { lat, lon, weather, air };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    //post data in the api endpoint POST & db
    const db_response = await fetch('/api', options);
    const db_json_data = await db_response.json();
    console.log(db_json_data);

  });

} else {
  console.log('geolocation not available');

}



  




