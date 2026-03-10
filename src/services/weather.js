const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const searchCity = async (cityName) => {
  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error("Failed to search city");
  }
  return response.json() || [];
};

export const fetchWeather = async (latitude, longitude) => {
  const url = new URL(WEATHER_URL);
  url.searchParams.append("latitude", latitude?.toString());
  url.searchParams.append("longitude", longitude?.toString());
  url.searchParams.append(
    "current",
    "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m"
  );
  url.searchParams.append("timezone", "auto");

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error:", errorData);
    throw new Error(errorData?.reason || "Failed to fetch weather data");
  }
  return response.json();
};

export const getWeatherByCityName = async (cityName) => {
  const geocoding = await searchCity(cityName);

  if (!geocoding?.results || geocoding?.results?.length === 0) {
    throw new Error("City not found");
  }

  const { name, latitude, longitude, country } = geocoding?.results[0];
  const weather = await fetchWeather(latitude, longitude);

  return {

    city: name,
    country,
    temperature: weather?.current.temperature_2m,
    condition: weather?.current.weather_code,
    humidity: weather?.current.relative_humidity_2m,
    windSpeed: weather?.current.wind_speed_10m,
    lastUpdated: weather?.current.time,

  };
};