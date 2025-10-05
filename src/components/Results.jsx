import { CloudSun, TrendingUp, Info, BookOpen, Lightbulb } from 'lucide-react'
import SummaryCards from './SummaryCards'
import ChartsGrid from './ChartsGrid'
import ExportButtons from './ExportButtons'
import './Results.css'

function Results({ weatherData, parameters, eventDate, selectedLocation, temperatureUnit = 'F' }) {
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

      {/* Introduction Section */}
      <div className="info-section intro-section">
        <div className="info-header">
          <span className="info-icon"><BookOpen size={24} /></span>
          <h3>Understanding Your Weather Report</h3>
        </div>
        <p className="info-text">
          This analysis shows the probability of different weather conditions based on <strong>{weatherData.dateRange} years</strong> of historical data 
          for the same date and location. The percentages below represent how often specific weather conditions occurred in the past.
        </p>
      </div>

      {/* Probability Cards Section */}
      <div className="section-with-description">
        <div className="section-description">
          <span className="section-icon"><Info size={20} /></span>
          <div>
            <h4>What Do These Numbers Mean?</h4>
            <p>Each percentage shows the likelihood of experiencing that weather condition. For example, 
            <strong> 30% "Very Hot"</strong> means that on this date in the past, it was extremely hot about 3 out of every 10 years.</p>
          </div>
        </div>
        <SummaryCards summary={weatherData.summary} />
      </div>
      
      {/* Climate Trends Alert */}
      <div className="trends-alert">
        <div className="alert alert-info">
          <span className="icon"><TrendingUp size={24} /></span>
          <div>
            <strong>Climate Trends:</strong> Temperature has increased by{' '}
            <strong>{weatherData.trends.temperatureIncrease}{temperatureUnit === 'C' ? '°C' : '°F'}</strong> over the past{' '}
            {weatherData.dateRange} years. Extreme weather events have increased by{' '}
            <strong>{weatherData.trends.extremeEventIncrease}%</strong>.
          </div>
        </div>
      </div>

      {/* Charts Introduction */}
      <div className="info-section charts-intro">
        <div className="info-header">
          <span className="info-icon"><Lightbulb size={24} /></span>
          <h3>Detailed Historical Analysis</h3>
        </div>
        <div className="chart-guides">
          <div className="guide-item">
            <strong>📈 Trend Charts</strong>
            <p>Show how weather patterns have changed year by year. An upward trend means conditions are getting more extreme.</p>
          </div>
          <div className="guide-item">
            <strong>📊 Probability Charts</strong>
            <p>Break down the chances of different conditions. Higher bars mean that condition is more likely to occur.</p>
          </div>
          <div className="guide-item">
            <strong>💡 Planning Tip</strong>
            <p>If a probability is above 50%, plan for that condition. Below 30% is relatively unlikely but still possible.</p>
          </div>
        </div>
      </div>

      <ChartsGrid 
        weatherData={weatherData}
        parameters={parameters}
        temperatureUnit={temperatureUnit}
      />

      {/* Bottom Help Section */}
      <div className="info-section help-section">
        <div className="info-header">
          <span className="info-icon"><Info size={24} /></span>
          <h3>How to Use This Information</h3>
        </div>
        <div className="help-grid">
          <div className="help-item">
            <div className="help-number">1</div>
            <div className="help-content">
              <strong>Check the Summary Cards</strong>
              <p>Look at the percentages to understand the overall risk of extreme conditions.</p>
            </div>
          </div>
          <div className="help-item">
            <div className="help-number">2</div>
            <div className="help-content">
              <strong>Review the Trends</strong>
              <p>See if weather conditions are becoming more or less predictable over time.</p>
            </div>
          </div>
          <div className="help-item">
            <div className="help-number">3</div>
            <div className="help-content">
              <strong>Plan Accordingly</strong>
              <p>Use high probabilities to prepare backup plans or adjust your event timing.</p>
            </div>
          </div>
          <div className="help-item">
            <div className="help-number">4</div>
            <div className="help-content">
              <strong>Remember</strong>
              <p>Weather is unpredictable! These are probabilities based on history, not guarantees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
