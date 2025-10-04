import './SummaryCards.css'

function SummaryCards({ summary }) {
  const cards = [
    {
      key: 'veryHot',
      label: 'Very Hot',
      icon: '🔥',
      description: 'Above threshold',
      className: 'hot'
    },
    {
      key: 'veryCold',
      label: 'Very Cold',
      icon: '❄️',
      description: 'Below threshold',
      className: 'cold'
    },
    {
      key: 'veryWet',
      label: 'Very Wet',
      icon: '💧',
      description: 'Heavy precipitation',
      className: 'wet'
    },
    {
      key: 'veryWindy',
      label: 'Very Windy',
      icon: '💨',
      description: 'High wind speeds',
      className: 'windy'
    },
    {
      key: 'uncomfortable',
      label: 'Uncomfortable',
      icon: '😰',
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
