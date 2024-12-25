document.getElementById("weather-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the user's input
    const city = document.getElementById("city").value.trim();
    const date = document.getElementById("date").value;

    // Check if both fields are filled
    if (!city || !date) {
        displayError("Please provide both city name and a valid date.");
        return;
    }

    // Hardcoded API key (replace with your actual API key)
    const apiKey = "bb29d7d7b652d0be564bd43ca1dd2f86"; // Replace with your actual OpenWeatherMap API key

    // API call to OpenWeatherMap Current Weather API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Fetch the current weather data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data, date);
            } else {
                displayError("Location not found.");
            }
        })
        .catch(error => {
            displayError("An error occurred: " + error);
        });
});

function displayWeather(data, date) {
    const result = document.getElementById("weather-result");
    const weatherDescription = data.weather[0].description;
    const temperature = (data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    result.innerHTML = `
        <h2>Weather for ${data.name}, ${data.sys.country} on ${date}</h2>
        <p><strong>Weather Description:</strong> ${weatherDescription}</p>
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    `;
}

function displayError(message) {
    const result = document.getElementById("weather-result");
    result.innerHTML = `<p class="error">${message}</p>`;
}
