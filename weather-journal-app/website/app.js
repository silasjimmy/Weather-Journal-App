/* Global Variables */

let baseURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
let apiKey = '&APPID=afa6c3774c9251300eca88978c04aec0';
const cardsContainer = document.getElementById('cards');

// Create a new date instance dynamically with JS
let date = new Date();

/* Event listeners */

// Add an event listener to the generate button
document.getElementById('generate').addEventListener('click', generate);

/* App functions */

// Creates custom data and appends the information to the ui
function generate(e) {
  const zipCode = document.getElementById('zipcode');

  getWeatherData(baseURL, zipCode.value, apiKey)

  .then(data => {
    const feelings = document.getElementById('feelings');

    // Create custom data containing the needed information
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      temperature: data.main.temp,
      day: date.toDateString(),
      time: date.toLocaleTimeString(),
      feelings: feelings.value
    }

    // Add the weather data to the backend 'database'
    postWeatherData('/add', weatherData);

    return weatherData;
  })
  .then(weatherData => {
    cardsContainer.prepend(createEntryHolder(weatherData));
  })
  .catch(error => console.log(error.message));
}

// Fetches the weather data of the zipcode/city from the api
const getWeatherData = async (url, zipcode, key) => {
  const response = await fetch(url + zipcode + key);

  if (response.ok) {
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  else {
    alert("There is no zipcode or city with referred to as " + zipcode);
  }
}

// Create an entry card
function createEntryHolder(data) {
  const entryHolder = document.createElement('div');
  let place = document.createElement('h3');
  let date = document.createElement('span');
  let temp = document.createElement('span');
  let feelings = document.createElement('span');

  entryHolder.setAttribute('class', 'entry_holder');
  place.setAttribute('class', 'place');
  date.setAttribute('class', 'date');
  temp.setAttribute('class', 'temp');
  feelings.setAttribute('class', 'feelings');

  place.innerHTML = data.city + ", " + data.country;
  date.innerHTML = data.day + " at " + data.time;
  temp.innerHTML = "The temperature is " + data.temperature +
                    "K with " + data.description;
  feelings.innerHTML = "Feeling " + data.feelings;

  entryHolder.appendChild(place);
  entryHolder.appendChild(date);
  entryHolder.appendChild(temp);
  entryHolder.appendChild(feelings);

  return entryHolder;
}

// Post weather data
const postWeatherData = async(url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
  } catch (e) {
    console.log("error:", e);
  }
}

// Populates the most recent entry section with existing data
const createRecentEntry = async() => {
  const request = await fetch('/all');
  const data = await request.json();

  data.forEach((item) => {
    cardsContainer.prepend(createEntryHolder(item));
  });
}

// Fill the most recent entry section with already existing data
createRecentEntry();
