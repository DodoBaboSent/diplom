import { useLoaderData } from "react-router-typesafe";
import { PanelLoader } from "./App";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UserPanel() {
  const { data, admin } = useLoaderData<typeof PanelLoader>();

  const navigate = useNavigate();

  async function unstar(name: string) {
    const data = await axios
      .delete<{ status: string }>("/user/star", {
        data: {
          city: name,
        },
      })
      .then((res) => res.data)
      .catch(() => null);
    if (data?.status == "OK") {
      navigate("/panel", {
        replace: true,
      });
    }
  }

  return (
    <>
      <div className={`gap-3 flex flex-col p-3 w-[100%]`}>
        {data != undefined && data.cod == undefined ? (
          <>
            <h1 className={`text-2xl lg:text-3xl font-bold`}>
              Ваши отслеживаемые города
            </h1>
            {data !== undefined ? (
              <>
                <div className={`flex flex-col w-[100%] p-3 border`}>
                  <table className={`table-auto w-[100%] mb-2 border-collapse`}>
                    <thead>
                      <tr>
                        <th className={`border p-2`}>Название</th>
                        <th className={`border p-2`}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.cities.map((element) => {
                        return (
                          <>
                            <tr>
                              <td className={`border p-2`}>{element.name}</td>
                              <td className={`border p-2`}>
                                <button
                                  className={`bg-red-600 text-white font-bold p-2 rounded`}
                                  onClick={() => {
                                    unstar(element.name);
                                  }}
                                >
                                  Удалить
                                </button>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className={`bg-amber-200 p-3 my-2 rounded flex flex-col`}>
            <h1 className={`font-bold`}>{data!.warning!}</h1>
          </div>
        )}
        <div className={`bg-red-400 w-[100%] p-2 rounded`}>
          <Link to="/logout" className={`text-white font-bold`}>
            Выйти из аккаунта
          </Link>
        </div>
        {admin.admin == true ? (
          <div className={`bg-red-400 w-[100%] p-2 rounded`}>
            <Link to="/admin_panel" className={`text-white font-bold`}>
              Перейти в панель администратора
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default UserPanel;
