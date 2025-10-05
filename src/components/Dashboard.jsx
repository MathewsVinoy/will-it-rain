import MapView from './MapView'
import Results from './Results'
import './Dashboard.css'

function Dashboard({ selectedLocation, setSelectedLocation, weatherData, parameters, eventDate }) {
  return (
    <div className="dashboard-wrapper">
      <section className="results-section">
        <Results 
          weatherData={weatherData}
          parameters={parameters}
          eventDate={eventDate}
          selectedLocation={selectedLocation}
        />
      </section>
      <section className="map-section">
        <MapView 
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </section>
    </div>
  )
}

export default Dashboard
