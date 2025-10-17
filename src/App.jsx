import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

// Free weather API without API key
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeatherData = async (city) => {
    setLoading(true)
    setError(null)
    setWeatherData(null)

    try {
      // First get city coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      )
      
      if (!geoResponse.ok) {
        throw new Error('Failed to fetch city data')
      }

      const geoData = await geoResponse.json()
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Please check the spelling.')
      }

      const { latitude, longitude, name, country } = geoData.results[0]

      // Get weather data
      const weatherResponse = await fetch(
        `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl`
      )

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const weatherData = await weatherResponse.json()

      // Transform data to match our component structure
      const transformedData = {
        name,
        sys: { country },
        main: {
          temp: weatherData.current.temperature_2m,
          feels_like: weatherData.current.apparent_temperature,
          humidity: weatherData.current.relative_humidity_2m,
          pressure: weatherData.current.pressure_msl
        },
        weather: [{
          main: getWeatherCondition(weatherData.current.weather_code),
          description: getWeatherDescription(weatherData.current.weather_code),
          icon: getWeatherIcon(weatherData.current.weather_code)
        }],
        wind: {
          speed: weatherData.current.wind_speed_10m
        }
      }

      setWeatherData(transformedData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Convert weather codes to human-readable conditions
  const getWeatherCondition = (code) => {
    const conditions = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Fog',
      51: 'Drizzle',
      53: 'Drizzle',
      55: 'Drizzle',
      61: 'Rain',
      63: 'Rain',
      65: 'Rain',
      80: 'Rain Showers',
      81: 'Rain Showers',
      82: 'Rain Showers',
      71: 'Snow',
      73: 'Snow',
      75: 'Snow',
      85: 'Snow Showers',
      86: 'Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm',
      99: 'Thunderstorm'
    }
    return conditions[code] || 'Unknown'
  }

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    }
    return descriptions[code] || 'Unknown weather condition'
  }

  const getWeatherIcon = (code) => {
    const icons = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      53: '🌦️',
      55: '🌦️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      80: '🌦️',
      81: '🌦️',
      82: '🌧️',
      71: '🌨️',
      73: '🌨️',
      75: '🌨️',
      85: '🌨️',
      86: '🌨️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️'
    }
    return icons[code] || '🌈'
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Weather Dashboard</h1>
        <p>Get real-time weather information for any city</p>
      </div>

      <SearchBar onSearch={fetchWeatherData} loading={loading} />

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {weatherData && !loading && !error && (
        <WeatherCard weatherData={weatherData} />
      )}

      {!weatherData && !loading && !error && (
        <div className="initial-state">
          <h3>Search for a city to get weather information</h3>
          <p>Enter a city name above to see current weather conditions</p>
        </div>
      )}
    </div>
  )
}

export default App