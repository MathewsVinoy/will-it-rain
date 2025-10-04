/**
 * Utility functions for weather calculations and data processing
 */

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9
}

/**
 * Convert meters per second to miles per hour
 */
export function mpsToMph(mps) {
  return mps * 2.23694
}

/**
 * Convert millimeters to inches
 */
export function mmToInches(mm) {
  return mm * 0.0393701
}

/**
 * Calculate heat index (feels like temperature)
 * @param {number} temp - Temperature in Fahrenheit
 * @param {number} humidity - Relative humidity (0-100)
 */
export function calculateHeatIndex(temp, humidity) {
  if (temp < 80) return temp
  
  const t = temp
  const rh = humidity
  
  let hi = 0.5 * (t + 61.0 + ((t - 68.0) * 1.2) + (rh * 0.094))
  
  if (hi > 80) {
    hi = -42.379 + 
         2.04901523 * t + 
         10.14333127 * rh - 
         0.22475541 * t * rh - 
         0.00683783 * t * t - 
         0.05481717 * rh * rh + 
         0.00122874 * t * t * rh + 
         0.00085282 * t * rh * rh - 
         0.00000199 * t * t * rh * rh
  }
  
  return Math.round(hi)
}

/**
 * Calculate wind chill
 * @param {number} temp - Temperature in Fahrenheit
 * @param {number} windSpeed - Wind speed in mph
 */
export function calculateWindChill(temp, windSpeed) {
  if (temp > 50 || windSpeed < 3) return temp
  
  const wc = 35.74 + 
             0.6215 * temp - 
             35.75 * Math.pow(windSpeed, 0.16) + 
             0.4275 * temp * Math.pow(windSpeed, 0.16)
  
  return Math.round(wc)
}

/**
 * Determine comfort level based on temperature and humidity
 */
export function getComfortLevel(temp, humidity) {
  const heatIndex = calculateHeatIndex(temp, humidity)
  
  if (heatIndex >= 105) return { level: 'Dangerous', color: '#991b1b', icon: '🔥' }
  if (heatIndex >= 90) return { level: 'Uncomfortable', color: '#f59e0b', icon: '😰' }
  if (temp >= 70 && temp <= 80 && humidity <= 60) return { level: 'Comfortable', color: '#10b981', icon: '😊' }
  if (temp < 50) return { level: 'Cold', color: '#3b82f6', icon: '🥶' }
  
  return { level: 'Moderate', color: '#8b5cf6', icon: '😐' }
}

/**
 * Get weather condition description
 */
export function getWeatherDescription(params) {
  const { temp, precip, wind, humidity } = params
  const conditions = []
  
  if (temp > 85) conditions.push('hot')
  if (temp < 40) conditions.push('cold')
  if (precip > 0.5) conditions.push('rainy')
  if (wind > 20) conditions.push('windy')
  if (humidity > 80) conditions.push('humid')
  
  if (conditions.length === 0) return 'Pleasant weather expected'
  
  return `Expect ${conditions.join(', ')} conditions`
}

/**
 * Calculate probability ranking
 */
export function getProbabilityRanking(probability) {
  if (probability >= 80) return { label: 'Very Likely', color: '#991b1b' }
  if (probability >= 60) return { label: 'Likely', color: '#f59e0b' }
  if (probability >= 40) return { label: 'Possible', color: '#8b5cf6' }
  if (probability >= 20) return { label: 'Unlikely', color: '#3b82f6' }
  return { label: 'Very Unlikely', color: '#10b981' }
}

/**
 * Format location name
 */
export function formatLocationName(location) {
  if (!location) return 'Unknown Location'
  
  if (location.name) return location.name
  
  return `${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°`
}

/**
 * Get season for Northern Hemisphere
 */
export function getSeason(date) {
  const month = new Date(date).getMonth()
  
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Fall'
  return 'Winter'
}

/**
 * Calculate trend direction
 */
export function calculateTrend(data) {
  if (data.length < 2) return { direction: 'stable', change: 0 }
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2))
  const secondHalf = data.slice(Math.floor(data.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length
  
  const change = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1)
  
  return {
    direction: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
    change: Math.abs(change),
    firstAvg: firstAvg.toFixed(2),
    secondAvg: secondAvg.toFixed(2)
  }
}

/**
 * Generate color for probability
 */
export function getProbabilityColor(probability) {
  if (probability >= 70) return '#ef4444'
  if (probability >= 50) return '#f59e0b'
  if (probability >= 30) return '#eab308'
  return '#10b981'
}

/**
 * Validate location coordinates
 */
export function isValidCoordinate(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

/**
 * Calculate distance between two coordinates (in miles)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function toRad(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get weather icon based on conditions
 */
export function getWeatherIcon(conditions) {
  if (conditions.includes('rain')) return '🌧️'
  if (conditions.includes('snow')) return '❄️'
  if (conditions.includes('hot')) return '🔥'
  if (conditions.includes('cold')) return '🥶'
  if (conditions.includes('windy')) return '💨'
  if (conditions.includes('cloudy')) return '☁️'
  return '☀️'
}

/**
 * Generate weather advice
 */
export function generateWeatherAdvice(weatherData) {
  const advice = []
  
  if (weatherData.summary.veryHot > 50) {
    advice.push('⚠️ High heat probability - Plan for shade and hydration')
  }
  
  if (weatherData.summary.veryCold > 50) {
    advice.push('🧥 Cold conditions likely - Dress warmly')
  }
  
  if (weatherData.summary.veryWet > 40) {
    advice.push('☔ Rain is possible - Have a backup indoor plan')
  }
  
  if (weatherData.summary.veryWindy > 40) {
    advice.push('💨 Windy conditions expected - Secure loose items')
  }
  
  if (advice.length === 0) {
    advice.push('✅ Weather conditions look favorable!')
  }
  
  return advice
}

/**
 * Calculate overall weather score (0-100)
 * Higher is better
 */
export function calculateWeatherScore(weatherData) {
  const negativeFactors = 
    weatherData.summary.veryHot +
    weatherData.summary.veryCold +
    weatherData.summary.veryWet +
    weatherData.summary.veryWindy
  
  const score = Math.max(0, 100 - (negativeFactors / 4))
  
  return {
    score: Math.round(score),
    rating: score >= 80 ? 'Excellent' : 
            score >= 60 ? 'Good' : 
            score >= 40 ? 'Fair' : 'Poor'
  }
}
