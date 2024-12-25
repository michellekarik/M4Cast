const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const apiKey = '458aaa30790089d78c0d5707e92622bd'; // Replace with your OpenWeatherMap API key

L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
    maxZoom: 19
}).addTo(map);

L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
    maxZoom: 19
}).addTo(map);

L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
    maxZoom: 19
}).addTo(map);

L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
    maxZoom: 19
}).addTo(map);

// Example coordinates to add temperature markers (add more as needed)
const cities = [
    { name: "Mumbai", coords: [19.0760, 72.8777] },
    { name: "Delhi", coords: [28.7041, 77.1025] },
    { name: "Bangalore", coords: [12.9716, 77.5946] }
];

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data.main.temp;
}

async function addMarkers() {
    for (const city of cities) {
        const temp = await getWeather(city);
        L.marker(city.coords).addTo(map)
            .bindPopup(`<b>${city.name}</b><br>Temperature: ${temp}°C`);
    }
}

addMarkers();
