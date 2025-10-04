// Eco-Planner Application
let map;
let marker;
let currentLat = null;
let currentLon = null;
let currentAnalysisData = null;

// Initialize the map on page load
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setDefaultDate();
});

function initMap() {
    // Initialize Leaflet map centered on USA
    map = L.map('map').setView([39.8283, -98.5795], 4);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add click event to map
    map.on('click', function(e) {
        setMapLocation(e.latlng.lat, e.latlng.lng);
    });
}

function setMapLocation(lat, lon) {
    currentLat = lat;
    currentLon = lon;
    
    // Remove existing marker if any
    if (marker) {
        map.removeLayer(marker);
    }
    
    // Add new marker
    marker = L.marker([lat, lon]).addTo(map);
    
    // Update coordinate display
    document.getElementById('coordDisplay').textContent = 
        `Selected: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
}

function setDefaultDate() {
    // Set default date to today
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('dateInput').value = dateString;
}

async function searchLocation() {
    const location = document.getElementById('locationInput').value.trim();
    
    if (!location) {
        showError('Please enter a location');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        const response = await fetch('/geocode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setMapLocation(data.lat, data.lon);
            map.setView([data.lat, data.lon], 10);
        } else {
            showError(data.error || 'Location not found');
        }
    } catch (error) {
        showError('Failed to find location');
    } finally {
        hideLoading();
    }
}

function updateThresholdValue(type, value) {
    const numValue = parseFloat(value);
    let displayValue;
    
    switch(type) {
        case 'hot':
            displayValue = `${numValue}°F`;
            break;
        case 'wet':
            displayValue = `${numValue} in`;
            break;
        case 'windy':
            displayValue = `${numValue} mph`;
            break;
        case 'cold':
            displayValue = `${numValue}°F`;
            break;
        case 'dry':
            displayValue = `${numValue} in`;
            break;
    }
    
    document.getElementById(`${type}Value`).textContent = displayValue;
}

async function analyzeWeather() {
    // Validate inputs
    if (currentLat === null || currentLon === null) {
        showError('Please select a location on the map or search for one');
        return;
    }
    
    const dateInput = document.getElementById('dateInput').value;
    if (!dateInput) {
        showError('Please select a date');
        return;
    }
    
    // Get threshold values
    const thresholds = {
        very_hot: parseFloat(document.getElementById('hotThreshold').value),
        very_wet: parseFloat(document.getElementById('wetThreshold').value),
        very_windy: parseFloat(document.getElementById('windyThreshold').value),
        very_cold: parseFloat(document.getElementById('coldThreshold').value),
        very_dry: parseFloat(document.getElementById('dryThreshold').value)
    };
    
    showLoading();
    hideError();
    hideResults();
    
    try {
        const response = await fetch('/nasa/historical-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: currentLat,
                lon: currentLon,
                date: dateInput,
                thresholds: thresholds
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentAnalysisData = data;
            displayResults(data, dateInput);
        } else {
            showError(data.error || 'Failed to analyze weather data');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayResults(data, targetDate) {
    // Update result info
    const dateObj = new Date(targetDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('resultInfo').innerHTML = `
        Analysis for <strong>${formattedDate}</strong> at 
        <strong>${currentLat.toFixed(4)}°, ${currentLon.toFixed(4)}°</strong><br>
        Based on <strong>${data.years_analyzed} years</strong> of NASA satellite data
    `;
    
    // Display likelihoods with animated gauges
    displayLikelihood('Hot', data.likelihoods.very_hot);
    displayLikelihood('Wet', data.likelihoods.very_wet);
    displayLikelihood('Windy', data.likelihoods.very_windy);
    displayLikelihood('Cold', data.likelihoods.very_cold);
    displayLikelihood('Dry', data.likelihoods.very_dry);
    
    // Display statistics
    displayStatistics(data.statistics);
    
    // Show results panel
    showResults();
}

function displayLikelihood(category, percentage) {
    const categoryLower = category.toLowerCase();
    const gauge = document.getElementById(`gauge${category}`);
    const percentDisplay = document.getElementById(`percent${category}`);
    
    // Determine color based on percentage
    let color;
    if (percentage >= 70) {
        color = '#e74c3c'; // Red - High
    } else if (percentage >= 40) {
        color = '#f39c12'; // Orange - Medium
    } else {
        color = '#2ecc71'; // Green - Low
    }
    
    // Animate gauge
    setTimeout(() => {
        gauge.style.width = `${percentage}%`;
        gauge.style.backgroundColor = color;
        
        // Animate percentage
        animatePercentage(percentDisplay, percentage);
    }, 100);
}

function animatePercentage(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = `${Math.round(current)}%`;
    }, 20);
}

function displayStatistics(stats) {
    const statsGrid = document.getElementById('statsGrid');
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h4>🌡️ Temperature</h4>
            <p><strong>Max Average:</strong> ${stats.temperature.max_avg}°F</p>
            <p><strong>Historical High:</strong> ${stats.temperature.max_high}°F</p>
            <p><strong>Historical Low:</strong> ${stats.temperature.max_low}°F</p>
            <p><strong>Min Average:</strong> ${stats.temperature.min_avg}°F</p>
        </div>
        
        <div class="stat-card">
            <h4>💧 Precipitation</h4>
            <p><strong>Average:</strong> ${stats.precipitation.avg} inches</p>
            <p><strong>Maximum:</strong> ${stats.precipitation.max} inches</p>
            <p><strong>Rainy Days:</strong> ${stats.precipitation.days_with_rain} out of ${currentAnalysisData.years_analyzed}</p>
        </div>
        
        <div class="stat-card">
            <h4>💨 Wind Speed</h4>
            <p><strong>Average:</strong> ${stats.wind.avg} m/s</p>
            <p><strong>Maximum:</strong> ${stats.wind.max} m/s</p>
        </div>
    `;
}

async function exportData(format) {
    if (!currentAnalysisData) {
        showError('No data to export');
        return;
    }
    
    try {
        const response = await fetch('/export-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                format: format,
                data: currentAnalysisData
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Create download link
            const blob = new Blob([data.content], { 
                type: format === 'csv' ? 'text/csv' : 'application/json' 
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            showError(data.error || 'Failed to export data');
        }
    } catch (error) {
        showError('Failed to export data');
    }
}

// Utility functions
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
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

function showResults() {
    document.getElementById('resultsPanel').classList.remove('hidden');
}

function hideResults() {
    document.getElementById('resultsPanel').classList.add('hidden');
}

// Allow Enter key on location input
document.getElementById('locationInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchLocation();
    }
});
