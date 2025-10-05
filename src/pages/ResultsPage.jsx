import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Results from '../components/Results'
import ChartsGrid from '../components/ChartsGrid'
import './ResultsPage.css'

function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { weatherData, selectedLocation, eventDate, parameters, temperatureUnit = 'F' } = location.state || {}

  // Redirect to home if no data
  if (!weatherData) {
    navigate('/')
    return null
  }

  return (
    <div className="results-page">
      <Header />
      
      <div className="results-navigation">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          <span>Back to Search</span>
        </button>
      </div>

      <main className="results-main">
        <div className="results-container-page">
          <Results 
            weatherData={weatherData}
            parameters={parameters}
            eventDate={eventDate}
            selectedLocation={selectedLocation}
            temperatureUnit={temperatureUnit}
          />
        </div>
      </main>
    </div>
  )
}

export default ResultsPage
