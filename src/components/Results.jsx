import SummaryCards from './SummaryCards'
import ChartsGrid from './ChartsGrid'
import ExportButtons from './ExportButtons'
import './Results.css'

function Results({ weatherData, parameters, eventDate, selectedLocation }) {
  if (!weatherData) {
    return (
      <div className="results-container">
        <div className="welcome-message">
          <div className="icon">ℹ️</div>
          <h3>Welcome to Will It Rain?</h3>
          <p>
            Select a location on the map or search for a place, choose your event date,
            and click "Analyze Weather" to see historical weather patterns and probabilities.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <div>
          <h2>Weather Analysis Results</h2>
          <p className="results-info">
            <strong>{selectedLocation?.name}</strong> • {new Date(eventDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <ExportButtons weatherData={weatherData} />
      </div>

      <SummaryCards summary={weatherData.summary} />
      
      <div className="trends-alert">
        <div className="alert alert-info">
          <span className="icon">📈</span>
          <div>
            <strong>Climate Trends:</strong> Temperature has increased by{' '}
            <strong>{weatherData.trends.temperatureIncrease}°F</strong> over the past{' '}
            {weatherData.dateRange} years. Extreme weather events have increased by{' '}
            <strong>{weatherData.trends.extremeEventIncrease}%</strong>.
          </div>
        </div>
      </div>

      <ChartsGrid 
        weatherData={weatherData}
        parameters={parameters}
      />
    </div>
  )
}

export default Results
