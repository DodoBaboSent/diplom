import { useLoaderData } from "react-router-typesafe";
import { ArticleLoader } from "./App";

function Article() {
  const article = useLoaderData<typeof ArticleLoader>();

  return (
    <>
      {article ? (
        <div className={`flex flex-col w-[100%] gap-3 divide-y`}>
          <h1 className={`text-3xl font-bold`}>{article.name}</h1>
          <p className={`text-wrap break-all`}>{article.body}</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Article;
