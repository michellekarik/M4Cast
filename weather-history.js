document.getElementById('city-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const cityName = document.getElementById('city-name').value.trim();
    const countryCode = document.getElementById('country-code').value.trim();

    if (cityName && countryCode) {
        // Make an API call to the backend
        fetch(`/weather-history?city=${cityName}&country=${countryCode}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.current) {
                    displayWeatherData(data.current);
                } else {
                    displayErrorMessage("No weather data available.");
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                displayErrorMessage("Error fetching weather data.");
            });
    } else {
        displayErrorMessage("Please enter both city and country code.");
    }
});

// Function to display weather data
function displayWeatherData(weatherData) {
    const weatherHistoryContainer = document.getElementById('weather-history');
    weatherHistoryContainer.innerHTML = ''; // Clear previous content

    const weatherEntry = document.createElement('div');
    weatherEntry.className = 'weather-entry';

    const timestamp = new Date(weatherData.dt * 1000).toLocaleString(); // Convert UNIX timestamp to human-readable date/time
    const temperature = weatherData.temp.toFixed(2); // Temperature in Celsius
    const humidity = weatherData.humidity;
    const weatherDescription = weatherData.weather[0].description;

    weatherEntry.innerHTML = `
        <h3>${timestamp}</h3>
        <p class="temp">Temperature: ${temperature}°C</p>
        <p class="humidity">Humidity: ${humidity}%</p>
        <p class="weather-description">Condition: ${weatherDescription}</p>
    `;

    weatherHistoryContainer.appendChild(weatherEntry);
}

// Function to display error messages
function displayErrorMessage(message) {
    const weatherHistoryContainer = document.getElementById('weather-history');
    weatherHistoryContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
