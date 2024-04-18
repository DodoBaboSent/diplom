import { useLoaderData } from "react-router-typesafe";
import { PanelLoader } from "./App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserPanel() {
  const data = useLoaderData<typeof PanelLoader>();

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
      </div>
    </>
  );
}

export default UserPanel;
