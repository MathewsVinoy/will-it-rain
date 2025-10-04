import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import './ChartsGrid.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function ChartsGrid({ weatherData, parameters }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  // Temperature Historical Trend
  const tempHistoricalData = {
    labels: weatherData.temperature.historical.map(d => d.year),
    datasets: [
      {
        label: 'Temperature (°F)',
        data: weatherData.temperature.historical.map(d => d.value),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  }

  // Temperature Probability Distribution
  const tempProbData = {
    labels: ['Very Hot', 'Comfortable', 'Very Cold'],
    datasets: [
      {
        label: 'Probability (%)',
        data: [
          weatherData.temperature.probabilities.aboveThreshold,
          weatherData.temperature.probabilities.comfortable,
          weatherData.temperature.probabilities.belowThreshold
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  }

  // Precipitation Historical Trend
  const precipHistoricalData = {
    labels: weatherData.precipitation.historical.map(d => d.year),
    datasets: [
      {
        label: 'Precipitation (inches)',
        data: weatherData.precipitation.historical.map(d => d.value),
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1
      }
    ]
  }

  // Precipitation Probability
  const precipProbData = {
    labels: ['Heavy Rain', 'Light Rain', 'No Precipitation'],
    datasets: [
      {
        data: [
          weatherData.precipitation.probabilities.heavyRain,
          weatherData.precipitation.probabilities.lightRain,
          weatherData.precipitation.probabilities.noPrecip
        ],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(186, 230, 253, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  // Wind Historical Trend
  const windHistoricalData = {
    labels: weatherData.wind.historical.map(d => d.year),
    datasets: [
      {
        label: 'Wind Speed (mph)',
        data: weatherData.wind.historical.map(d => d.value),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  // Wind Probability
  const windProbData = {
    labels: ['Very Windy', 'Moderate', 'Calm'],
    datasets: [
      {
        label: 'Probability (%)',
        data: [
          weatherData.wind.probabilities.veryWindy,
          weatherData.wind.probabilities.moderate,
          weatherData.wind.probabilities.calm
        ],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(221, 214, 254, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <div className="charts-grid">
      {parameters.temperature && (
        <>
          <div className="chart-container">
            <h3>📈 Temperature Trend</h3>
            <div className="chart-wrapper">
              <Line data={tempHistoricalData} options={chartOptions} />
            </div>
            <div className="chart-stats">
              <p><strong>Avg High:</strong> {weatherData.temperature.averages.high}°F</p>
              <p><strong>Avg Low:</strong> {weatherData.temperature.averages.low}°F</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>🌡️ Temperature Probability</h3>
            <div className="chart-wrapper">
              <Bar data={tempProbData} options={chartOptions} />
            </div>
          </div>
        </>
      )}

      {parameters.precipitation && (
        <>
          <div className="chart-container">
            <h3>📊 Precipitation History</h3>
            <div className="chart-wrapper">
              <Bar data={precipHistoricalData} options={chartOptions} />
            </div>
            <div className="chart-stats">
              <p><strong>Avg Amount:</strong> {weatherData.precipitation.averages.amount} inches</p>
              <p><strong>Rainy Days:</strong> {weatherData.precipitation.averages.rainyDays}</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>💧 Precipitation Likelihood</h3>
            <div className="chart-wrapper">
              <Pie data={precipProbData} options={chartOptions} />
            </div>
          </div>
        </>
      )}

      {parameters.wind && (
        <>
          <div className="chart-container">
            <h3>💨 Wind Speed Trend</h3>
            <div className="chart-wrapper">
              <Line data={windHistoricalData} options={chartOptions} />
            </div>
            <div className="chart-stats">
              <p><strong>Avg Speed:</strong> {weatherData.wind.averages.speed} mph</p>
              <p><strong>Max Gust:</strong> {weatherData.wind.averages.maxGust} mph</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>🌬️ Wind Probability</h3>
            <div className="chart-wrapper">
              <Bar data={windProbData} options={chartOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChartsGrid
