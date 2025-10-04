from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
import statistics
import json

app = Flask(__name__)

# Get API keys from environment variables
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY', 'your_weather_api_key_here')
NASA_API_KEY = os.getenv('NASA_API_KEY', 'DEMO_KEY')

# API URLs
NASA_POWER_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point'
WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
NASA_EARTH_URL = 'https://api.nasa.gov/planetary/earth/imagery'

# Initialize geocoder
geolocator = Nominatim(user_agent="eco_planner_app")

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/geocode', methods=['POST'])
def geocode_location():
    """Convert location name to coordinates"""
    try:
        data = request.get_json()
        location = data.get('location', '')
        
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        location_info = geolocator.geocode(location)
        
        if location_info:
            return jsonify({
                'lat': location_info.latitude,
                'lon': location_info.longitude,
                'display_name': location_info.address
            }), 200
        else:
            return jsonify({'error': 'Location not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@app.route('/nasa/historical-analysis', methods=['POST'])
def get_historical_analysis():
    """
    Get historical weather data from NASA POWER API and calculate likelihoods
    based on user-defined thresholds
    """
    try:
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')
        target_date = data.get('date')  # Format: YYYY-MM-DD
        thresholds = data.get('thresholds', {})
        
        if not lat or not lon or not target_date:
            return jsonify({'error': 'Latitude, longitude, and date are required'}), 400
        
        # Parse the target date to get month and day
        date_obj = datetime.strptime(target_date, '%Y-%m-%d')
        target_month = date_obj.month
        target_day = date_obj.day
        
        # Get historical data for the past 30 years
        current_year = datetime.now().year
        start_year = current_year - 30
        end_year = current_year - 1
        
        # NASA POWER API parameters
        params = {
            'parameters': 'T2M_MAX,T2M_MIN,PRECTOTCORR,WS2M',  # Max temp, Min temp, Precipitation, Wind speed
            'community': 'RE',
            'longitude': lon,
            'latitude': lat,
            'start': f'{start_year}0101',
            'end': f'{end_year}1231',
            'format': 'JSON'
        }
        
        response = requests.get(NASA_POWER_URL, params=params, timeout=30)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch NASA data'}), response.status_code
        
        nasa_data = response.json()
        
        if 'properties' not in nasa_data or 'parameter' not in nasa_data['properties']:
            return jsonify({'error': 'Invalid NASA data format'}), 500
        
        parameters = nasa_data['properties']['parameter']
        
        # Extract data for the specific day across all years
        historical_data = extract_day_data(parameters, target_month, target_day, start_year, end_year)
        
        # Calculate likelihoods based on thresholds
        likelihoods = calculate_likelihoods(historical_data, thresholds)
        
        # Calculate statistics
        stats = calculate_statistics(historical_data)
        
        return jsonify({
            'likelihoods': likelihoods,
            'statistics': stats,
            'years_analyzed': end_year - start_year + 1,
            'location': {
                'lat': lat,
                'lon': lon
            },
            'target_date': target_date
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_day_data(parameters, target_month, target_day, start_year, end_year):
    """Extract weather data for a specific day across multiple years"""
    data_by_year = []
    
    for year in range(start_year, end_year + 1):
        try:
            date_str = f'{year}{target_month:02d}{target_day:02d}'
            
            # Convert Celsius to Fahrenheit for temperature
            max_temp_c = parameters['T2M_MAX'].get(date_str)
            min_temp_c = parameters['T2M_MIN'].get(date_str)
            precip = parameters['PRECTOTCORR'].get(date_str)
            wind = parameters['WS2M'].get(date_str)
            
            if max_temp_c is not None and min_temp_c is not None:
                max_temp_f = (max_temp_c * 9/5) + 32
                min_temp_f = (min_temp_c * 9/5) + 32
                
                data_by_year.append({
                    'year': year,
                    'max_temp': max_temp_f,
                    'min_temp': min_temp_f,
                    'precipitation': precip if precip is not None else 0,
                    'wind_speed': wind if wind is not None else 0
                })
        except:
            continue
    
    return data_by_year

def calculate_likelihoods(historical_data, thresholds):
    """Calculate the likelihood of weather conditions based on thresholds"""
    total_years = len(historical_data)
    
    if total_years == 0:
        return {
            'very_hot': 0,
            'very_wet': 0,
            'very_windy': 0,
            'very_cold': 0,
            'very_dry': 0
        }
    
    # Count years meeting each threshold
    very_hot_count = sum(1 for d in historical_data if d['max_temp'] >= thresholds.get('very_hot', 90))
    very_wet_count = sum(1 for d in historical_data if d['precipitation'] >= thresholds.get('very_wet', 0.5))
    very_windy_count = sum(1 for d in historical_data if d['wind_speed'] >= thresholds.get('very_windy', 15))
    very_cold_count = sum(1 for d in historical_data if d['min_temp'] <= thresholds.get('very_cold', 32))
    very_dry_count = sum(1 for d in historical_data if d['precipitation'] <= thresholds.get('very_dry', 0.01))
    
    return {
        'very_hot': round((very_hot_count / total_years) * 100, 1),
        'very_wet': round((very_wet_count / total_years) * 100, 1),
        'very_windy': round((very_windy_count / total_years) * 100, 1),
        'very_cold': round((very_cold_count / total_years) * 100, 1),
        'very_dry': round((very_dry_count / total_years) * 100, 1)
    }

def calculate_statistics(historical_data):
    """Calculate statistical summaries of historical data"""
    if not historical_data:
        return {}
    
    max_temps = [d['max_temp'] for d in historical_data]
    min_temps = [d['min_temp'] for d in historical_data]
    precips = [d['precipitation'] for d in historical_data]
    winds = [d['wind_speed'] for d in historical_data]
    
    return {
        'temperature': {
            'max_avg': round(statistics.mean(max_temps), 1),
            'max_high': round(max(max_temps), 1),
            'max_low': round(min(max_temps), 1),
            'min_avg': round(statistics.mean(min_temps), 1),
            'min_high': round(max(min_temps), 1),
            'min_low': round(min(min_temps), 1)
        },
        'precipitation': {
            'avg': round(statistics.mean(precips), 2),
            'max': round(max(precips), 2),
            'days_with_rain': sum(1 for p in precips if p > 0.01)
        },
        'wind': {
            'avg': round(statistics.mean(winds), 1),
            'max': round(max(winds), 1)
        }
    }

@app.route('/export-data', methods=['POST'])
def export_data():
    """Export historical data as CSV or JSON"""
    try:
        data = request.get_json()
        export_format = data.get('format', 'json')
        analysis_data = data.get('data', {})
        
        if export_format == 'csv':
            # Create CSV format
            csv_content = "Category,Likelihood (%)\n"
            for category, value in analysis_data.get('likelihoods', {}).items():
                csv_content += f"{category.replace('_', ' ').title()},{value}\n"
            
            return jsonify({
                'content': csv_content,
                'filename': f'eco_planner_analysis_{datetime.now().strftime("%Y%m%d")}.csv'
            }), 200
        else:
            # Return JSON format
            return jsonify({
                'content': json.dumps(analysis_data, indent=2),
                'filename': f'eco_planner_analysis_{datetime.now().strftime("%Y%m%d")}.json'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
