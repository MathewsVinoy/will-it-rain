from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim

app = Flask(__name__)

# Get API keys from environment variables
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY', 'your_weather_api_key_here')
NASA_API_KEY = os.getenv('NASA_API_KEY', 'DEMO_KEY')

# API URLs
WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
FORECAST_URL = 'http://api.openweathermap.org/data/2.5/forecast'
NASA_EARTH_URL = 'https://api.nasa.gov/planetary/earth/imagery'
NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod'
NASA_EPIC_URL = 'https://api.nasa.gov/EPIC/api/natural'

# Initialize geocoder
geolocator = Nominatim(user_agent="weather_app")

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
            'appid': WEATHER_API_KEY,
            'units': 'metric'  # Use metric units (Celsius)
        }
        
        response = requests.get(WEATHER_BASE_URL, params=params)
        
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
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'coordinates': {
                    'lat': weather_data['coord']['lat'],
                    'lon': weather_data['coord']['lon']
                }
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
            'appid': WEATHER_API_KEY,
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

@app.route('/nasa/earth-image', methods=['POST'])
def get_earth_image():
    """Get NASA Earth satellite image for a location"""
    try:
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Get Earth imagery from NASA
        params = {
            'lat': lat,
            'lon': lon,
            'dim': 0.15,
            'api_key': NASA_API_KEY
        }
        
        response = requests.get(NASA_EARTH_URL, params=params)
        
        if response.status_code == 200:
            image_data = response.json()
            return jsonify({
                'image_url': image_data.get('url'),
                'date': image_data.get('date'),
                'cloud_score': image_data.get('cloud_score', 'N/A')
            }), 200
        else:
            return jsonify({'error': 'Failed to fetch NASA Earth image'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/nasa/apod', methods=['GET'])
def get_astronomy_picture():
    """Get NASA Astronomy Picture of the Day"""
    try:
        params = {
            'api_key': NASA_API_KEY,
            'thumbs': True
        }
        
        response = requests.get(NASA_APOD_URL, params=params)
        
        if response.status_code == 200:
            apod_data = response.json()
            return jsonify({
                'title': apod_data.get('title'),
                'explanation': apod_data.get('explanation'),
                'url': apod_data.get('url'),
                'date': apod_data.get('date'),
                'media_type': apod_data.get('media_type')
            }), 200
        else:
            return jsonify({'error': 'Failed to fetch APOD'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/nasa/epic', methods=['GET'])
def get_epic_images():
    """Get NASA EPIC (Earth Polychromatic Imaging Camera) images"""
    try:
        params = {
            'api_key': NASA_API_KEY
        }
        
        response = requests.get(NASA_EPIC_URL, params=params)
        
        if response.status_code == 200:
            epic_data = response.json()
            
            if epic_data:
                # Get the most recent image
                latest = epic_data[0]
                date = latest['date'].split()[0].replace('-', '/')
                image_name = latest['image']
                
                image_url = f"https://api.nasa.gov/EPIC/archive/natural/{date}/png/{image_name}.png?api_key={NASA_API_KEY}"
                
                return jsonify({
                    'image_url': image_url,
                    'caption': latest.get('caption', ''),
                    'date': latest.get('date'),
                    'coords': latest.get('centroid_coordinates', {})
                }), 200
            else:
                return jsonify({'error': 'No EPIC images available'}), 404
        else:
            return jsonify({'error': 'Failed to fetch EPIC images'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
