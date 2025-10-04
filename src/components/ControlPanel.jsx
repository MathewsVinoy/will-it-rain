import { useState } from 'react'
import './ControlPanel.css'

function ControlPanel({
  selectedLocation,
  setSelectedLocation,
  eventDate,
  setEventDate,
  dateRange,
  setDateRange,
  parameters,
  setParameters,
  thresholds,
  setThresholds,
  onAnalyze
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    // In production, use geocoding API (Nominatim, Google, etc.)
    // For demo, simulate location search
    const mockLocations = {
      'seattle': { lat: 47.6062, lng: -122.3321, name: 'Seattle, WA' },
      'miami': { lat: 25.7617, lng: -80.1918, name: 'Miami, FL' },
      'denver': { lat: 39.7392, lng: -104.9903, name: 'Denver, CO' },
      'boston': { lat: 42.3601, lng: -71.0589, name: 'Boston, MA' },
      'phoenix': { lat: 33.4484, lng: -112.0740, name: 'Phoenix, AZ' }
    }
    
    const key = searchQuery.toLowerCase()
    const location = mockLocations[key] || {
      lat: 40.7128,
      lng: -74.0060,
      name: searchQuery
    }
    
    setSelectedLocation(location)
  }

  const handleParameterChange = (param) => {
    setParameters(prev => ({
      ...prev,
      [param]: !prev[param]
    }))
  }

  const handleThresholdChange = (key, value) => {
    setThresholds(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }))
  }

  return (
    <aside className="control-panel">
      {/* Location Section */}
      <div className="panel-section">
        <h2>
          <span className="icon">📍</span>
          Location
        </h2>
        <div className="input-group">
          <label htmlFor="location-search">Search Location</label>
          <div className="search-container">
            <input
              type="text"
              id="location-search"
              placeholder="Enter city (e.g., Seattle, Miami, Denver)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              🔍
            </button>
          </div>
          <p className="help-text">Or click on the map to select a location</p>
        </div>
        <div className="location-display">
          <p>
            <strong>Selected:</strong>{' '}
            <span>{selectedLocation ? selectedLocation.name : 'No location selected'}</span>
          </p>
          <p>
            <strong>Coordinates:</strong>{' '}
            <span>
              {selectedLocation
                ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                : '-'}
            </span>
          </p>
        </div>
      </div>

      {/* Date & Time Section */}
      <div className="panel-section">
        <h2>
          <span className="icon">📅</span>
          Date & Time
        </h2>
        <div className="input-group">
          <label htmlFor="event-date">Event Date</label>
          <input
            type="date"
            id="event-date"
            className="date-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="date-range">Historical Range (Years)</label>
          <select
            id="date-range"
            className="select-input"
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
          >
            <option value="5">Last 5 years</option>
            <option value="10">Last 10 years</option>
            <option value="20">Last 20 years</option>
            <option value="30">Last 30 years</option>
          </select>
        </div>
      </div>

      {/* Weather Parameters Section */}
      <div className="panel-section">
        <h2>
          <span className="icon">🎚️</span>
          Weather Parameters
        </h2>
        <div className="parameters-grid">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={parameters.temperature}
              onChange={() => handleParameterChange('temperature')}
            />
            <span>🌡️ Temperature</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={parameters.precipitation}
              onChange={() => handleParameterChange('precipitation')}
            />
            <span>🌧️ Precipitation</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={parameters.wind}
              onChange={() => handleParameterChange('wind')}
            />
            <span>💨 Wind Speed</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={parameters.humidity}
              onChange={() => handleParameterChange('humidity')}
            />
            <span>💧 Humidity</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={parameters.cloudCover}
              onChange={() => handleParameterChange('cloudCover')}
            />
            <span>☁️ Cloud Cover</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={parameters.airQuality}
              onChange={() => handleParameterChange('airQuality')}
            />
            <span>🏭 Air Quality</span>
          </label>
        </div>
      </div>

      {/* Thresholds Section */}
      <div className="panel-section">
        <h2>
          <span className="icon">⚠️</span>
          Thresholds
        </h2>
        <div className="threshold-group">
          <label>Temperature (°F)</label>
          <div className="threshold-inputs">
            <input
              type="number"
              placeholder="Very Hot"
              value={thresholds.tempHot}
              onChange={(e) => handleThresholdChange('tempHot', e.target.value)}
            />
            <input
              type="number"
              placeholder="Very Cold"
              value={thresholds.tempCold}
              onChange={(e) => handleThresholdChange('tempCold', e.target.value)}
            />
          </div>
        </div>
        <div className="threshold-group">
          <label>Precipitation (inches)</label>
          <input
            type="number"
            step="0.1"
            placeholder="Heavy Rain"
            value={thresholds.precipitation}
            onChange={(e) => handleThresholdChange('precipitation', e.target.value)}
          />
        </div>
        <div className="threshold-group">
          <label>Wind Speed (mph)</label>
          <input
            type="number"
            placeholder="Very Windy"
            value={thresholds.wind}
            onChange={(e) => handleThresholdChange('wind', e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-analyze" onClick={onAnalyze}>
        <span>📊</span>
        Analyze Weather
      </button>
    </aside>
  )
}

export default ControlPanel
