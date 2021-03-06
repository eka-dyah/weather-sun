let city = "";
document.getElementById('sendMessageButton').style.display = 'none';
getCity();
function getCity () {
  
  document.getElementById('loader').style.display = 'inline'; 
  city = document.getElementById('city').value || 'bandung';
  const base_url = `https://api.openweathermap.org/data/2.5/find?q=${city}&units=metric&APPID=${config.API_KEY}`;
  
  fetchUrl(base_url)
  .then(data => {
    if (data.count == 0) {      
      document.getElementById('loader').style.display = 'none';
      alert('Did you enter valid name of a city? If yes, try again with other city');
    } else{
    let temp=0, tempFeel=0, humid=0, windSpeed=0, cloudiness=0,  cityName = "", tableHtml = "";
    data.list.forEach(element => {
      temp += element.main.temp;
      tempFeel += element.main.feels_like;
      humid += element.main.humidity;
      windSpeed += element.wind.speed;
      cloudiness += element.clouds.all;
      if(cityName != element.name) {
        cityName = element.name;
      }
    });
    tableHtml = `<br />
      <table>
        <tr>
          <th colspan="2" style="text-align: center;" id="cityName">${cityName}</th>
        </tr>
        <tr>
          <th>Temperature</th>
          <td><span id="temp">${Math.round(temp/data.count)}</span><sup>o</sup>C</td>
        </tr>
        <tr>
          <th>Temperature Feel</th>
          <td><span id="tempFeel">${Math.round(tempFeel/data.count)}</span><sup>o</sup>C</td>
        </tr>
        <tr>
          <th>Humidity</th>
          <td id="humid">${Math.round(humid/data.count)} %</td>
        </tr>
        <tr>
          <th>Wind Speed</th>
          <td id="windSpeed">${Math.round(windSpeed/data.count)} m/s</td>
        </tr>
        <tr>
          <th>Cloudiness</th>
          <td id="cloudiness">${Math.round(cloudiness/data.count)} %</td>
        </tr>
      </table>
    `;
    document.getElementById('sendMessageButton').style.display = 'block';
    document.getElementById('result-city').innerHTML = tableHtml;
    document.getElementById('loader').style.display = 'none';
  }
  })
}

function fetchUrl(url){
  return fetch(url)
  .then(status)
  .then(json)
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    document.getElementById('loader').style.display = 'none';
    alert('Did you enter valid name of a city? If yes, try again with other city');
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

