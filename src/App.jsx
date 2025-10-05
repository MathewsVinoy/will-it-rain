import { useState } from 'react'
import Header from './components/Header'
import ControlPanel from './components/ControlPanel'
import Dashboard from './components/Dashboard'
import LoadingOverlay from './components/LoadingOverlay'
import './App.css'

function App() {
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
  const [weatherData, setWeatherData] = useState(null)
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
      setWeatherData(mockData)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="control-bar">
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
        <Dashboard
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          weatherData={weatherData}
          parameters={parameters}
          eventDate={eventDate}
        />
      </main>
      {loading && <LoadingOverlay />}
    </div>
  )
}

// Mock data generator for demonstration
function generateMockWeatherData(location, date, years, params, thresholds) {
  const dateObj = new Date(date)
  const month = dateObj.getMonth()
  const day = dateObj.getDate()
  
  // Generate realistic probabilities based on location and time
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

export default App
