// Select HTML elements for current weather
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// Select HTML container for the 3-day forecast
const forecastContainer = document.querySelector('#forecast-container');

// Required variables
const myapiKey = "YOUR_API_KEY_HERE"; 
const lat = "49.75";
const lon = "6.64";

const currentUrl = `https://openweathermap.org{lat}&lon=${lon}&appid=${myapiKey}&units=metric`;
const forecastUrl = `https://openweathermap.org{lat}&lon=${lon}&appid=${myapiKey}&units=metric`;

async function apiFetch() {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (currentRes.ok && forecastRes.ok) {
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      displayCurrentWeather(currentData);
      displayForecast(forecastData);
    } else {
      throw Error("Failed to fetch weather data.");
    }
  } catch (error) {
    console.error(error);
  }
}

// Display Current Weather
function displayCurrentWeather(data) {
  currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;C`;
  
  const iconsrc = `https://openweathermap.org{data.weather.icon}@2x.png`;
  const desc = data.weather.description;

  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);
  captionDesc.textContent = desc;
}

// Display 3-Day Forecast with Icons
function displayForecast(data) {
  forecastContainer.innerHTML = "";

  const threeDayForecast = data.list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 3);

  threeDayForecast.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = day.main.temp.toFixed(0);
    
    // Extract the icon and description for each forecast day
    const iconCode = day.weather.icon;
    const iconDesc = day.weather.description;
    const iconUrl = `https://openweathermap.org{iconCode}.png`;

    // Create the forecast card with the icon included
    const dayCard = document.createElement('div');
    dayCard.classList.add('forecast-day');
    dayCard.innerHTML = `
      <p class="day-name">${dayName}</p>
      <img src="${iconUrl}" alt="${iconDesc}" width="50" height="50">
      <p class="day-temp">${temp}&deg;C</p>
    `;

    forecastContainer.appendChild(dayCard);
  });
}

apiFetch();