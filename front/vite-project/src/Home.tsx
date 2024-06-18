import axios from "axios";
import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "react-router-typesafe";
import { useNavigate } from "react-router-dom";
import { IndexAction, IndexLoader } from "./App";
import Modal from "react-modal";
import { Form } from "react-router-dom";
import Cookies from "universal-cookie";
import { format } from "date-fns";
import MapComponent from "./components/map";

const cookies = new Cookies();

export type OWMRes = {
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

type OWMForecast = {
  cod: string;
  message: string;
  cnt: number;
  list: OWMRes[];
};
type OWMPollution = {
  coord: { lon: number; lat: number };
  list: {
    main: { aqi: number };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }[];
};

function makeDefault(city: string) {
  axios.patch("/user/defaultCity", {
    city: city,
  });
}

function error(err: GeolocationPositionError) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function Home() {
  const data = useLoaderData<typeof IndexLoader>();
  const [weather, setWeather] = useState<OWMRes>();
  const [forecast, setForecast] = useState<OWMForecast>();
  const [pollution, setPollution] = useState<OWMPollution>();
  const [clouds, setClouds] = useState<boolean>();
  const [stars, setStars] = useState<OWMRes[]>();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  console.log(data);

  const token = cookies.get("token");
  const navigate = useNavigate();

  const actionData = useActionData<typeof IndexAction>();

  const [newCity, setNewCity] = useState<OWMRes>();
  const [hiddenAnimation, setHiddenAnimation] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (actionData?.coord.lat !== 0) {
      setNewCity(actionData);
      setIsError(false);
    } else {
      setHiddenAnimation(true);
      setIsError(true);
    }
  }, [actionData]);

  function getForecast() {
    axios
      .get<OWMForecast>(`/forecast`, {
        params: {
          longtitude: weather?.coord.lon,
          latitude: weather?.coord.lat,
        },
      })
      .then((res) => setForecast(res.data));
  }
  function getPollution() {
    axios
      .get<OWMPollution>(`/airpollution`, {
        params: {
          longtitude: weather?.coord.lon,
          latitude: weather?.coord.lat,
        },
      })
      .then((res) => setPollution(res.data));
  }

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
                const dat = await axios
                  .get("/weather", {
                    params: {
                      longtitude: pos.coords.longitude,
                      latitude: pos.coords.latitude,
                    },
                  })
                  .then((res) => res.data);
                setWeather(dat);
                navigate("/", { replace: true });
              },
              error,
              options,
            );
          } else if (result.state === "denied") {
            console.log("DENIED");
          }
        });
    }
    function getWeatherForStars(data: { cities: { name: string }[] }) {
      console.log(data);
      let array: Promise<OWMRes>[] = [];
      if (data.cities !== undefined) {
        data.cities.forEach(async (el) => {
          const data = axios
            .get<OWMRes>("/weather", {
              params: {
                city: el.name,
              },
            })
            .then((res) => res.data);
          array.push(data);
        });
        Promise.all(array!).then((res) => setStars(res));
      }
    }
    async function getWeatherData(data: { city: string }) {
      await axios
        .get<OWMRes>("/weather", {
          params: {
            city: data.city,
          },
        })
        .then((res) => {
          setWeather(res.data);
        });
    }

    if (token && data != null) {
      if (!weather) {
        if (!data.prefs) {
          getWeather();
        } else {
          if (data.prefs.city == "") {
            getWeather();
          } else {
            getWeatherData(data.prefs);
          }
        }
      }

      if (!stars) {
        if (data.stars) {
          getWeatherForStars(data.stars);
        }
      }
    } else {
      if (!weather) {
        getWeather();
      }
    }
  }, []);

  return (
    <>
      <div className={`divide-y flex flex-col basis-full w-[100%]`}>
        <h1 className={`text-2xl lg:text-3xl font-bold py-3`}>
          Температура в вашем городе
        </h1>
        {token ? (
          <button
            onClick={() => {
              setModalIsOpen(true);
            }}
            className={`text-underline`}
          >
            Не ваш город?
          </button>
        ) : (
          <></>
        )}
        <Modal isOpen={modalIsOpen}>
          <div className={`flex flex-col gap-3`}>
            <div className={`flex flex-row justify-end`}>
              <button
                onClick={() => {
                  setModalIsOpen(false);
                  setNewCity(undefined);
                  setHiddenAnimation(true);
                }}
              >
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 25 25"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                >
                  <g id="bgCarrier" strokeWidth="0"></g>
                  <g
                    id="tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="iconCarrier">
                    <g
                      id="Page-1"
                      strokeWidth="0.00025"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Icon-Set-Filled"
                        transform="translate(-469.000000, -1041.000000)"
                        fill="#000000"
                      >
                        <path
                          d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48"
                          id="cross"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
            <Form className={`flex flex-col lg:flex-row gap-3`} method="post">
              <input
                name="city"
                type="text"
                id="city_id"
                className={`border p-2 lg:basis-10/12`}
                placeholder="Type in your city..."
              />
              <button
                type="submit"
                className={`bg-slate-300 lg:basis-2/12 p-3 w-[100%]`}
                onClick={() => {
                  setHiddenAnimation(false);
                  setNewCity(undefined);
                }}
              >
                Search
              </button>
            </Form>
            {newCity ? (
              <>
                <div className={`gap-2 flex w-[100%] lg:w-[100%] flex-col`}>
                  <div className={`backdrop-blur-sm`}>
                    <h1 className={`text-3xl font-bold mt-2`}>
                      {newCity?.name}, {newCity?.sys.country}
                    </h1>
                    <h2 className={`text-xl font-bold`}>
                      Чувствуется как {newCity?.main.feels_like}°C,{" "}
                      {newCity?.weather.map((el) => <>{el.description}</>)}
                    </h2>
                  </div>
                  <div
                    className={`p-3 rounded border backdrop-blur-sm flex flex-col bg-yellow-200`}
                  >
                    <div className={`flex flex-row w-[100%] basis-full`}>
                      <div className={`flex gap-3 basis-full flex-col`}>
                        <div className={`flex flex-row justify-between`}>
                          <h1 className={`text-2xl lg:text-3xl font-bold`}>
                            {newCity ? (
                              <>
                                <img
                                  src={`https://openweathermap.org/img/wn/${newCity?.weather[0].icon}.png`}
                                  alt={`weather_icon`}
                                  className={`inline-block`}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                            {newCity?.main.temp}{" "}
                            {newCity?.Unit == "metric" ? `°C` : ``}
                            {newCity?.Unit == "imperial" ? `°F` : ``}
                          </h1>
                          <h2 className={`text-lg`}>
                            Время замера:
                            <br />
                            {formatInTimeZone(
                              (newCity.dt + newCity.timezone) * 1000,
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
                                  transform: `rotate(${newCity?.wind.deg}deg)`,
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
                              {newCity?.wind.speed} м/с, {newCity?.wind.deg}°
                            </p>
                            <p>Влажность: {newCity?.main.humidity}%</p>
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
                              {newCity?.main.pressure}hPa
                            </p>
                            <p>Видимость: {newCity?.visibility} метров</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {token ? (
                  <button
                    className={`bg-sky-400 text-white font-bold`}
                    onClick={() => {
                      makeDefault(newCity.name);
                      setWeather(newCity);
                      setModalIsOpen(false);
                      setForecast(undefined);
                      setNewCity(undefined);
                    }}
                  >
                    Сделать городом по умолчанию
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
                      className={`flex flex-col justify-center items-center py-3 ${!newCity ? `` : `hidden`}`}
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
        </Modal>
        {weather?.base !== "" && weather !== undefined ? (
          <>
            <div
              className={`flex-col flex gap-2 mb-2 w-[100%] ${!weather ? `hidden` : ``}`}
            >
              <div className={`gap-2 flex w-[100%] lg:w-[100%] flex-col`}>
                <div className={`backdrop-blur-sm`}>
                  <h1 className={`text-3xl font-bold mt-2`}>
                    {weather?.name}, {weather?.sys.country} {"  "}
                    <svg
                      width={30}
                      height={30}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`inline-block hover:cursor-pointer ${token ? `` : `hidden`}`}
                      onClick={() => {
                        makeDefault(weather.name);
                      }}
                    >
                      <g id="bgCarrier" stroke-width="0"></g>
                      <g
                        id="tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="iconCarrier">
                        {" "}
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                          fill="#0F0F0F"
                        ></path>{" "}
                      </g>
                    </svg>
                  </h1>
                  <h2 className={`text-xl font-bold`}>
                    Чувствуется как {weather?.main.feels_like}°C,{" "}
                    {weather?.weather[0].description}
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
                            (weather!.dt + weather!.timezone) * 1000,
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
              <button
                className={`${!forecast ? `` : `hidden`} rounded bg-sky-500 text-white text-bold`}
                onClick={() => getForecast()}
              >
                Запросить прогноз
              </button>
              <button
                className={`${!pollution ? `` : `hidden`} rounded bg-sky-500 text-white text-bold`}
                onClick={() => getPollution()}
              >
                Запросить статистику по загрязнению воздуха
              </button>
              <button
                className={`${!clouds ? `` : `hidden`} rounded bg-sky-500 text-white text-bold`}
                onClick={() => setClouds(true)}
              >
                Запросить карту облаков
              </button>
              {clouds ? (
                <MapComponent
                  center={[weather.coord.lon, weather.coord.lat]}
                  zoom={5}
                />
              ) : (
                <></>
              )}
              {pollution ? (
                <div
                  className={`flex gap-2 w-[100%] p-3 rounded flex-col bg-amber-100`}
                >
                  {pollution.list.map((el) => {
                    return (
                      <>
                        <div className={`flex flex-col gap-1`}>
                          <h2 className={`text-2xl font-bold`}>
                            Индекс качества воздуха: {el.main.aqi}{" "}
                            {el.main.aqi == 1
                              ? `- качественное`
                              : el.main.aqi == 2
                                ? `- хорошее`
                                : el.main.aqi == 3
                                  ? `- нормальное`
                                  : el.main.aqi == 4
                                    ? `- плохое`
                                    : `- очень плохое`}
                          </h2>
                          <h3 className={`font-bold`}>
                            Время замера: {format(el.dt * 1000, "kk:mm")}
                          </h3>
                        </div>
                        <div className={`flex flex-col gap-1`}>
                          <table className={`table-auto border-collapse`}>
                            <thead>
                              <tr className={`border-b`}>
                                <th className={`border-r`}>Элемент</th>
                                <th>Количество</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className={`border-r break-all text-wrap`}>
                                  Концентрация CO (
                                  <a
                                    href="https://ru.wikipedia.org/wiki/Carbon_monoxide"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Монооксид углерода
                                  </a>
                                  )
                                </td>
                                <td className={`break-all text-wrap`}>
                                  {el.components.co} μg/m3
                                </td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация NO (
                                  <a
                                    href="https://ru.wikipedia.org/wiki/NO"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Оксид азота
                                  </a>
                                  )
                                </td>
                                <td>{el.components.no} μg/m3</td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация NO2 (
                                  <a
                                    href="https://ru.wikipedia.org/wiki/%D0%9E%D0%BA%D1%81%D0%B8%D0%B4_%D0%B0%D0%B7%D0%BE%D1%82%D0%B0(IV)"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Диоксид азота
                                  </a>
                                  )
                                </td>
                                <td>{el.components.no2} μg/m3</td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация O3 (
                                  <a
                                    href="https://ru.wikipedia.org/wiki/%D0%9E%D0%B7%D0%BE%D0%BD"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Озон
                                  </a>
                                  )
                                </td>
                                <td>{el.components.o3} μg/m3</td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация SO2 (
                                  <a
                                    href="https://ru.wikipedia.org/wiki/%D0%9E%D0%BA%D1%81%D0%B8%D0%B4_%D1%81%D0%B5%D1%80%D1%8B(IV)"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Оксид серы
                                  </a>
                                  )
                                </td>
                                <td>{el.components.so2} μg/m3</td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация PM2.5 (
                                  <a
                                    href="https://en.wikipedia.org/wiki/Particulates"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Мелкие частицы
                                  </a>
                                  )
                                </td>
                                <td>{el.components.pm2_5} μg/m3</td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация PM10 (
                                  <a
                                    href="https://en.wikipedia.org/wiki/Particulates#Size,_shape,_and_solubility_matter"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Крупные частицы
                                  </a>
                                  )
                                </td>
                                <td>{el.components.pm10} μg/m3</td>
                              </tr>
                              <tr>
                                <td className={`break-all text-wrap border-r`}>
                                  Концентрация NH3 (
                                  <a
                                    href="https://ru.wikipedia.org/wiki/%D0%90%D0%BC%D0%BC%D0%B8%D0%B0%D0%BA"
                                    className={`text-cyan-500 underline hover:no-underline`}
                                  >
                                    Аммиак
                                  </a>
                                  )
                                </td>
                                <td>{el.components.nh3} μg/m3</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
              <div
                className={`${forecast ? `` : `hidden`} flex gap-2 w-[100%] flex-col`}
              >
                {forecast?.list.map((el) => {
                  return (
                    <>
                      <div
                        className={`flex flex-row border divide-y bg-yellow-200 rounded w-[100%]`}
                      >
                        <div className={`basis-4/12 flex flex-row`}>
                          <img
                            src={`https://openweathermap.org/img/wn/${el.weather[0].icon}.png`}
                            alt="icon"
                            className={`h-[50px] w-[50px] self-center`}
                          />
                          <p className={`text-center self-center`}>
                            {el.weather[0].description}
                          </p>
                        </div>
                        <h3
                          className={`text-3xl text-center font-bold basis-4/12`}
                        >
                          {formatInTimeZone(
                            (el.dt + weather!.timezone) * 1000,
                            "+00:00",
                            "kk:mm",
                          )}
                        </h3>
                        <div className={`basis-4/12`}>
                          <h3 className={`text-2xl text-center font-bold`}>
                            {el.main.temp} °C
                          </h3>
                          <p className={`text-center`}>
                            Влажность: {el.main.humidity}%
                          </p>
                          <p className={`text-center`}>
                            Ветер:{" "}
                            <svg
                              viewBox="0 0 1000 1000"
                              enable-background="new 0 0 1000 1000"
                              xmlSpace="preserve"
                              className={`inline-block`}
                              width={15}
                              height={15}
                              style={{
                                transform: `rotate(${el.wind.deg}deg)`,
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
                            </svg>{" "}
                            {el.wind.speed} м/с
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </>
        ) : weather?.base == "" ? (
          <>
            <div className={`flex flex-col my-3 bg-red-400 p-3 rounded`}>
              <h1 className={`text-white font-bold`}>
                Нет ответа от метеостанции
              </h1>
            </div>
          </>
        ) : (
          <></>
        )}
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
        <h2 className={`text-3xl font-bold`}>
          Температура в отслеживаемых городах
        </h2>
        <div>
          {stars !== undefined ? (
            stars.map((el) => {
              if (el.base !== "") {
                return (
                  <>
                    <div className={`gap-2 flex w-[100%] lg:w-[100%] flex-col`}>
                      <div className={`backdrop-blur-sm`}>
                        <h1 className={`text-3xl font-bold mt-2`}>
                          {el?.name}, {el?.sys.country}
                        </h1>
                        <h2 className={`text-xl font-bold`}>
                          Чувствуется как {el?.main.feels_like}°C,{" "}
                          {el.weather !== null
                            ? el?.weather[0].description
                            : ""}
                        </h2>
                      </div>
                      <div
                        className={`p-3 rounded border backdrop-blur-sm flex flex-col bg-yellow-200`}
                      >
                        <div className={`flex flex-row w-[100%] basis-full`}>
                          <div className={`flex gap-3 basis-full flex-col`}>
                            <div className={`flex flex-row justify-between`}>
                              <h1 className={`text-3xl font-bold`}>
                                {el ? (
                                  <>
                                    <img
                                      src={
                                        el.weather !== null
                                          ? `https://openweathermap.org/img/wn/${el?.weather[0].icon}.png`
                                          : ""
                                      }
                                      alt={`weather_icon`}
                                      className={`inline-block`}
                                    />
                                  </>
                                ) : (
                                  <></>
                                )}
                                {el?.main.temp}{" "}
                                {el?.Unit == "metric" ? `°C` : ``}
                                {el?.Unit == "imperial" ? `°F` : ``}
                              </h1>
                              <h2 className={`text-lg`}>
                                Время замера:
                                <br />
                                {formatInTimeZone(
                                  (el.dt + el.timezone) * 1000,
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
                                      transform: `rotate(${el?.wind.deg}deg)`,
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
                                  {el?.wind.speed} м/с, {el?.wind.deg}°
                                </p>
                                <p>Влажность: {el?.main.humidity}%</p>
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
                                  {el?.main.pressure}hPa
                                </p>
                                <p>Видимость: {el?.visibility} метров</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div
                      className={`flex flex-col my-3 p-3 bg-red-400 rounded`}
                    >
                      <h1 className={`text-white font-bold`}>
                        Нет ответа от метеостанции
                      </h1>
                    </div>
                  </>
                );
              }
            })
          ) : (
            <></>
          )}
          {!token ? (
            <div className={`bg-amber-200 p-3 flex flex-col my-2`}>
              <h1 className={`font-bold`}>Войдите, чтобы отслеживать города</h1>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
