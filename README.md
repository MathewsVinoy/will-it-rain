# Weather Prediction Flask App

A beautiful and responsive Flask web application that provides current weather data and 5-day forecasts for any city using the OpenWeatherMap API.

## Features

- 🌡️ Current weather information (temperature, humidity, wind speed, pressure)
- 📅 5-day weather forecast
- 🎨 Beautiful and responsive UI with gradient design
- 🔍 Search any city worldwide
- 📱 Mobile-friendly interface
- ⚡ Real-time weather data from OpenWeatherMap API

## Prerequisites

- Python 3.7 or higher
- OpenWeatherMap API key (free)

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

4. **Get your OpenWeatherMap API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key from your account dashboard

5. **Configure your API key**
   
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API key:
   ```
   WEATHER_API_KEY=your_actual_api_key_here
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
5. Click "Hide Forecast" to collapse the forecast section

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

- `GET /` - Main page
- `POST /weather` - Get current weather for a city
- `POST /forecast` - Get 5-day forecast for a city

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **API**: OpenWeatherMap API
- **HTTP Client**: Requests library

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
- Icons from OpenWeatherMap
# will-it-rain
