import { useActionData, useLoaderData } from "react-router-typesafe";
import { ArticleLoader, ArticleAction } from "./App";
import { Form, useSubmit } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

function Article() {
  const article = useLoaderData<typeof ArticleLoader>();
  const data = useActionData<typeof ArticleAction>();
  const token: string = cookies.get("token");
  let privObj: { username: string; active: boolean; adm: boolean };
  if (token) {
    const tokenParse = token.split(".");
    console.log(tokenParse);
    privObj = JSON.parse(atob(tokenParse[1]));
  } else {
    privObj = {
      username: "Not logged in",
      active: false,
      adm: false,
    };
  }

  const submit = useSubmit();
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    submit(e.currentTarget.form);
    e.currentTarget.form?.reset();
  };

  return (
    <div className={`flex flex-col gap-3 w-[100%]`}>
      <div className={`flex flex-col gap-3 divide-y w-[100%]`}>
        {article ? (
          <div className={`flex flex-col w-[100%] gap-3 divide-y`}>
            <h1 className={`text-3xl font-bold`}>{article.name}</h1>
            <p className={`text-wrap break-all`}>{article.body}</p>
          </div>
        ) : (
          <></>
        )}
        <Form className={`flex flex-col gap-3 p-3 w-[100%]`} method="post">
          <input
            name="article"
            id="article_id"
            value={article?.id}
            hidden
          ></input>
          <div className={`flex flex-col gap-3`}>
            <label className={`font-bold`}>User: {privObj.username}</label>
            <label htmlFor="text_id">Text </label>
            <input
              name="text"
              type="text"
              id="text_id"
              className={`border p-2`}
              hidden={!privObj.active}
            />
          </div>
          <button
            className={`rounded bg-green-400 font-bold`}
            onClick={handleSubmit}
            disabled={!privObj.active}
          >
            {privObj.active ? `Submit` : `Войдите что бы отвечать`}
          </button>
        </Form>
      </div>
      {data && data.warning ? (
        <div className={`rounded bg-red-500 p-3`}>
          <h1 className={`text-white font-bold`}>{data.warning}</h1>
        </div>
      ) : (
        <></>
      )}
      {article ? (
        article.rep.map((el) => {
          return (
            <div className={`gap-3 flex flex-col`}>
              <div className={`flex flex-col divide-y gap-2`}>
                <div className={`flex flex-row w-[100%]`}>
                  <h3 className={`font-bold`}>{el.username}</h3>
                  {privObj.adm ? (
                    <button
                      onClick={() => {
                        axios.get(`/admin/delrep/${el.id}`);
                        window.location.reload();
                      }}
                      className={`font-bold text-white mx-3 p-1 rounded bg-red-500`}
                    >
                      Delete
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <p className={`break-all text-wrap`}>{el.text}</p>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}

export default Article;
