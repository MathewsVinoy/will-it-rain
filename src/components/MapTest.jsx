import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function MapTest() {
  return (
    <div style={{ height: '400px', width: '100%', background: '#f0f0f0' }}>
      <h3 style={{ textAlign: 'center', padding: '20px' }}>Map Test</h3>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}

export default MapTest

