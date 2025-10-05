/**
 * Temperature conversion utilities
 */

// Convert Fahrenheit to Celsius
export const fahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9
}

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32
}

// Format temperature with unit
export const formatTemperature = (temp, unit = 'F', decimals = 1) => {
  return `${temp.toFixed(decimals)}°${unit}`
}

// Convert temperature based on unit
export const convertTemperature = (temp, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return temp
  
  if (fromUnit === 'F' && toUnit === 'C') {
    return fahrenheitToCelsius(temp)
  }
  
  if (fromUnit === 'C' && toUnit === 'F') {
    return celsiusToFahrenheit(temp)
  }
  
  return temp
}

// Get temperature label for display
export const getTemperatureLabel = (unit) => {
  return unit === 'C' ? 'Celsius (°C)' : 'Fahrenheit (°F)'
}

// Get unit symbol
export const getUnitSymbol = (unit) => {
  return unit === 'C' ? '°C' : '°F'
}
