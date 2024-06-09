import { Form } from "react-router-dom";
import { useActionData } from "react-router-typesafe";
import { SearchAction } from "./App";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { formatInTimeZone } from "date-fns-tz";

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

function Search() {
  const data = useActionData<typeof SearchAction>();

  const [weather, setWeather] = useState<OWMRes>();
  const [hiddenAnimation, setHiddenAnimation] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [success, setSuccess] = useState<{
    success: boolean;
    message?: string;
  }>();
  const token = cookies.get("token");

  async function starCity(data: OWMRes) {
    await axios
      .put("/user/star", {
        name: data.name,
      })
      .then(() => setSuccess({ success: true }))
      .catch((err) => {
        setSuccess({ success: false, message: err.response.data.message });
      });
  }

  useEffect(() => {
    if (data?.coord.lat !== 0) {
      setWeather(data);
      setIsError(false);
    } else {
      setHiddenAnimation(true);
      setIsError(true);
    }
  }, [data]);
  return (
    <>
      <div className={`flex flex-col w-[100%] gap-3 divide-y`}>
        <Form className={`flex flex-row gap-3`} method="post">
          <input
            name="city"
            type="text"
            id="city_id"
            className={`border p-2 basis-10/12`}
            placeholder="Type in your city..."
          />
          <button
            type="submit"
            className={`bg-slate-300 basis-2/12 p-3 w-[100%]`}
            onClick={() => {
              setHiddenAnimation(false);
              setWeather(undefined);
              setSuccess(undefined);
            }}
          >
            Search
          </button>
        </Form>
        {weather ? (
          <>
            <div className={`gap-2 flex w-[100%] lg:w-[100%] flex-col`}>
              <div className={`backdrop-blur-sm`}>
                <h1 className={`text-3xl font-bold mt-2`}>
                  {weather?.name}, {weather?.sys.country}
                </h1>
                <h2 className={`text-xl font-bold`}>
                  Чувствуется как {weather?.main.feels_like}°C,{" "}
                  {weather?.weather.map((el) => <>{el.description}</>)}
                </h2>
              </div>
              <div
                className={`p-3 rounded border backdrop-blur-sm flex flex-col bg-yellow-200`}
              >
                <div className={`flex flex-row w-[100%] basis-full`}>
                  <div className={`flex gap-3 basis-full flex-col`}>
                    <div className={`flex flex-row justify-between`}>
                      <h1 className={`text-3xl font-bold`}>
                        {weather ? (
                          <>
                            <img
                              src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}.png`}
                              alt={`weather_icon`}
                              className={`inline-block`}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                        {weather?.main.temp}{" "}
                        {weather?.Unit == "metric" ? `°C` : ``}
                        {weather?.Unit == "imperial" ? `°F` : ``}
                      </h1>
                      <h2 className={`text-lg`}>
                        Время замера:
                        <br />
                        {formatInTimeZone(
                          (weather.dt + weather.timezone) * 1000,
                          "+00:00",
                          "kk:mm",
                        )}
                      </h2>
                    </div>
                    <div className={`p-3 flex-row flex gap-3`}>
                      <div>
                        <p>
                          <svg
                            viewBox="0 0 1000 1000"
                            enable-background="new 0 0 1000 1000"
                            xmlSpace="preserve"
                            className={`inline-block`}
                            width={15}
                            height={15}
                            style={{
                              transform: `rotate(${weather?.wind.deg}deg)`,
                            }}
                          >
                            <g data-v-47880d39="" fill="#48484a">
                              <path
                                data-v-47880d39=""
                                d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"
                              ></path>
                              <path
                                data-v-47880d39=""
                                d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z"
                              ></path>
                            </g>
                          </svg>
                          {weather?.wind.speed} м/с, {weather?.wind.deg}°
                        </p>
                        <p>Влажность: {weather?.main.humidity}%</p>
                      </div>
                      <div>
                        <p>
                          <svg
                            width={15}
                            height={15}
                            viewBox="0 0 96 96"
                            className={`inline-block`}
                          >
                            <g
                              data-v-7bdd0738=""
                              transform="translate(0,96) scale(0.100000,-0.100000)"
                              fill="#48484a"
                              stroke="none"
                            >
                              <path
                                data-v-7bdd0738=""
                                d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0
                              -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0
                              118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176
                              -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259
                              -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135
                              -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135
                              0 130 66 234 185 291 82 40 184 41 265 3z"
                              ></path>
                              <path
                                data-v-7bdd0738=""
                                d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50
                              -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24
                              17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68
                              15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27
                              -59 -60z"
                              ></path>
                            </g>
                          </svg>
                          {weather?.main.pressure}hPa
                        </p>
                        <p>Видимость: {weather?.visibility} метров</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {token ? (
              <button
                className={`bg-sky-400 text-white text-bold`}
                onClick={() => starCity(weather)}
              >
                Добавить город в избранные
              </button>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {!hiddenAnimation ? (
              <>
                <div
                  className={`flex flex-col justify-center items-center py-3 ${!weather ? `` : `hidden`}`}
                >
                  <svg
                    fill="#000000"
                    className={`animate-spin`}
                    height="100px"
                    width="100px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 489.645 489.645"
                    xmlSpace="preserve"
                  >
                    <g id="bgCarrier" stroke-width="0"></g>
                    <g
                      id="tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3 c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5 c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8 c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2 C414.856,432.511,548.256,314.811,460.656,132.911z"></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </div>
              </>
            ) : (
              <>
                {isError ? (
                  <>
                    <h1 className={`text-3xl font-bold text-center`}>
                      Город не найден
                    </h1>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </div>
      {success?.success ? (
        <div
          className={`bg-green-400 mt-3 rounded text-white font-bold flex flex-col p-3`}
        >
          <h2 className={`text-xl`}>Город добавлен в избранные успешно</h2>
        </div>
      ) : success?.success == false ? (
        <div
          className={`bg-red-400 mt-3 rounded text-white font-bold flex flex-col p-3`}
        >
          <h2 className={`text-xl`}>Ошибка: {success?.message}</h2>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Search;
