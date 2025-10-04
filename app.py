from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime

app = Flask(__name__)

# Get API key from environment variable
API_KEY = os.getenv('WEATHER_API_KEY', 'your_api_key_here')
BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
FORECAST_URL = 'http://api.openweathermap.org/data/2.5/forecast'

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def get_weather():
    """Get current weather data for a city"""
    try:
        data = request.get_json()
        city = data.get('city', '')
        
        if not city:
            return jsonify({'error': 'City name is required'}), 400
        
        # Make API request to OpenWeatherMap
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'  # Use metric units (Celsius)
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            weather_data = response.json()
            
            # Extract relevant information
            result = {
                'city': weather_data['name'],
                'country': weather_data['sys']['country'],
                'temperature': round(weather_data['main']['temp'], 1),
                'feels_like': round(weather_data['main']['feels_like'], 1),
                'humidity': weather_data['main']['humidity'],
                'pressure': weather_data['main']['pressure'],
                'description': weather_data['weather'][0]['description'].title(),
                'icon': weather_data['weather'][0]['icon'],
                'wind_speed': weather_data['wind']['speed'],
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            return jsonify(result), 200
        else:
            error_message = response.json().get('message', 'City not found')
            return jsonify({'error': error_message}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/forecast', methods=['POST'])
def get_forecast():
    """Get 5-day weather forecast for a city"""
    try:
        data = request.get_json()
        city = data.get('city', '')
        
        if not city:
            return jsonify({'error': 'City name is required'}), 400
        
        # Make API request for forecast
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(FORECAST_URL, params=params)
        
        if response.status_code == 200:
            forecast_data = response.json()
            
            # Extract forecast for the next 5 days (one entry per day at noon)
            forecasts = []
            for item in forecast_data['list'][::8]:  # Get every 8th item (24 hours apart)
                forecasts.append({
                    'date': datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d'),
                    'temperature': round(item['main']['temp'], 1),
                    'description': item['weather'][0]['description'].title(),
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity']
                })
            
            result = {
                'city': forecast_data['city']['name'],
                'country': forecast_data['city']['country'],
                'forecasts': forecasts[:5]  # Limit to 5 days
            }
            
            return jsonify(result), 200
        else:
            error_message = response.json().get('message', 'City not found')
            return jsonify({'error': error_message}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
