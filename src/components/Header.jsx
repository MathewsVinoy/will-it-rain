import './Header.css'

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>
          <span className="icon">🌤️</span>
          Will It Rain?
        </h1>
        <p className="tagline">
          Plan your outdoor events with confidence using historical weather data
        </p>
      </div>
    </header>
  )
}

export default Header
