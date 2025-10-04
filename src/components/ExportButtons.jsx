import './ExportButtons.css'

function ExportButtons({ weatherData }) {
  const exportToCSV = () => {
    const headers = ['Year', 'Temperature (°F)', 'Precipitation (in)', 'Wind Speed (mph)']
    const rows = weatherData.temperature.historical.map((temp, i) => [
      temp.year,
      temp.value,
      weatherData.precipitation.historical[i].value,
      weatherData.wind.historical[i].value
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather-analysis-${weatherData.location.name}-${weatherData.date}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(weatherData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather-analysis-${weatherData.location.name}-${weatherData.date}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="export-buttons">
      <button className="btn btn-export btn-csv" onClick={exportToCSV}>
        <span>📄</span>
        Export CSV
      </button>
      <button className="btn btn-export btn-json" onClick={exportToJSON}>
        <span>📋</span>
        Export JSON
      </button>
    </div>
  )
}

export default ExportButtons
