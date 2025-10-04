# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:3000`

## 📝 How to Use

### Step 1: Select a Location
- **Option A:** Type a city name in the search bar (Seattle, Miami, Denver, Boston, Phoenix)
- **Option B:** Click anywhere on the map to select a location

### Step 2: Choose Event Details
- Pick your event date using the date picker
- Select historical range (5, 10, 20, or 30 years of data)

### Step 3: Configure Weather Parameters
Check the weather conditions you want to analyze:
- ✅ Temperature (default: ON)
- ✅ Precipitation (default: ON)
- ✅ Wind Speed (default: ON)
- ☐ Humidity
- ☐ Cloud Cover
- ☐ Air Quality

### Step 4: Set Your Thresholds
Define what extreme conditions mean for your event:
- **Very Hot:** Default 90°F (adjust as needed)
- **Very Cold:** Default 32°F (adjust as needed)
- **Heavy Rain:** Default 0.5 inches (adjust as needed)
- **Very Windy:** Default 20 mph (adjust as needed)

### Step 5: Analyze
Click the **"Analyze Weather"** button to generate:
- 📊 Probability percentages for each condition
- 📈 Historical trend charts
- 📉 Climate change indicators
- 💾 Exportable data (CSV/JSON)

## 🎯 Example Use Cases

### Planning a Beach Wedding
```
Location: Miami, FL
Date: June 15, 2026
Parameters: Temperature, Precipitation, Wind
Thresholds: Hot 85°F, Rain 0.3", Wind 15mph
```

### Organizing a Hiking Trip
```
Location: Denver, CO
Date: September 20, 2026
Parameters: Temperature, Precipitation, Air Quality
Thresholds: Hot 80°F, Cold 40°F, Rain 0.5"
```

### Scheduling Outdoor Concert
```
Location: Seattle, WA
Date: July 4, 2026
Parameters: All parameters
Thresholds: Standard defaults
```

## 📥 Exporting Data

After analysis, click either:
- **Export CSV** - For Excel/spreadsheet analysis
- **Export JSON** - For programmatic use or archiving

## 🔧 Troubleshooting

### Map not loading?
- Check your internet connection
- Refresh the page

### No results showing?
- Make sure you've selected a location
- Ensure you've chosen an event date
- Click "Analyze Weather" button

### Charts not displaying?
- At least one parameter must be selected
- Try refreshing the page

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## 📱 Mobile Support

The app is fully responsive and works on:
- 📱 Smartphones (portrait & landscape)
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🛠️ Production Build

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 💡 Pro Tips

1. **Save Your Settings:** Your last search is preserved in browser memory
2. **Compare Dates:** Run analysis for multiple dates to compare
3. **Historical Patterns:** Longer date ranges (20-30 years) show better trends
4. **Export Early:** Export your data before running new analysis
5. **Multiple Locations:** Open multiple browser tabs to compare locations

## 🔗 Keyboard Shortcuts

- `Enter` in search box → Search for location
- `Tab` → Navigate between fields
- `Space` → Toggle checkboxes

## 📚 Next Steps

- Explore the full [README.md](README.md) for detailed information
- Check out the project structure
- Learn about NASA data sources
- Contribute to the project

---

Need help? Open an issue on [GitHub](https://github.com/MathewsVinoy/will-it-rain/issues)
