import { useState, useEffect } from 'react'
import { MapPin, Calendar, History, BarChart3, CloudSun, Target, Search } from 'lucide-react'
import { searchLocations } from '../utils/geocoding'
import './ControlPanel.css'

function ControlPanel({
  selectedLocation,
  setSelectedLocation,
  eventDate,
  setEventDate,
  dateRange,
  setDateRange,
  thresholds,
  setThresholds,
  temperatureUnit,
  setTemperatureUnit,
  onAnalyze
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const searchContainerRef = useState(null)[0]

  // Comprehensive location database
  const allLocations = [
    // USA - Major Cities
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060, country: 'USA' },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, country: 'USA' },
    { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, country: 'USA' },
    { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, country: 'USA' },
    { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, country: 'USA' },
    { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652, country: 'USA' },
    { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936, country: 'USA' },
    { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611, country: 'USA' },
    { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, country: 'USA' },
    { name: 'San Jose, CA', lat: 37.3382, lng: -121.8863, country: 'USA' },
    { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, country: 'USA' },
    { name: 'Jacksonville, FL', lat: 30.3322, lng: -81.6557, country: 'USA' },
    { name: 'Fort Worth, TX', lat: 32.7555, lng: -97.3308, country: 'USA' },
    { name: 'Columbus, OH', lat: 39.9612, lng: -82.9988, country: 'USA' },
    { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, country: 'USA' },
    { name: 'Charlotte, NC', lat: 35.2271, lng: -80.8431, country: 'USA' },
    { name: 'Indianapolis, IN', lat: 39.7684, lng: -86.1581, country: 'USA' },
    { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, country: 'USA' },
    { name: 'Denver, CO', lat: 39.7392, lng: -104.9903, country: 'USA' },
    { name: 'Boston, MA', lat: 42.3601, lng: -71.0589, country: 'USA' },
    { name: 'Portland, OR', lat: 45.5152, lng: -122.6784, country: 'USA' },
    { name: 'Las Vegas, NV', lat: 36.1699, lng: -115.1398, country: 'USA' },
    { name: 'Miami, FL', lat: 25.7617, lng: -80.1918, country: 'USA' },
    { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, country: 'USA' },
    { name: 'Nashville, TN', lat: 36.1627, lng: -86.7816, country: 'USA' },
    { name: 'Salt Lake City, UT', lat: 40.7608, lng: -111.8910, country: 'USA' },
    { name: 'Minneapolis, MN', lat: 44.9778, lng: -93.2650, country: 'USA' },
    { name: 'New Orleans, LA', lat: 29.9511, lng: -90.0715, country: 'USA' },
    { name: 'Tampa, FL', lat: 27.9506, lng: -82.4572, country: 'USA' },
    { name: 'Orlando, FL', lat: 28.5383, lng: -81.3792, country: 'USA' },
    
    // International - Major Cities
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'France' },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan' },
    { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'Germany' },
    { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, country: 'Spain' },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, country: 'Italy' },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' },
    { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, country: 'Australia' },
    { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada' },
    { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207, country: 'Canada' },
    { name: 'Montreal, Canada', lat: 45.5017, lng: -73.5673, country: 'Canada' },
    { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332, country: 'Mexico' },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, country: 'India' },
    { name: 'Delhi, India', lat: 28.7041, lng: 77.1025, country: 'India' },
    { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, country: 'India' },
    { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737, country: 'China' },
    { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, country: 'China' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, country: 'UAE' },
    { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, country: 'Thailand' },
    { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, country: 'Turkey' },
    { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
    { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734, country: 'Spain' },
    { name: 'Vienna, Austria', lat: 48.2082, lng: 16.3738, country: 'Austria' },
    { name: 'Prague, Czech Republic', lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
    { name: 'Budapest, Hungary', lat: 47.4979, lng: 19.0402, country: 'Hungary' },
    { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122, country: 'Poland' },
    { name: 'Athens, Greece', lat: 37.9838, lng: 23.7275, country: 'Greece' },
    { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393, country: 'Portugal' },
    { name: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683, country: 'Denmark' },
    { name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686, country: 'Sweden' },
    { name: 'Oslo, Norway', lat: 59.9139, lng: 10.7522, country: 'Norway' },
    { name: 'Helsinki, Finland', lat: 60.1699, lng: 24.9384, country: 'Finland' },
    { name: 'Dublin, Ireland', lat: 53.3498, lng: -6.2603, country: 'Ireland' },
    { name: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517, country: 'Belgium' },
    { name: 'Zurich, Switzerland', lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
    { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173, country: 'Russia' },
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
    { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
    { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, country: 'Argentina' },
    { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, country: 'Brazil' },
    { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
    { name: 'Lima, Peru', lat: -12.0464, lng: -77.0428, country: 'Peru' },
    { name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693, country: 'Chile' },
  ]

  const handleSearchChange = async (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    if (value.trim().length === 0) {
      setShowSuggestions(false)
      setFilteredLocations([])
      return
    }
    
    // First, show local database results instantly
    const localResults = allLocations.filter(loc =>
      loc.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5)
    
    setFilteredLocations(localResults)
    setShowSuggestions(true)
    
    // Then, search with API after a short delay (debounce)
    if (value.trim().length >= 3) {
      const timeout = setTimeout(async () => {
        setIsSearching(true)
        try {
          const apiResults = await searchLocations(value)
          if (apiResults && apiResults.length > 0) {
            // Combine local and API results, remove duplicates
            const combined = [...localResults, ...apiResults]
            const unique = combined.filter((loc, index, self) =>
              index === self.findIndex(l => 
                l.name.toLowerCase() === loc.name.toLowerCase()
              )
            ).slice(0, 10)
            
            setFilteredLocations(unique)
          }
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsSearching(false)
        }
      }, 500) // Wait 500ms after user stops typing
      
      setSearchTimeout(timeout)
    }
  }
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector('.search-container')
      if (searchContainer && !searchContainer.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  const selectLocation = (location) => {
    setSelectedLocation(location)
    setSearchQuery('')
    setShowSuggestions(false)
    setFilteredLocations([])
    setIsSearching(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    try {
      // Try API search first
      const results = await searchLocations(searchQuery)
      
      if (results && results.length > 0) {
        selectLocation(results[0])
        return
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
    
    // Fallback to local database
    const key = searchQuery.toLowerCase().trim()
    const location = allLocations.find(loc => 
      loc.name.toLowerCase().includes(key)
    )
    
    if (location) {
      selectLocation(location)
    } else {
      alert(`Location "${searchQuery}" not found. Start typing to see suggestions.`)
    }
    
    setIsSearching(false)
  }


  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }))
  }

  return (
    <div className="control-panel">
      <div className="control-panel-grid">
        {/* Location Section */}
        <div className="control-item">
          <label className="control-label">
            <span className="icon"><MapPin size={16} /></span> Location
            <span className="control-description">Where is your event happening?</span>
          </label>
          <div className="search-container">
            <input
              type="text"
              id="location-search"
              placeholder={selectedLocation ? selectedLocation.name : "Search city..."}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false)
                }
              }}
              onFocus={() => {
                if (searchQuery && filteredLocations.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              disabled={isSearching}
              className="compact-input"
            />
            {showSuggestions && filteredLocations.length > 0 && (
              <div 
                className="suggestions-dropdown"
                onMouseDown={(e) => e.preventDefault()}
              >
                {isSearching && filteredLocations.length === 0 && (
                  <div className="suggestion-item searching">
                    <span className="suggestion-name"><Search size={14} /> Searching...</span>
                  </div>
                )}
                {filteredLocations.map((loc, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      selectLocation(loc)
                    }}
                  >
                    <span className="suggestion-name">{loc.name}</span>
                    {loc.country && (
                      <span className="suggestion-country">{loc.country}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Section */}
        <div className="control-item">
          <label className="control-label">
            <span className="icon"><Calendar size={16} /></span> Event Date
            <span className="control-description">When is your event?</span>
          </label>
          <input
            type="date"
            id="event-date"
            className="compact-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        {/* Years Section */}
        <div className="control-item">
          <label className="control-label">
            <span className="icon"><History size={16} /></span> History
            <span className="control-description">How many years of data to analyze?</span>
          </label>
          <select
            id="date-range"
            className="compact-input"
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
          >
            <option value="5">5 years</option>
            <option value="10">10 years</option>
            <option value="20">20 years</option>
            <option value="30">30 years</option>
          </select>
        </div>

        {/* Temperature Unit Section */}
        <div className="control-item">
          <label className="control-label">
            <span className="icon"><CloudSun size={16} /></span> Temperature Unit
            <span className="control-description">Choose your preferred temperature scale</span>
          </label>
          <div className="temp-unit-toggle">
            <div className="toggle-buttons">
              <button
                type="button"
                className={`unit-btn ${temperatureUnit === 'F' ? 'active' : ''}`}
                onClick={() => setTemperatureUnit('F')}
              >
                °F
              </button>
              <button
                type="button"
                className={`unit-btn ${temperatureUnit === 'C' ? 'active' : ''}`}
                onClick={() => setTemperatureUnit('C')}
              >
                °C
              </button>
            </div>
          </div>
        </div>

        {/* Comfort Limits Section */}
        <div className="control-item comfort-limits">
          <label className="control-label">
            <span className="icon"><Target size={16} /></span> 🎯 Your Comfort Limits
            <span className="control-description">Set your personal weather comfort thresholds</span>
          </label>
          <div className="thresholds-grid">
            <div className="threshold-item">
              <label className="threshold-label">
                Hot ({temperatureUnit === 'C' ? '°C' : '°F'})
                <span className="threshold-help">Too hot to be comfortable</span>
              </label>
              <input
                type="number"
                value={thresholds.tempHot}
                onChange={(e) => handleThresholdChange('tempHot', e.target.value)}
                className="compact-input-sm"
                placeholder={temperatureUnit === 'C' ? '30' : '86'}
              />
            </div>
            <div className="threshold-item">
              <label className="threshold-label">
                Cold ({temperatureUnit === 'C' ? '°C' : '°F'})
                <span className="threshold-help">Too cold to be comfortable</span>
              </label>
              <input
                type="number"
                value={thresholds.tempCold}
                onChange={(e) => handleThresholdChange('tempCold', e.target.value)}
                className="compact-input-sm"
                placeholder={temperatureUnit === 'C' ? '5' : '41'}
              />
            </div>
            <div className="threshold-item">
              <label className="threshold-label">
                Rain (inches)
                <span className="threshold-help">Heavy rain that disrupts plans</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={thresholds.precipitation}
                onChange={(e) => handleThresholdChange('precipitation', e.target.value)}
                className="compact-input-sm"
                placeholder="0.5"
              />
            </div>
            <div className="threshold-item">
              <label className="threshold-label">
                Wind (mph)
                <span className="threshold-help">Strong winds that are bothersome</span>
              </label>
              <input
                type="number"
                value={thresholds.wind}
                onChange={(e) => handleThresholdChange('wind', e.target.value)}
                className="compact-input-sm"
                placeholder="15"
              />
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="control-item">
          <button className="btn btn-analyze-compact" onClick={onAnalyze}>
            <BarChart3 size={18} /> Analyze Weather
          </button>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
