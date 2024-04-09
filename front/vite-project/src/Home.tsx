import { useLoaderData } from "react-router-typesafe";
import { rootLoader } from "./App";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Home() {
  const data = useLoaderData<typeof rootLoader>();

  const token = cookies.get("token");

  return (
    <>
      <h1 className={`text-3xl underline text-bold`}>Hello world</h1>
      <h1>{token}</h1>
      {data?.data.map((el, index) => {
        return (
          <>
            <div
              className={`border p-3 bg-slate-300 flex flex-col`}
              key={`index${index}${el.id}`}
            >
              <p>{el.id}</p>
              <p>{el.name}</p>
              <p>{el.username}</p>
            </div>
          </>
        );
      })}
    </>
  );
}

export default Home;
