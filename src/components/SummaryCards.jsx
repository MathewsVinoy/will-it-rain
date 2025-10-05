import { Flame, Snowflake, Droplets, Wind, Frown } from 'lucide-react'
import './SummaryCards.css'

function SummaryCards({ summary }) {
  const cards = [
    {
      key: 'veryHot',
      label: 'Very Hot',
      icon: <Flame size={48} />,
      description: 'Above threshold',
      className: 'hot'
    },
    {
      key: 'veryCold',
      label: 'Very Cold',
      icon: <Snowflake size={48} />,
      description: 'Below threshold',
      className: 'cold'
    },
    {
      key: 'veryWet',
      label: 'Very Wet',
      icon: <Droplets size={48} />,
      description: 'Heavy precipitation',
      className: 'wet'
    },
    {
      key: 'veryWindy',
      label: 'Very Windy',
      icon: <Wind size={48} />,
      description: 'High wind speeds',
      className: 'windy'
    },
    {
      key: 'uncomfortable',
      label: 'Uncomfortable',
      icon: <Frown size={48} />,
      description: 'Combined factors',
      className: 'uncomfortable'
    }
  ]

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.key} className={`summary-card ${card.className}`}>
          <div className="icon">{card.icon}</div>
          <div className="label">{card.label}</div>
          <div className="value">{summary[card.key]}%</div>
          <div className="description">{card.description}</div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
