import { Flame, Snowflake, Droplets, Wind, Frown } from 'lucide-react'
import './SummaryCards.css'

function SummaryCards({ summary }) {
  const cards = [
    {
      key: 'veryHot',
      label: 'Very Hot',
      icon: <Flame size={48} />,
      description: 'Chance of extreme heat',
      tooltip: 'Temperature above your hot threshold',
      className: 'hot'
    },
    {
      key: 'veryCold',
      label: 'Very Cold',
      icon: <Snowflake size={48} />,
      description: 'Chance of freezing temps',
      tooltip: 'Temperature below your cold threshold',
      className: 'cold'
    },
    {
      key: 'veryWet',
      label: 'Very Wet',
      icon: <Droplets size={48} />,
      description: 'Chance of heavy rain',
      tooltip: 'Precipitation above your threshold',
      className: 'wet'
    },
    {
      key: 'veryWindy',
      label: 'Very Windy',
      icon: <Wind size={48} />,
      description: 'Chance of strong winds',
      tooltip: 'Wind speed above your threshold',
      className: 'windy'
    },
    {
      key: 'uncomfortable',
      label: 'Uncomfortable',
      icon: <Frown size={48} />,
      description: 'Overall discomfort risk',
      tooltip: 'Combined weather factors',
      className: 'uncomfortable'
    }
  ]

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.key} className={`summary-card ${card.className}`} title={card.tooltip}>
          <div className="icon">{card.icon}</div>
          <div className="label">{card.label}</div>
          <div className="value">{summary[card.key]}%</div>
          <div className="description">{card.description}</div>
          <div className="interpretation">
            {summary[card.key] >= 70 && <span className="risk-high">⚠️ High Risk</span>}
            {summary[card.key] >= 40 && summary[card.key] < 70 && <span className="risk-medium">⚡ Moderate Risk</span>}
            {summary[card.key] < 40 && <span className="risk-low">✓ Low Risk</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
