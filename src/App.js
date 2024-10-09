import { useEffect, useState } from "react";
import "./App.css";
import PropTypes from "prop-types";

/*images*/
import searchIcon from "./assets/search.png";
import cloudIcon from "./assets/cloudy.png";
import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";
import clearIcon from "./assets/clear.png";

const Weatherdetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="clear" />
      </div>
      <div className="temp">{temp}°C</div> {/*press alt + 0176 for ° symbol*/}
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lat">Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind}Km/h</div>
            <div className="text">Wind</div>
          </div>
        </div>
      </div>
    </>
  );
};

Weatherdetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
};
function App() {
  let api_key = "d691fee92cb1b702732e5181782507b8";
  const [text, setText] = useState("Bangalore");

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("");
  const [lat, setLatitude] = useState(0);
  const [log, setLongitude] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    //https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=d691fee92cb1b702732e5181782507b8&units=Metric
    //thunderclient

    try {
      let res = await fetch(url);
      let data = await res.json();
      //console.log(data);
      if (data.cod === 404) {
        //cod = code not found
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity); //Getting these data through thunderclient/postman
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.log("An error occured", error.message);
      setError("An error occurred while fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => {
    setText("");
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
      clearText();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => {}}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        {!loading && !cityNotFound && (
          <Weatherdetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}

        <p className="copyright">
          Designed by <span>John`s</span>
        </p>
      </div>
    </>
  );
}

export default App;
