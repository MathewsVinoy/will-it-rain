import './LoadingOverlay.css'

function LoadingOverlay() {
  return (
    <div className="loading-overlay active">
      <div className="spinner"></div>
      <p>Analyzing weather data...</p>
    </div>
  )
}

export default LoadingOverlay
