# Will It Rain? 🌤️

A React-based weather conditions planner that helps you assess the likelihood of adverse weather conditions for outdoor events using historical weather data.

## Features

- 🗺️ **Interactive Map Selection** - Click on the map or search for locations
- 📅 **Date & Time Planning** - Select your event date and historical range
- 🌡️ **Multiple Weather Parameters** - Temperature, precipitation, wind, humidity, cloud cover, and air quality
- 📊 **Visual Analytics** - Interactive charts showing historical trends and probabilities
- 📈 **Climate Trends** - See how weather patterns have changed over time
- 💾 **Data Export** - Download results in CSV or JSON format
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MathewsVinoy/will-it-rain.git
   cd will-it-rain
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### 1. Select a Location
- Use the search bar to find a city (try: Seattle, Miami, Denver, Boston, Phoenix)
- Or click directly on the map to select any location

### 2. Choose Your Event Date
- Pick the date of your planned outdoor event
- Select how many years of historical data to analyze (5-30 years)

### 3. Configure Parameters
- Select which weather conditions you want to analyze:
  - Temperature (hot/cold thresholds)
  - Precipitation (rain probability)
  - Wind speed
  - Humidity
  - Cloud cover
  - Air quality

### 4. Set Thresholds
- Define what "very hot", "very cold", "very wet", and "very windy" means for you
- Default thresholds:
  - Very Hot: 90°F
  - Very Cold: 32°F
  - Heavy Rain: 0.5 inches
  - Very Windy: 20 mph

### 5. Analyze
- Click "Analyze Weather" to see historical patterns and probabilities
- View summary cards showing percentage likelihood of each condition
- Explore interactive charts showing trends over time
- Export your results as CSV or JSON files

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet & React-Leaflet** - Interactive maps
- **Chart.js & React-Chartjs-2** - Data visualization
- **CSS3** - Styling with custom properties

## Data Sources

This application is designed to work with NASA Earth observation data:

- **POWER (Prediction Of Worldwide Energy Resources)** - Historical weather data
- **Giovanni** - Climate data analysis
- **Earthdata Search** - Satellite observations
- **MERRA-2** - Modern-Era Retrospective analysis

### Integrating Real NASA APIs

To connect to real NASA data sources, update the `generateMockWeatherData` function in `src/App.jsx`:

```javascript
// Replace mock data with real API calls
const response = await fetch(
  `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,WS10M&community=RE&longitude=${lng}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`
);
```

## Project Structure

```
will-it-rain/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ControlPanel.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MapView.jsx
│   │   ├── Results.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── ChartsGrid.jsx
│   │   ├── ExportButtons.jsx
│   │   └── LoadingOverlay.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Roadmap

- [ ] Integration with real NASA POWER API
- [ ] User accounts and saved locations
- [ ] Multi-location comparison
- [ ] Weather alerts and notifications
- [ ] Historical event correlation
- [ ] Mobile app version
- [ ] Advanced statistical analysis
- [ ] Social sharing features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- NASA for providing free access to Earth observation data
- OpenStreetMap contributors for map tiles
- The React and open-source communities

## Contact

**Mathews Vinoy**
- GitHub: [@MathewsVinoy](https://github.com/MathewsVinoy)
- Repository: [will-it-rain](https://github.com/MathewsVinoy/will-it-rain)

---

Built with ❤️ for outdoor enthusiasts and event planners worldwide.
