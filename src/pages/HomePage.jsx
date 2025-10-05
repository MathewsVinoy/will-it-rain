import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ControlPanel from '../components/ControlPanel'
import MapView from '../components/MapView'
import LoadingOverlay from '../components/LoadingOverlay'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [eventDate, setEventDate] = useState('')
  const [dateRange, setDateRange] = useState(10)
  const [parameters, setParameters] = useState({
    temperature: true,
    precipitation: true,
    wind: true,
    humidity: false,
    cloudCover: false,
    airQuality: false
  })
  const [thresholds, setThresholds] = useState({
    tempHot: 90,
    tempCold: 32,
    precipitation: 0.5,
    wind: 20
  })
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!selectedLocation || !eventDate) {
      alert('Please select a location and date first!')
      return
    }

    setLoading(true)
    
    // Simulate API call - in production, this would fetch from NASA APIs
    setTimeout(() => {
      const mockData = generateMockWeatherData(
        selectedLocation,
        eventDate,
        dateRange,
        parameters,
        thresholds
      )
      
      // Navigate to results page with data
      navigate('/results', { 
        state: { 
          weatherData: mockData,
          selectedLocation,
          eventDate,
          parameters
        } 
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="home-page">
      <Header />
      <main className="home-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Plan Your Perfect Day</h1>
            <p className="hero-subtitle">
              Analyze historical weather patterns to make informed decisions about your outdoor events
            </p>
          </div>
        </div>
        
        <div className="control-section">
          <ControlPanel
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            eventDate={eventDate}
            setEventDate={setEventDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            parameters={parameters}
            setParameters={setParameters}
            thresholds={thresholds}
            setThresholds={setThresholds}
            onAnalyze={handleAnalyze}
          />
        </div>

        <div className="map-section-home">
          <MapView 
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      </main>
      {loading && <LoadingOverlay />}
    </div>
  )
}

// Mock data generator function (same as before)
function generateMockWeatherData(location, date, years, params, thresholds) {
  const dateObj = new Date(date)
  const month = dateObj.getMonth()
  
  const baseTempHot = Math.max(0, Math.min(100, 30 + month * 5 + Math.random() * 20))
  const baseTempCold = Math.max(0, Math.min(100, 70 - month * 5 + Math.random() * 20))
  const basePrecip = Math.max(0, Math.min(100, 20 + Math.random() * 30))
  const baseWind = Math.max(0, Math.min(100, 15 + Math.random() * 25))
  
  return {
    location: location,
    date: date,
    dateRange: years,
    summary: {
      veryHot: Math.round(baseTempHot),
      veryCold: Math.round(baseTempCold),
      veryWet: Math.round(basePrecip),
      veryWindy: Math.round(baseWind),
      uncomfortable: Math.round((baseTempHot + basePrecip) / 2)
    },
    temperature: {
      historical: generateHistoricalData(years, 'temperature', month),
      probabilities: {
        aboveThreshold: baseTempHot,
        belowThreshold: baseTempCold,
        comfortable: 100 - baseTempHot - baseTempCold
      },
      averages: {
        high: 75 + month * 2,
        low: 55 + month * 1.5,
        mean: 65 + month * 1.8
      }
    },
    precipitation: {
      historical: generateHistoricalData(years, 'precipitation', month),
      probabilities: {
        heavyRain: basePrecip,
        lightRain: 30,
        noPrecip: 100 - basePrecip - 30
      },
      averages: {
        amount: (0.1 + Math.random() * 0.5).toFixed(2),
        rainyDays: Math.floor(5 + Math.random() * 10)
      }
    },
    wind: {
      historical: generateHistoricalData(years, 'wind', month),
      probabilities: {
        veryWindy: baseWind,
        moderate: 50,
        calm: 100 - baseWind - 50
      },
      averages: {
        speed: (8 + Math.random() * 10).toFixed(1),
        maxGust: (15 + Math.random() * 20).toFixed(1)
      }
    },
    trends: {
      temperatureIncrease: (0.5 + Math.random() * 1.5).toFixed(2),
      precipitationChange: (Math.random() * 2 - 1).toFixed(2),
      extremeEventIncrease: (5 + Math.random() * 15).toFixed(1)
    }
  }
}

function generateHistoricalData(years, type, month) {
  const data = []
  const currentYear = new Date().getFullYear()
  
  for (let i = years; i > 0; i--) {
    const year = currentYear - i
    let value
    
    switch (type) {
      case 'temperature':
        value = 65 + month * 2 + (Math.random() - 0.5) * 20
        break
      case 'precipitation':
        value = Math.random() * 2
        break
      case 'wind':
        value = 5 + Math.random() * 20
        break
      default:
        value = Math.random() * 100
    }
    
    data.push({ year, value: parseFloat(value.toFixed(2)) })
  }
  
  return data
}

export default HomePage
