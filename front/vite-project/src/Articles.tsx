import { useLoaderData } from "react-router-typesafe";
import { ArticlesLoader } from "./App";

function Articles() {
  const articles = useLoaderData<typeof ArticlesLoader>();

  return (
    <>
      <h1 className={`text-3xl font-bold mb-2`}>Архив новостей</h1>
      <div className={`flex flex-col gap-3 w-[100%]`}>
        {articles ? (
          articles.map((el) => {
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
