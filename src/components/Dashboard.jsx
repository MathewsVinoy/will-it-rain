import MapView from './MapView'
import Results from './Results'
import './Dashboard.css'

function Dashboard({ selectedLocation, setSelectedLocation, weatherData, parameters, eventDate }) {
  return (
    <section className="dashboard">
      <MapView 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <Results 
        weatherData={weatherData}
        parameters={parameters}
        eventDate={eventDate}
        selectedLocation={selectedLocation}
      />
    </section>
  )
}

export default Dashboard
