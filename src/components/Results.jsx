import { CloudSun, TrendingUp } from 'lucide-react'
import SummaryCards from './SummaryCards'
import ChartsGrid from './ChartsGrid'
import ExportButtons from './ExportButtons'
import './Results.css'

function Results({ weatherData, parameters, eventDate, selectedLocation }) {
  if (!weatherData) {
    return (
      <div className="results-container">
        <div className="welcome-message">
          <div className="icon"><CloudSun size={72} /></div>
          <h3>Plan Your Perfect Day!</h3>
          <div className="welcome-steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>Pick a location</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Choose your date</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Click "Check Weather"</p>
            </div>
          </div>
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
          <span className="icon"><TrendingUp size={24} /></span>
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
