// Select HTML elements for current weather
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// Select HTML container for the 3-day forecast
const forecastContainer = document.querySelector('#forecast-container');

// Required variables
const myapiKey = "938a762003d285fe4bb5410bfcfd18f4"; 
const lat = "-24.66";
const lon = "25.90";

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
  
  const iconsrc = `https://openweathermap.org${data.weather.icon}@2x.png`;
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
    const iconUrl = `https://openweathermap.org${data.waether[0].icon}.png`;

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

// MEMBER SPOTLIGHTS (JSON Data)

const membersURL = 'data/members.json'; // Update path to your JSON file
const spotlightContainer = document.querySelector('#spotlight-container');

async function loadSpotlights() {
  try {
    const response = await fetch(membersURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter for Gold or Silver members
    const eligibleMembers = data.members.filter(member => {
      const level = member.membership_Level.toLowerCase();
      return level === 'gold' || level === 'silver';
    });

    // Shuffle the filtered array randomly 
    for (let i = eligibleMembers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
    }

    //Random members (e.g., 3 members)
    const selectedMembers = eligibleMembers.slice(0, 3);

    // Render the cards
    displaySpotlights(selectedMembers);

  } catch (error) {
    console.error('Error loading member spotlights:', error);
    spotlightContainer.innerHTML = '<p>Unable to load spotlights right now.</p>';
  }
}

function displaySpotlights(members) {
  spotlightContainer.innerHTML = ''; // Clear existing content

  members.forEach(member => {
    const card = document.createElement('article');
    card.classList.add('spotlight-card', member.membership_Level.toLowerCase());

    card.innerHTML = `
      <div class="spotlight-header">
        <h3>${member.name}</h3>
        <span class="badge">${member.membership_Level} Member</span>
      </div>
      <img src="${member.image}" alt="${member.name} logo" width="${member.width || 150}" height="${member.height || 150}" loading="lazy">
      <div class="spotlight-info">
        <p><strong>Address:</strong> ${member.address}</p>
        <p><strong>Phone:</strong> <a href="tel:${member.whatsapp_number}">${member.whatsapp_number}</a></p>
        <p><strong>Website:</strong> <a href="${member.websiteurl}" target="_blank" rel="noopener">${member.websiteurl}</a></p>
      </div>
    `;

    spotlightContainer.appendChild(card);
  });
}

// Execute the processes
apiFetch();
loadSpotlights();