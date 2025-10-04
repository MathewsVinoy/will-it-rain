# Weather Prediction Flask App

A beautiful and responsive Flask web application that provides current weather data and 5-day forecasts for any city using the OpenWeatherMap API.

## Features

- 🌡️ Current weather information (temperature, humidity, wind speed, pressure)
- 📅 5-day weather forecast
- 🛰️ NASA Satellite imagery of searched location
- 🌍 EPIC: Earth Polychromatic Imaging Camera views
- � Astronomy Picture of the Day (APOD)
- �🎨 Beautiful and responsive UI with gradient design
- 🔍 Search any city worldwide
- 📱 Mobile-friendly interface
- ⚡ Real-time weather data from OpenWeatherMap API
- 🚀 NASA API integration for Earth observation data

## Prerequisites

- Python 3.7 or higher
- OpenWeatherMap API key (free)
- NASA API key (free - or use DEMO_KEY for testing)

## Installation

1. **Clone or navigate to the project directory**

2. **Create a virtual environment (recommended)**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Get your API keys**
   
   **OpenWeatherMap API:**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key from your account dashboard
   
   **NASA API:**
   - Visit [NASA API Portal](https://api.nasa.gov/)
   - Sign up for a free API key
   - Or use `DEMO_KEY` for testing (limited to 30 requests per hour)

5. **Configure your API keys**
   
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```
   WEATHER_API_KEY=your_weather_api_key_here
   NASA_API_KEY=your_nasa_api_key_here
   ```

## Running the Application

1. **Activate your virtual environment** (if not already activated)
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Run the Flask app**
   ```bash
   python app.py
   ```

3. **Open your browser**
   
   Navigate to: `http://localhost:5000`

## Usage

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View current weather details
4. Click "View 5-Day Forecast" to see the forecast
5. Explore NASA satellite data:
   - **Load Satellite Image**: View Earth satellite imagery of the location
   - **Load EPIC Image**: See Earth from NASA's EPIC camera in space
   - **Load APOD**: Discover today's Astronomy Picture of the Day
6. Click "Hide Forecast" to collapse the forecast section

## Project Structure

```
weather-app/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore file
├── README.md             # This file
├── templates/
│   └── index.html        # HTML template
└── static/
    ├── style.css         # CSS styles
    └── script.js         # JavaScript functionality
```

## API Endpoints

### Weather Endpoints
- `GET /` - Main page
- `POST /weather` - Get current weather for a city
- `POST /forecast` - Get 5-day forecast for a city

### NASA Endpoints
- `POST /nasa/earth-image` - Get satellite imagery for coordinates
- `GET /nasa/apod` - Get Astronomy Picture of the Day
- `GET /nasa/epic` - Get EPIC Earth images from space

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **APIs**: 
  - OpenWeatherMap API (Weather data)
  - NASA API (Satellite imagery, EPIC, APOD)
- **Libraries**: 
  - Requests (HTTP client)
  - Geopy (Geocoding)

## Features Explained

### Current Weather
- Temperature (Celsius)
- Feels like temperature
- Weather description with icon
- Humidity percentage
- Wind speed (m/s)
- Atmospheric pressure (hPa)

### 5-Day Forecast
- Daily weather predictions
- Temperature
- Weather conditions
- Humidity levels
- Weather icons

### NASA Data Integration
- **Earth Satellite Imagery**: Real satellite photos of searched locations
- **EPIC Camera**: Full Earth images from the DSCOVR satellite
- **APOD**: Daily astronomy pictures with detailed explanations
- High-resolution space imagery
- Cloud coverage data

## Troubleshooting

**API Key Issues**
- Make sure your API key is correctly set in the `.env` file
- Note that new API keys may take a few minutes to activate
- Verify your API key at [OpenWeatherMap](https://home.openweathermap.org/api_keys)

**City Not Found**
- Check spelling of the city name
- Try adding country code (e.g., "London,UK")
- Use city name in English

**Connection Errors**
- Check your internet connection
- Verify that you can access openweathermap.org
- Check if your firewall is blocking the connection

## License

This project is open source and available for educational purposes.

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Satellite imagery and space data from [NASA API](https://api.nasa.gov/)
- Icons from OpenWeatherMap
- EPIC camera images from NOAA's DSCOVR satellite
# will-it-rain
