
import { useEffect, useState } from "react";
import "./App.css";
import { CiSearch } from "react-icons/ci";

const _baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "f631ea87daddf959f8d7a12c30009e4c";
const defaultCity = "Bishkek";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [searchCity, setSearchCity] = useState(defaultCity);
  // тема HTTPS
  const [theme, setTheme] = useState("day");

  async function getWeather(cityName) {
    if (!cityName) return;
    try {
      const res = await fetch(_baseUrl + cityName + "&appid=" + apiKey);
      if (!res.ok) {
        throw new Error("Не удалось получить данные о погоде");
      }
      const data = await res.json();
      setWeatherData(data);
      updateTheme(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getWeather(searchCity);
  }, [searchCity]);

  const updateTheme = (data) => {
    // Местное время
    const localTime = new Date(
      (data.dt + data.timezone - new Date().getTimezoneOffset() * 60) * 1000
    );
    const hours = localTime.getUTCHours();
    if (hours >= 5 && hours < 18) {
      setTheme("night");
    } else {
      setTheme("day");
    }
  };

  const changeSearchCity = (e) => {
    setSearchCity(e.target.value);
  };

  const handleSearch = () => {
    getWeather(searchCity);
  };

  if (!weatherData) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={`app ${theme}`}>
      <div className="weather-card">
        <div className="weather-main">
          <section className="sector-one">
            <h2 className="weather-temp">
              {Math.floor(weatherData.main.temp - 273.15)}°c
            </h2>
          </section>
          <section>
            <h2 className="weather-city">{weatherData.name}</h2>
            <div>
              <h4 className="weather-date">
                {new Date(
                  (weatherData.dt + weatherData.timezone) * 1000
                  // Локальная строка
                ).toLocaleString("en-GB", {
                  hour: "2-digit",
                  weekday: "long",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}
              </h4>
              <h4 className="calendarData">
                {new Date(
                  (weatherData.dt + weatherData.timezone) * 1000
                  // Локальная строка
                ).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              <h4 className="weather-desc">
                {weatherData.weather[0].description}
              </h4>
            </div>
          </section>
        </div>
      </div>
      <div className="search-bar">
        <input
          type="text"
          // ищите в другом месте
          placeholder="search elsewhere"
          value={searchCity}
          onChange={changeSearchCity}
        />
        <button onClick={handleSearch}>
          <CiSearch />
        </button>
        <hr className="hhr" />
        <div className="location-list">
          <ul>
            <li>Birmingham</li>
            <li>Manchester</li>
            <li>New York</li>
            <li>California</li>
          </ul>
        </div>
        <hr />
        <div className="weather-details">
          <h3>weather-details</h3>
          <p>Cloudy: {weatherData.clouds.all}%</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind: {weatherData.wind.speed} km/h</p>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default App;
