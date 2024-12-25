// Get user's location and update weather
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Use reverse geocoding to get city name
            reverseGeocode(latitude, longitude);
            
            // Update weather data for the location
            getWeatherData(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            // Fallback to Bangalore coordinates if geolocation fails
            const bangaloreCoords = {
                latitude: 12.9716,
                longitude: 77.5946
            };
            reverseGeocode(bangaloreCoords.latitude, bangaloreCoords.longitude);
            getWeatherData(bangaloreCoords.latitude, bangaloreCoords.longitude);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Reverse geocoding using OpenStreetMap Nominatim API
function reverseGeocode(latitude, longitude) {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
            let cityName = '';
            
            // Try to get the most accurate city name
            if (data.address) {
                cityName = data.address.city || 
                          data.address.town || 
                          data.address.suburb || 
                          data.address.district || 
                          'Bangalore'; // Fallback
            }
            
            const countryCode = data.address.country_code.toUpperCase();
            updateLocationDisplay(cityName, countryCode);
        })
        .catch(error => {
            console.error('Error getting location name:', error);
            updateLocationDisplay('Bangalore', 'IN'); // Fallback to Bangalore
        });
}

// Update the location display in the weather card
function updateLocationDisplay(city, countryCode) {
    const locationElement = document.querySelector('.weather-card h1');
    locationElement.textContent = `${city}, ${countryCode}`;
}

// Fetch weather data from OpenWeatherMap API
const apiKey = '458aaa30790089d78c0d5707e92622bd'; // API key

function getWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Weather data received:", data); // Log the data to the console
            displayWeather(data); // Process the weather data and update the UI
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

// Display weather data on the UI
function displayWeather(data) {
    const temperature = document.querySelector('.temperature .temp');
    const feelsLike = document.querySelector('.temperature .feels-like');
    const weatherDescription = document.querySelector('.weather-description');
    const locationName = document.querySelector('.weather-card h1');
    const windSpeed = document.querySelector('.weather-details .wind-speed');
    const humidity = document.querySelector('.weather-details .humidity');
    const pressure = document.querySelector('.weather-details .pressure');
    const weatherIcon = document.querySelector('.weather-icon i');
    
    // Extract the necessary data
    const temp = data.main.temp;
    const feelsLikeTemp = data.main.feels_like;
    const description = data.weather[0].description;
    const cityName = data.name;  // Location name
    const wind = data.wind.speed; // Wind speed
    const humidityValue = data.main.humidity; // Humidity
    const pressureValue = data.main.pressure; // Pressure

    // Update the UI with the weather data
    temperature.textContent = `${temp}°C`;
    feelsLike.textContent = `Feels like: ${feelsLikeTemp}°C`;
    weatherDescription.textContent = description.charAt(0).toUpperCase() + description.slice(1); // Capitalize the first letter
    locationName.textContent = cityName;  // Show location name
    windSpeed.textContent = `Wind: ${wind} km/h`; // Show wind speed
    humidity.textContent = `Humidity: ${humidityValue}%`; // Show humidity
    pressure.textContent = `Pressure: ${pressureValue} hPa`; // Show pressure

    // Update the weather icon based on the current weather description
    if (description.includes('rain')) {
        weatherIcon.className = 'fas fa-cloud-rain';
    } else if (description.includes('snow')) {
        weatherIcon.className = 'fas fa-snowflake';
    } else if (description.includes('thunder')) {
        weatherIcon.className = 'fas fa-bolt';
    } else if (description.includes('clear')) {
        weatherIcon.className = 'fas fa-sun';
    }
}

// Initialize weather animation elements
const weatherStates = ['rain', 'thunder', 'snow', 'sunny'];
let currentState = 0;

function createWeatherElements() {
    const container = document.querySelector('.weather-container');

    const elements = {
        rain: createRain(),
        snow: createSnow(),
        thunder: createThunder(),
        sun: createSun()
    };

    Object.values(elements).forEach(el => container.appendChild(el));

    return elements;

    function createRain() {
        const rain = document.createElement('div');
        rain.className = 'rain';
        for (let i = 0; i < 200; i++) {
            const drop = document.createElement('div');
            drop.className = 'drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
            drop.style.opacity = Math.random() * 0.6 + 0.4;
            drop.style.height = `${Math.random() * 20 + 10}px`;
            rain.appendChild(drop);
        }
        return rain;
    }

    function createSnow() {
        const snow = document.createElement('div');
        snow.className = 'snow';
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.opacity = Math.random();
            flake.style.width = `${Math.random() * 5 + 2}px`;
            flake.style.height = flake.style.width;
            flake.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snow.appendChild(flake);
        }
        return snow;
    }

    function createThunder() {
        const thunder = document.createElement('div');
        thunder.className = 'thunder';
        return thunder;
    }

    function createSun() {
        const sun = document.createElement('div');
        sun.className = 'sun';
        return sun;
    }
}

// Update Weather State
function updateWeather(elements) {
    // Reset active state
    Object.values(elements).forEach(el => el.classList.remove('active'));

    const weatherContainer = document.querySelector('.weather-container');
    const weatherIcon = document.querySelector('.weather-icon i');

    // Update based on current state
    switch (weatherStates[currentState]) {
        case 'rain':
            elements.rain.classList.add('active');
            weatherContainer.style.background = 'linear-gradient(to bottom,rgb(39, 80, 121),rgb(42, 112, 188))';
            weatherIcon.className = 'fas fa-cloud-rain';
            break;
        case 'thunder':
            elements.rain.classList.add('active');
            elements.thunder.classList.add('active');
            weatherContainer.style.background = 'linear-gradient(to bottom, #1a1a1a,rgb(58, 58, 58))';
            weatherIcon.className = 'fas fa-bolt';
            break;
        case 'snow':
            elements.snow.classList.add('active');
            weatherContainer.style.background = 'linear-gradient(to bottom,rgb(40, 40, 41),rgb(37, 35, 35))';
            weatherIcon.className = 'fas fa-snowflake';
            break;
        case 'sunny':
            elements.sun.classList.add('active');
            weatherContainer.style.background = 'linear-gradient(to bottom, #4a9eff, #86c5ff)';
            weatherIcon.className = 'fas fa-sun';
            break;
    }

    // Move to next state
    currentState = (currentState + 1) % weatherStates.length;
}

// Initialize and Start Weather Animation
const weatherElements = createWeatherElements();
setInterval(() => updateWeather(weatherElements), 5000);
updateWeather(weatherElements); // Initial setup

// Theme Toggle
document.getElementById('theme-switch').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-theme', !e.target.checked);
});

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getUserLocation();
});
