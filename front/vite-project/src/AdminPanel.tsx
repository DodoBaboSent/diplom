import { useLoaderData, useActionData } from "react-router-typesafe";
import { AdminAction, AdminLoader } from "./App";
import { Form } from "react-router-dom";

function AdminPanel() {
  const { data, users, news } = useLoaderData<typeof AdminLoader>();
  const err = useActionData<typeof AdminAction>();
  console.log(data.admin);

  return (
    <>
      <h1 className={`font-bold text-3xl mb-2`}>Панель Администратора</h1>
      <h2 className={`text-2xl my-2`}>Пользователи</h2>
      <table className={`border-collapse border w-[85%]`}>
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
      <table className={`border-collapse border w-[85%]`}>
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
          <label htmlFor="body_id">Текст </label>
          <textarea name="body" id="body_id" className={`border p-2`} />
        </div>
        <button type="submit" className={`bg-slate-300 p-3 w-[30%]`}>
          Submit
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
