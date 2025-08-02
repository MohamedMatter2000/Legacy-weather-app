import { useState, useEffect } from "react";
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}
function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}
export default function App() {
  const [location, setLocation] = useState(function () {
    const storedValue = localStorage.getItem("location");
    return JSON.parse(storedValue) || "";
  });
  const [displayLocation, setdisplayLoction] = useState("");
  const [isLoading, setisloading] = useState(false);
  const [weather, setweather] = useState({});

  useEffect(
    function () {
      async function fetchWeather() {
        if (location.length < 2) return setweather({});
        try {
          setisloading(true);
          // 1 Getting location (geocoding)
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
          );
          const geoData = await geoRes.json();
          console.log(geoData);
          if (!geoData.results) throw new Error("Location not found");
          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);
          console.log(`${name} ${convertToFlag(country_code)}`);
          setdisplayLoction(`${name} ${convertToFlag(country_code)}`);
          // 2 Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          const weatherData = await weatherRes.json();
          console.log(weatherData.daily);
          setweather(weatherData.daily);
        } catch (err) {
          // console.error(err.message);/
        } finally {
          setisloading(false);
        }
      }
      fetchWeather();
    },
    [location]
  );
  useEffect(
    function () {
      localStorage.setItem("location", JSON.stringify(location));
    },
    [location]
  );

  return (
    <div className="app">
      <h1>Classy Weathery</h1>
      <div>
        <input
          type="text"
          placeholder="Search From Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {isLoading && (
        <p
          className="
        Loader"
        >
          Loading...
        </p>
      )}
      {weather.weathercode && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}
function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;
  return (
    <div>
      <h2>weather {location}</h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            date={date}
            max={max.at(i)}
            code={codes.at(i)}
            min={min.at(i)}
            key={date}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}
function Day(props) {
  const { max, min, date, code, isToday } = props;
  return (
    <li className="day">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? "Today" : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong> {Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}
