import { useLoaderData, useActionData } from "react-router-typesafe";
import { AdminAction, AdminLoader } from "./App";
import { Form } from "react-router-dom";
import { useState } from "react";

function AdminPanel() {
  const { data, users, news } = useLoaderData<typeof AdminLoader>();
  const err = useActionData<typeof AdminAction>();
  const [localUsers, setLocalUsers] = useState<typeof users>();
  const [localNews, setLocalNews] = useState<typeof news>();
  console.log(data);

  return (
    <>
      <h1 className={`font-bold text-3xl mb-2`}>Панель Администратора</h1>
      <h2 className={`text-2xl my-2`}>Пользователи</h2>
      <select
        className={`border p-2 w-[100%] lg:hidden`}
        onChange={(e) => {
          let newUsers = users?.filter(
            (el) => el.ID.toString() === e.currentTarget.value,
          );
          setLocalUsers(newUsers);
        }}
      >
        <option selected>Выберите пользователя</option>
        {users ? (
          users.map((el) => {
            return <option value={el.ID}>{el.Username}</option>;
          })
        ) : (
          <></>
        )}
      </select>
      {localUsers ? (
        localUsers.map((el) => {
          return (
            <div className={`flex flex-col gap-2 w-[100%] lg:hidden`}>
              <div className={`flex flex-row gap-2 px-2`}>
                <p className={`text-pretty`}>Username:</p>
                <p className={`text-pretty`}>{el.Username}</p>
              </div>
              <div className={`flex flex-row gap-2 px-2`}>
                <p className={`text-pretty`}>Email:</p>
                <p className={`text-pretty`}>{el.Email}</p>
              </div>
              <div className={`flex flex-row gap-2 px-2`}>
                <p className={`text-pretty`}>Active:</p>
                <p className={`text-pretty`}>
                  {el.act ? `Активирован` : `Неактивирован`}
                </p>
              </div>
              <div className={`flex flex-row gap-2 px-2`}>
                <p className={`text-pretty`}>Admin:</p>
                <p className={`text-pretty`}>
                  {el.adm ? `Администратор` : `Пользователь`}
                </p>
              </div>
              <div className={`flex flex-col gap-2 px-2`}>
                <p className={`text-pretty text-center`}>Действия</p>
                <div className={`flex flex-row gap-3`}>
                  <a
                    href={`/admin/userdel/${el.ID}`}
                    className={`bg-red-500 p-1 m-1 text-white font-bold`}
                  >
                    Удалить
                  </a>
                  {el.adm == false ? (
                    <a
                      href={`/admin/makeadm/${el.ID}`}
                      className={`bg-amber-500 p-1 m-1 text-white font-bold`}
                    >
                      Привелигировать
                    </a>
                  ) : (
                    <a
                      href={`/admin/remadm/${el.ID}`}
                      className={`bg-amber-500 p-1 m-1 text-white font-bold`}
                    >
                      Депривелигировать
                    </a>
                  )}
                  {el.act == false ? (
                    <a
                      href={`/admin/activate/${el.ID}`}
                      className={`bg-green-500 p-1 m-1 text-white font-bold`}
                    >
                      Активировать
                    </a>
                  ) : (
                    <a
                      href={`/admin/deactivate/${el.ID}`}
                      className={`bg-green-500 p-1 m-1 text-white font-bold`}
                    >
                      Деактивировать
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
      <table className={`border-collapse border hidden lg:table lg:w-[85%]`}>
        <thead>
          <tr>
            <th className={`border p-2`}>Username</th>
            <th className={`border p-2`}>Email</th>
            <th className={`border p-2`}>Active</th>
            <th className={`border p-2`}>Admin</th>
            <th className={`border p-2`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map((el) => {
              return (
                <>
                  <tr>
                    <td className={`border p-2`}>{el.Username}</td>
                    <td className={`border p-2`}>{el.Email}</td>
                    <td className={`border p-2`}>
                      {el.act ? `Активирован` : `Неактивирован`}
                    </td>
                    <td className={`border p-2`}>
                      {el.adm ? `Администратор` : `Пользователь`}
                    </td>
                    <td className={`border p-2`}>
                      <a
                        href={`/admin/userdel/${el.ID}`}
                        className={`bg-red-500 p-1 m-1 text-white font-bold`}
                      >
                        Удалить
                      </a>
                      {el.adm == false ? (
                        <a
                          href={`/admin/makeadm/${el.ID}`}
                          className={`bg-amber-500 p-1 m-1 text-white font-bold`}
                        >
                          Привелигировать
                        </a>
                      ) : (
                        <a
                          href={`/admin/remadm/${el.ID}`}
                          className={`bg-amber-500 p-1 m-1 text-white font-bold`}
                        >
                          Депривелигировать
                        </a>
                      )}
                      {el.act == false ? (
                        <a
                          href={`/admin/activate/${el.ID}`}
                          className={`bg-green-500 p-1 m-1 text-white font-bold`}
                        >
                          Активировать
                        </a>
                      ) : (
                        <a
                          href={`/admin/deactivate/${el.ID}`}
                          className={`bg-green-500 p-1 m-1 text-white font-bold`}
                        >
                          Деактивировать
                        </a>
                      )}
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <h2 className={`text-2xl my-2`}>Новости</h2>
      <select
        className={`border p-2 w-[100%] lg:hidden`}
        onChange={(e) => {
          let newArts = news?.filter(
            (el) => el.id.toString() === e.currentTarget.value,
          );
          setLocalNews(newArts);
        }}
      >
        <option selected>Выберите новость</option>
        {news ? (
          news.map((el) => {
            return <option value={el.id}>{el.name}</option>;
          })
        ) : (
          <></>
        )}
      </select>
      {localNews ? (
        localNews.map((el) => {
          return (
            <div className={`flex flex-col gap-2 p-2 w-[100%] lg:hidden`}>
              <div className={`flex flex-row gap-2 px-2`}>
                <p className={`text-pretty`}>Заголовок: </p>
                <p className={`text-pretty`}>{el.name}</p>
              </div>
              <div className={`flex flex-row gap-2 px-2`}>
                <p className={`text-pretty`}>Тело: </p>
                <p className={`text-pretty`}>
                  {el.body.length > 25 ? `${el.body.slice(0, 25)}...` : el.body}
                </p>
              </div>
              <div className={`flex flex-col gap-2 px-2`}>
                <p className={`text-pretty text-center`}>Действия</p>
                <div className={`flex flex-row gap-2`}>
                  <a
                    href={`/admin/articledel/${el.id}`}
                    className={`bg-red-500 p-1 m-1 text-white font-bold`}
                  >
                    Удалить
                  </a>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <></>
      )}
      <table className={`border-collapse border hidden lg:table lg:w-[85%]`}>
        <thead>
          <tr>
            <th className={`border p-2`}>Название</th>
            <th className={`border p-2`}>Тело</th>
            <th className={`border p-2`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {news ? (
            news.map((el) => {
              return (
                <>
                  <tr>
                    <td className={`border p-2`}>{el.name}</td>
                    <td className={`border p-2`}>
                      {el.body.length > 25
                        ? `${el.body.slice(0, 25)}...`
                        : el.body}
                    </td>
                    <td className={`border p-2`}>
                      <a
                        href={`/admin/articledel/${el.id}`}
                        className={`bg-red-500 p-1 m-1 text-white font-bold`}
                      >
                        Удалить
                      </a>
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <h2 className={`text-2xl my-2`}>Создать новость</h2>
      <Form className={`w-[100%] p-3 gap-3 flex flex-col`} method="post">
        <div className={`flex flex-col gap-3`}>
          <label htmlFor="name_id">Название </label>
          <input
            name="name"
            type="text"
            id="name_id"
            className={`border p-2`}
          />
        </div>
        <div className={`flex flex-col gap-3`}>
          <label htmlFor="cont_id">Название </label>
          <select id="cont_id" name="cont" className={`border p-2`}>
            <option value="eurasia">Евразия</option>
            <option value="northam">Северная Америка</option>
            <option value="southam">Южная Америка</option>
            <option value="africa">Африка</option>
          </select>
        </div>
        <div className={`flex flex-col gap-3`}>
          <label htmlFor="body_id">Текст </label>
          <textarea name="body" id="body_id" className={`border p-2`} />
        </div>
        <button type="submit" className={`bg-slate-300 p-3 lg:w-[30%]`}>
          Опубликовать
        </button>
      </Form>
      {err ? (
        <div className={`rounded p-3 bg-red-500`}>
          <p className={`font-bold text-white`}>{err.warning}</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default AdminPanel;
