import { useLoaderData } from "react-router-typesafe";
import { rootLoader } from "./App";
import Cookies from "universal-cookie";
import axios from "axios";
import { useEffect, useState } from "react";

const cookies = new Cookies();

type OWMRes = {
  coord: { lat: number; lon: number };
  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  base: string;
  weather: { id: number; main: string; description: string; icon: string }[];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: { all: number };
  rain: { oneH: number; threeH: number };
  snow: { oneH: number; threeH: number };
  dt: number;
  id: number;
  name: string;
  cod: number;
  timezone: number;
  Unit: string;
};

function error(err: GeolocationPositionError) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function Home() {
  useLoaderData<typeof rootLoader>();

  const [weather, setWeather] = useState<OWMRes>();

  useEffect(() => {
    async function getWeather() {
      await navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(async (pos) => {
              await axios
                .get("/weather", {
                  params: {
                    longtitude: pos.coords.longitude,
                    latitude: pos.coords.latitude,
                  },
                })
                .then((res) => {
                  setWeather(res.data);
                });
            });
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                await axios
                  .get("/weather", {
                    params: {
                      longtitude: pos.coords.longitude,
                      latitude: pos.coords.latitude,
                    },
                  })
                  .then((res) => {
                    setWeather(res.data);
                  });
              },
              error,
              options,
            );
          } else if (result.state === "denied") {
            console.log("DENIED");
          }
        });
    }
    if (!weather) {
      getWeather();
    }
  }, []);

  const token = cookies.get("token");

  return (
    <>
      <h1 className={`text-3xl underline text-bold`}>Hello world</h1>
      <h1>{token}</h1>
      <div
        className={`p-3 rounded border flex flex-col w-[75%] ${weather?.weather.find((el) => el.main == "Clouds" || "Rain") ? `bg-slate-200` : ``} ${weather?.weather.find((el) => el.main == "Sunny") ? `bg-amber-200` : ``} ${weather?.weather.find((el) => el.main == "Snow") ? `bg-white` : ``}`}
      >
        <div className={`flex flex-row`}>
          <div className={`flex flex-col`}>
            <h1 className={`text-3xl font-bold`}>
              {weather?.main.temp} {weather?.Unit == "metric" ? `C` : `F`}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
