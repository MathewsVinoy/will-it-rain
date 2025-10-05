import { CheckCircle, AlertTriangle, XCircle, Lightbulb, MapPin, Calendar, Clock } from 'lucide-react'
import './ComfortScore.css'

function ComfortScore({ weatherData, temperatureUnit = 'F' }) {
  // Calculate overall comfort score (0-100)
  const calculateComfortScore = () => {
    const { summary } = weatherData
    const hotRisk = summary.veryHot || 0
    const coldRisk = summary.veryCold || 0
    const rainRisk = summary.veryWet || 0
    const windRisk = summary.veryWindy || 0
    
    // Higher percentages = lower comfort score
    const discomfortScore = (hotRisk + coldRisk + rainRisk + windRisk) / 4
    return Math.max(0, 100 - discomfortScore)
  }

  const comfortScore = calculateComfortScore()
  
  // Get comfort level and color
  const getComfortLevel = (score) => {
    if (score >= 80) return { level: 'Event-Friendly', color: 'green', icon: '✅' }
    if (score >= 60) return { level: 'Mostly Good', color: 'yellow', icon: '🟡' }
    if (score >= 40) return { level: 'Risky', color: 'orange', icon: '⚠️' }
    return { level: 'Not Ideal', color: 'red', icon: '🔴' }
  }

  const comfortLevel = getComfortLevel(comfortScore)

  // Generate advice based on weather conditions
  const generateAdvice = () => {
    const { summary } = weatherData
    const advice = []

    if (summary.veryHot > 70) {
      advice.push({
        icon: '🌤️',
        text: 'Try a morning event instead',
        type: 'time'
      })
    }

    if (summary.veryWet > 50) {
      advice.push({
        icon: '📍',
        text: 'Best to reschedule or pick an indoor venue',
        type: 'location'
      })
    }

    if (summary.veryWindy > 60) {
      advice.push({
        icon: '🏠',
        text: 'Consider indoor backup plans',
        type: 'backup'
      })
    }

    if (summary.veryCold > 60) {
      advice.push({
        icon: '📅',
        text: 'Consider another date with lower cold risk',
        type: 'date'
      })
    }

    if (advice.length === 0) {
      advice.push({
        icon: '✅',
        text: "You're good to go — low weather risk based on history!",
        type: 'safe'
      })
    }

    return advice
  }

  const adviceItems = generateAdvice()

  return (
    <div className="comfort-score-container">
      {/* Main Comfort Score */}
      <div className="comfort-score-card">
        <div className="comfort-score-header">
          <h3>🎯 Comfort Score</h3>
          <div className={`comfort-score-value ${comfortLevel.color}`}>
            {Math.round(comfortScore)}/100
          </div>
        </div>
        <div className={`comfort-level ${comfortLevel.color}`}>
          {comfortLevel.icon} {comfortLevel.level}
        </div>
        <div className="comfort-description">
          Based on heat, rain, wind, and combined factors from {weatherData.dateRange} years of data
        </div>
      </div>

      {/* Advice Section */}
      <div className="advice-section">
        <div className="advice-header">
          <Lightbulb size={20} />
          <h4>Recommendation:</h4>
        </div>
        <div className="advice-items">
          {adviceItems.map((item, index) => (
            <div key={index} className={`advice-item ${item.type}`}>
              <span className="advice-icon">{item.icon}</span>
              <span className="advice-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safe vs Risky Days Pie Chart */}
      <div className="safety-overview">
        <h4>📊 Safe vs Risky Days</h4>
        <div className="safety-stats">
          <div className="safety-item safe">
            <div className="safety-icon">✅</div>
            <div className="safety-label">Comfortable</div>
            <div className="safety-percentage">{100 - Math.round(comfortScore)}%</div>
          </div>
          <div className="safety-item risky">
            <div className="safety-icon">⚠️</div>
            <div className="safety-label">Partially Risky</div>
            <div className="safety-percentage">{Math.round(comfortScore/2)}%</div>
          </div>
          <div className="safety-item bad">
            <div className="safety-icon">❌</div>
            <div className="safety-label">Bad Weather</div>
            <div className="safety-percentage">{Math.round(comfortScore/4)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComfortScore
