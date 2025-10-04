// NASA API Integration Guide
// This file shows how to integrate real NASA Earth observation data

// NASA POWER API Configuration
const NASA_POWER_BASE_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point'

/**
 * Fetch weather data from NASA POWER API
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} startDate - Start date (YYYYMMDD)
 * @param {string} endDate - End date (YYYYMMDD)
 * @returns {Promise<Object>} Weather data
 */
export async function fetchNASAPowerData(latitude, longitude, startDate, endDate) {
  const parameters = [
    'T2M',           // Temperature at 2 Meters
    'T2M_MAX',       // Maximum Temperature at 2 Meters
    'T2M_MIN',       // Minimum Temperature at 2 Meters
    'PRECTOTCORR',   // Precipitation Corrected
    'WS10M',         // Wind Speed at 10 Meters
    'WS10M_MAX',     // Maximum Wind Speed at 10 Meters
    'RH2M',          // Relative Humidity at 2 Meters
    'CLOUD_AMT',     // Cloud Amount
  ].join(',')

  const url = `${NASA_POWER_BASE_URL}?` +
    `parameters=${parameters}` +
    `&community=RE` +
    `&longitude=${longitude}` +
    `&latitude=${latitude}` +
    `&start=${startDate}` +
    `&end=${endDate}` +
    `&format=JSON`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`NASA API Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching NASA POWER data:', error)
    throw error
  }
}

/**
 * Transform NASA POWER data into app format
 * @param {Object} nasaData - Raw NASA API response
 * @param {Object} thresholds - User-defined thresholds
 * @returns {Object} Formatted weather data
 */
export function transformNASAData(nasaData, thresholds) {
  const parameters = nasaData.properties.parameter
  const dates = Object.keys(parameters.T2M || {})

  // Calculate statistics
  const stats = calculateStatistics(parameters, dates, thresholds)
  
  return {
    temperature: {
      historical: transformToYearlyData(parameters.T2M, dates),
      probabilities: stats.temperature,
      averages: {
        high: calculateAverage(parameters.T2M_MAX),
        low: calculateAverage(parameters.T2M_MIN),
        mean: calculateAverage(parameters.T2M)
      }
    },
    precipitation: {
      historical: transformToYearlyData(parameters.PRECTOTCORR, dates),
      probabilities: stats.precipitation,
      averages: {
        amount: calculateAverage(parameters.PRECTOTCORR),
        rainyDays: countRainyDays(parameters.PRECTOTCORR)
      }
    },
    wind: {
      historical: transformToYearlyData(parameters.WS10M, dates),
      probabilities: stats.wind,
      averages: {
        speed: calculateAverage(parameters.WS10M),
        maxGust: calculateAverage(parameters.WS10M_MAX)
      }
    },
    humidity: {
      average: calculateAverage(parameters.RH2M),
      historical: transformToYearlyData(parameters.RH2M, dates)
    },
    cloudCover: {
      average: calculateAverage(parameters.CLOUD_AMT),
      historical: transformToYearlyData(parameters.CLOUD_AMT, dates)
    }
  }
}

/**
 * Calculate statistics based on thresholds
 */
function calculateStatistics(parameters, dates, thresholds) {
  const temps = Object.values(parameters.T2M || {})
  const precip = Object.values(parameters.PRECTOTCORR || {})
  const wind = Object.values(parameters.WS10M || {})

  return {
    temperature: {
      aboveThreshold: calculateProbability(temps, (v) => v > thresholds.tempHot),
      belowThreshold: calculateProbability(temps, (v) => v < thresholds.tempCold),
      comfortable: calculateProbability(temps, (v) => 
        v >= thresholds.tempCold && v <= thresholds.tempHot
      )
    },
    precipitation: {
      heavyRain: calculateProbability(precip, (v) => v >= thresholds.precipitation),
      lightRain: calculateProbability(precip, (v) => v > 0 && v < thresholds.precipitation),
      noPrecip: calculateProbability(precip, (v) => v === 0)
    },
    wind: {
      veryWindy: calculateProbability(wind, (v) => v >= thresholds.wind),
      moderate: calculateProbability(wind, (v) => v >= 10 && v < thresholds.wind),
      calm: calculateProbability(wind, (v) => v < 10)
    }
  }
}

/**
 * Calculate probability percentage
 */
function calculateProbability(values, condition) {
  const validValues = values.filter(v => v !== null && v !== undefined)
  if (validValues.length === 0) return 0
  
  const matching = validValues.filter(condition).length
  return Math.round((matching / validValues.length) * 100)
}

/**
 * Calculate average of values
 */
function calculateAverage(data) {
  const values = Object.values(data || {}).filter(v => v !== null && v !== undefined)
  if (values.length === 0) return 0
  
  const sum = values.reduce((acc, val) => acc + val, 0)
  return (sum / values.length).toFixed(2)
}

/**
 * Transform data to yearly format
 */
function transformToYearlyData(data, dates) {
  const yearlyData = {}
  
  dates.forEach(date => {
    const year = date.substring(0, 4)
    const value = data[date]
    
    if (value !== null && value !== undefined) {
      if (!yearlyData[year]) {
        yearlyData[year] = []
      }
      yearlyData[year].push(value)
    }
  })

  return Object.entries(yearlyData).map(([year, values]) => ({
    year: parseInt(year),
    value: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
  }))
}

/**
 * Count rainy days
 */
function countRainyDays(data) {
  return Object.values(data || {}).filter(v => v > 0).length
}

/**
 * Format date for NASA API (YYYYMMDD)
 */
export function formatDateForAPI(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Get date range for historical analysis
 */
export function getDateRange(eventDate, years) {
  const event = new Date(eventDate)
  const endYear = event.getFullYear() - 1 // Use last complete year
  const startYear = endYear - years + 1
  
  const month = String(event.getMonth() + 1).padStart(2, '0')
  const day = String(event.getDate()).padStart(2, '0')
  
  return {
    start: `${startYear}${month}${day}`,
    end: `${endYear}${month}${day}`
  }
}

/**
 * Example usage in App.jsx:
 * 
 * const handleAnalyze = async () => {
 *   if (!selectedLocation || !eventDate) return
 *   
 *   setLoading(true)
 *   
 *   try {
 *     const { start, end } = getDateRange(eventDate, dateRange)
 *     
 *     const nasaData = await fetchNASAPowerData(
 *       selectedLocation.lat,
 *       selectedLocation.lng,
 *       start,
 *       end
 *     )
 *     
 *     const transformedData = transformNASAData(nasaData, thresholds)
 *     setWeatherData(transformedData)
 *   } catch (error) {
 *     console.error('Error analyzing weather:', error)
 *     alert('Error fetching weather data. Please try again.')
 *   } finally {
 *     setLoading(false)
 *   }
 * }
 */

// Additional NASA Data Sources

/**
 * NASA Giovanni API - For climate analysis
 * https://giovanni.gsfc.nasa.gov/giovanni/
 */
export const NASA_GIOVANNI_INFO = {
  url: 'https://giovanni.gsfc.nasa.gov/giovanni/',
  description: 'Web interface for analyzing NASA Earth Science data',
  datasets: [
    'MERRA-2 (Modern-Era Retrospective analysis)',
    'GPM (Global Precipitation Measurement)',
    'MODIS (Moderate Resolution Imaging Spectroradiometer)'
  ]
}

/**
 * NASA Earthdata Search
 * https://search.earthdata.nasa.gov/
 */
export const NASA_EARTHDATA_INFO = {
  url: 'https://search.earthdata.nasa.gov/',
  description: 'Search and download Earth observation data',
  apiDocs: 'https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html'
}

/**
 * OpenWeatherMap API (Alternative for recent data)
 * https://openweathermap.org/api
 */
export async function fetchOpenWeatherData(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  
  const response = await fetch(url)
  return await response.json()
}
