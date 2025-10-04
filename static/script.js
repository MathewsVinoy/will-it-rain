let currentCity = '';

// Allow Enter key to trigger search
document.getElementById('cityInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    currentCity = city;
    hideError();
    hideWeather();
    hideForecast();
    showLoading();
    
    try {
        const response = await fetch('/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayWeather(data);
        } else {
            showError(data.error || 'Failed to fetch weather data');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = `${data.city}, ${data.country}`;
    document.getElementById('temp').textContent = data.temperature;
    document.getElementById('description').textContent = data.description;
    document.getElementById('feelsLike').textContent = data.feels_like;
    document.getElementById('humidity').textContent = data.humidity;
    document.getElementById('windSpeed').textContent = data.wind_speed;
    document.getElementById('pressure').textContent = data.pressure;
    
    const iconUrl = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('weatherIcon').alt = data.description;
    
    showWeather();
}

async function getForecast() {
    if (!currentCity) return;
    
    showLoading();
    
    try {
        const response = await fetch('/forecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: currentCity })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayForecast(data);
        } else {
            showError(data.error || 'Failed to fetch forecast data');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayForecast(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';
    
    data.forecasts.forEach(forecast => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const iconUrl = `http://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
        
        card.innerHTML = `
            <div class="date">${formatDate(forecast.date)}</div>
            <img src="${iconUrl}" alt="${forecast.description}" />
            <div class="temp">${forecast.temperature}°C</div>
            <div class="desc">${forecast.description}</div>
            <div class="desc">💧 ${forecast.humidity}%</div>
        `;
        
        forecastCards.appendChild(card);
    });
    
    document.getElementById('forecastResult').classList.remove('hidden');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

function showWeather() {
    document.getElementById('weatherResult').classList.remove('hidden');
}

function hideWeather() {
    document.getElementById('weatherResult').classList.add('hidden');
}

function hideForecast() {
    document.getElementById('forecastResult').classList.add('hidden');
}
