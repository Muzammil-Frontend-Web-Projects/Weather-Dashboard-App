import React from 'react'

const WeatherCard = ({ weatherData }) => {
  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ main, description, icon }],
    wind: { speed },
    sys: { country }
  } = weatherData

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{name}, {country}</h2>
        <div className="weather-condition">
          <span style={{fontSize: '3rem'}}>{icon}</span>
          <span>{main}</span>
        </div>
      </div>
      
      <div className="weather-temp">
        <h1>{Math.round(temp)}°C</h1>
        <p>Feels like {Math.round(feels_like)}°C</p>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="label">Description</span>
          <span className="value">{description}</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity</span>
          <span className="value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">Pressure</span>
          <span className="value">{pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Speed</span>
          <span className="value">{speed} km/h</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard