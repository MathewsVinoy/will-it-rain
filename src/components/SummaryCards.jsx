import { Flame, Snowflake, Droplets, Wind, Frown, Thermometer, CloudRain, WindIcon, AlertTriangle, CheckCircle } from 'lucide-react'
import './SummaryCards.css'

function SummaryCards({ summary }) {
  // Helper function to get human-friendly description
  const getHumanDescription = (key, percentage) => {
    const descriptions = {
      veryHot: `${Math.round(percentage/10)} out of 10 times, it was hotter than most people prefer`,
      veryCold: `${Math.round(percentage/10)} out of 10 times, it was colder than most people prefer`,
      veryWet: `${Math.round(percentage/10)} out of 10 times, there was enough rain to disrupt plans`,
      veryWindy: `${Math.round(percentage/10)} out of 10 times, winds were strong enough to be bothersome`,
      uncomfortable: `${Math.round(percentage/10)} out of 10 times, the overall weather was uncomfortable`
    }
    return descriptions[key] || 'Weather condition risk'
  }

  // Helper function to get color-coded risk level
  const getRiskLevel = (percentage) => {
    if (percentage >= 70) return { level: 'High Risk', color: 'red', icon: '🔴' }
    if (percentage >= 40) return { level: 'Caution', color: 'yellow', icon: '🟡' }
    return { level: 'Safe', color: 'green', icon: '✅' }
  }

  const cards = [
    {
      key: 'veryHot',
      label: '🥵 Too Hot to Be Outside',
      icon: <Thermometer size={48} />,
      description: 'Heat Risk',
      tooltip: 'Temperature above your comfort zone',
      className: 'hot'
    },
    {
      key: 'veryCold',
      label: '🥶 Too Cold to Enjoy',
      icon: <Snowflake size={48} />,
      description: 'Cold Risk',
      tooltip: 'Temperature below your comfort zone',
      className: 'cold'
    },
    {
      key: 'veryWet',
      label: '🌧️ Rain Likely',
      icon: <CloudRain size={48} />,
      description: 'Rain Risk',
      tooltip: 'Heavy precipitation expected',
      className: 'wet'
    },
    {
      key: 'veryWindy',
      label: '🌀 Strong Winds',
      icon: <WindIcon size={48} />,
      description: 'Wind Risk',
      tooltip: 'Wind speed above your threshold',
      className: 'windy'
    },
    {
      key: 'uncomfortable',
      label: '😓 Overall Comfort Risk',
      icon: <AlertTriangle size={48} />,
      description: 'Comfort Score',
      tooltip: 'Combined weather comfort factors',
      className: 'uncomfortable'
    }
  ]

  return (
    <div className="summary-cards">
      {cards.map(card => {
        const percentage = summary[card.key]
        const riskLevel = getRiskLevel(percentage)
        const humanDescription = getHumanDescription(card.key, percentage)
        
        return (
          <div key={card.key} className={`summary-card ${card.className}`} title={card.tooltip}>
            <div className="icon">{card.icon}</div>
            <div className="label">{card.label}</div>
            <div className="value">{percentage}%</div>
            <div className="description">{card.description}</div>
            <div className="human-description">{humanDescription}</div>
            <div className="interpretation">
              <span className={`risk-${riskLevel.color}`}>
                {riskLevel.icon} {riskLevel.level}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards
