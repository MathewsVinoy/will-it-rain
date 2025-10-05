/**
 * Geocoding API utilities
 * Uses multiple free geocoding services with fallbacks
 */

// OpenCage Geocoder API (Free tier: 2,500 requests/day)
// Sign up at: https://opencagedata.com/
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY || ''

// Nominatim OpenStreetMap (Free, no key needed but rate limited)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

// Photon API (Free, no key needed)
const PHOTON_URL = 'https://photon.komoot.io/api/'

/**
 * Search for locations using OpenCage Geocoder
 */
async function searchWithOpenCage(query) {
  if (!OPENCAGE_API_KEY) {
    throw new Error('OpenCage API key not configured')
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&limit=10&no_annotations=1`
  
  const response = await fetch(url)
  if (!response.ok) throw new Error('OpenCage API error')
  
  const data = await response.json()
  
  return data.results.map(result => ({
    name: result.formatted,
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    country: result.components.country || '',
    city: result.components.city || result.components.town || result.components.village || ''
  }))
}

/**
 * Search for locations using Nominatim (OpenStreetMap)
 */
async function searchWithNominatim(query) {
  const url = `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'WillItRain/1.0' // Nominatim requires a user agent
    }
  })
  
  if (!response.ok) throw new Error('Nominatim API error')
  
  const data = await response.json()
  
  return data.map(result => {
    const address = result.address || {}
    const cityName = address.city || address.town || address.village || address.county || ''
    const stateName = address.state || ''
    const countryName = address.country || ''
    
    let displayName = cityName
    if (stateName && countryName === 'United States') {
      // For US cities, show "City, State"
      const stateAbbr = getStateAbbreviation(stateName)
      displayName = `${cityName}, ${stateAbbr}`
    } else if (cityName && countryName) {
      // For international, show "City, Country"
      displayName = `${cityName}, ${countryName}`
    } else {
      // Fallback to first part of display_name
      displayName = result.display_name.split(',').slice(0, 2).join(',')
    }
    
    return {
      name: displayName,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      country: countryName,
      city: cityName
    }
  })
}

/**
 * Search for locations using Photon (Komoot)
 */
async function searchWithPhoton(query) {
  const url = `${PHOTON_URL}?q=${encodeURIComponent(query)}&limit=10`
  
  const response = await fetch(url)
  if (!response.ok) throw new Error('Photon API error')
  
  const data = await response.json()
  
  return data.features.map(feature => {
    const props = feature.properties
    const coords = feature.geometry.coordinates
    
    const cityName = props.city || props.name || ''
    const stateName = props.state || ''
    const countryName = props.country || ''
    
    let displayName = cityName
    if (stateName && countryName === 'United States') {
      const stateAbbr = getStateAbbreviation(stateName)
      displayName = `${cityName}, ${stateAbbr}`
    } else if (cityName && countryName) {
      displayName = `${cityName}, ${countryName}`
    }
    
    return {
      name: displayName,
      lat: coords[1],
      lng: coords[0],
      country: countryName,
      city: cityName
    }
  })
}

/**
 * Main geocoding function with fallbacks
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) {
    return []
  }

  // Try APIs in order with fallbacks
  const apis = [
    { name: 'OpenCage', fn: searchWithOpenCage, enabled: !!OPENCAGE_API_KEY },
    { name: 'Nominatim', fn: searchWithNominatim, enabled: true },
    { name: 'Photon', fn: searchWithPhoton, enabled: true }
  ]

  for (const api of apis) {
    if (!api.enabled) continue
    
    try {
      console.log(`Trying ${api.name} API...`)
      const results = await api.fn(query)
      if (results && results.length > 0) {
        console.log(`✓ ${api.name} returned ${results.length} results`)
        return results
      }
    } catch (error) {
      console.warn(`${api.name} failed:`, error.message)
      continue
    }
  }

  return []
}

/**
 * Get state abbreviation from full name
 */
function getStateAbbreviation(stateName) {
  const states = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY'
  }
  
  return states[stateName] || stateName
}

/**
 * Reverse geocoding - get location name from coordinates
 */
export async function reverseGeocode(lat, lng) {
  try {
    const url = `${NOMINATIM_URL}?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WillItRain/1.0'
      }
    })
    
    if (!response.ok) throw new Error('Reverse geocoding failed')
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const result = data[0]
      const address = result.address || {}
      const cityName = address.city || address.town || address.village || ''
      const stateName = address.state || ''
      const countryName = address.country || ''
      
      let displayName = cityName
      if (stateName && countryName === 'United States') {
        const stateAbbr = getStateAbbreviation(stateName)
        displayName = `${cityName}, ${stateAbbr}`
      } else if (cityName && countryName) {
        displayName = `${cityName}, ${countryName}`
      } else {
        displayName = result.display_name.split(',').slice(0, 2).join(',')
      }
      
      return displayName
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
  }
  
  return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
}
