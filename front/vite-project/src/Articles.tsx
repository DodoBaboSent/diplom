import { useLoaderData } from "react-router-typesafe";
import { ArticlesLoader } from "./App";
import { useState } from "react";

function Articles() {
  const articles = useLoaderData<typeof ArticlesLoader>();
  const [localArt, setLocalArt] = useState<typeof articles>(articles);

  return (
    <>
      <h1 className={`text-3xl font-bold mb-2`}>Архив новостей</h1>
      <div className={`flex flex-col gap-3 w-[100%]`}>
        <div className={`w-[100%] flex flex-col gap-2`}>
          <label htmlFor="cont_id">Континент</label>
          <select
            id="cont_id"
            name="cont"
            className={`border p-2`}
            onChange={(e) => {
              if (e.currentTarget.value !== "all") {
                let newArt = articles?.filter(
                  (el) => el.cont == e.currentTarget.value,
                );
                setLocalArt(newArt != undefined ? newArt : null);
              } else {
                setLocalArt(articles);
              }
            }}
          >
            <option value="all">Все</option>
            <option value="eurasia">Евразия</option>
            <option value="northam">Северная Америка</option>
            <option value="southam">Южная Америка</option>
            <option value="africa">Африка</option>
          </select>
        </div>
        {localArt ? (
          localArt.map((el) => {
            return (
              <div
                className={`p-3 rounded border gap-3 flex flex-col divide-y w-[100%]`}
              >
                <div className={`w-[100%] flex flex-row`}>
                  <a
                    className={`text-2xl hover:text-underline`}
                    href={`/article/${el.id}`}
                  >
                    {el.name}
                  </a>
                </div>
                <div className={`w-[100%] flex flex-row`}>
                  <p className={`text-wrap break-all`}>
                    {el.body.length > 50
                      ? `${el.body.slice(0, 50)}...`
                      : el.body}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Articles;
