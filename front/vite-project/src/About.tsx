import { useState } from "react";
import { Link } from "react-router-dom";

export function About() {
  const [waiver1Open, setWaiver1Open] = useState<boolean>(false);
  const [waiver2Open, setWaiver2Open] = useState<boolean>(false);

  return (
    <>
      <div className={`flex flex-col gap-3 divide-y w-[100%]`}>
        <h1 className={`font-bold text-3xl text-center`}>О нас</h1>
        <div className={`flex flex-col gap-2 w-[100%]`}>
          <p className={`text-pretty text-justify`}>
            Настоящим я заявляю, что все использованные в данном проекте
            материалы были предоставлены в соответствии с лицензией Creative
            Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) и не
            подвергались каким-либо изменениям или модификациям. Данный проект
            является исключительно учебным и не преследует коммерческих целей. Я
            не претендую на какие-либо исключительные права на содержание или
            материалы, использованные в проекте. Лицензия CC BY-SA 4.0 позволяет
            свободно распространять и модифицировать материалы при условии
            указания авторов оригинального произведения, сохранения ссылки на
            лицензию и распространения производных работ на тех же условиях.
            Таким образом, все материалы, включенные в данный проект, могут быть
            свободно использованы, распространены и модифицированы в
            соответствии с условиями лицензии. Я понимаю и признаю, что несу
            полную ответственность за использование любых материалов, защищенных
            авторским правом, в данном проекте. В случае нарушения каких-либо
            прав третьих лиц я беру на себя обязательство незамедлительно
            устранить такие нарушения. Настоящее заявление составлено в целях
            соблюдения требований законодательства об авторском праве и
            распространяется на весь контент, включенный в данный проект.
          </p>
          <a
            href="https://openweathermap.org/"
            className={`text-xl font-bold text-cyan-500 hover:underline`}
          >
            OpenWeatherMap
          </a>
          <div className={`flex flex-col w-[100%]`}>
            <button
              className={`bg-slate-400 p-2 w-[100%] text-white`}
              onClick={() => setWaiver1Open(!waiver1Open)}
            >
              {!waiver1Open ? (
                <svg
                  fill="#FFFFFF"
                  height={15}
                  width="15px"
                  className={`inline-block`}
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 330.002 330.002"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      id="XMLID_105_"
                      d="M324.001,209.25L173.997,96.75c-5.334-4-12.667-4-18,0L6.001,209.25c-6.627,4.971-7.971,14.373-3,21 c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001L164.998,127.5l141.003,105.75c6.629,4.972,16.03,3.627,21-3 C331.972,223.623,330.628,214.221,324.001,209.25z"
                    ></path>
                  </g>
                </svg>
              ) : (
                <svg
                  fill="#FFFFFF"
                  height="15px"
                  className={`inline-block`}
                  width="15px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 330 330"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      id="XMLID_102_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    ></path>{" "}
                  </g>
                </svg>
              )}{" "}
              Лицензия OpenWeatherMap
            </button>
            <div
              className={`${waiver1Open ? `animate-open-down h-[fit-content] p-2 border overflow-hidden` : `h-[0px] overflow-hidden`}`}
            >
              Лицензия{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0"
                className={`hover:underline text-cyan-500`}
              >
                CC BY-SA 4.0
              </a>
              <div
                className={`text-pretty text-justify p-1 border flex flex-col`}
              >
                Вы свободны:
                <ul className={`list-disc list-inside`}>
                  <li>
                    Делиться — копировать и распространять материал в любом
                    формате и для любых целей, даже коммерческих.
                  </li>
                  <li>
                    Адаптировать — ремиксировать, трансформировать и развивать
                    материал для любых целей, даже коммерческих.
                  </li>
                </ul>
                Лицензиар не может отменить эти свободы, пока вы следуете
                условиям лицензии. <br />
                При соблюдении следующих условий:
                <ul className={`list-disc list-inside`}>
                  <li>
                    Атрибуция — Вы должны предоставить соответствующие ссылки,
                    предоставить ссылку на лицензию и указать, были ли внесены
                    изменения. Вы можете сделать это любым разумным способом, но
                    не таким образом, который может создать впечатление, что
                    лицензиар одобряет вас или ваше использование.
                  </li>
                  <li>
                    СохранениеУсловий — Если вы ремиксируете, трансформируете
                    или развиваете материал, вы должны распространять ваши
                    вклады по той же лицензии, что и оригинальный материал.
                  </li>
                  <li>
                    Без дополнительных ограничений — Вы не можете применять
                    юридические условия или технологические меры, которые
                    юридически ограничивают других от выполнения того, что
                    разрешено по лицензии.
                  </li>
                </ul>
                Уведомления: <br />
                Вам не нужно соблюдать лицензию для элементов материала,
                находящихся в общественном достоянии или в тех случаях, когда
                ваше использование разрешено применимым исключением или
                ограничением. <br />
                Никаких гарантий не предоставляется. Лицензия может не давать
                вам всех прав, необходимых для вашего предполагаемого
                использования. Например, другие права, такие как право на
                публичность, неприкосновенность частной жизни или моральные
                права, могут ограничивать ваше использование материала
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt"
                  className={`font-bold text-xl text-cyan-500 hover:underline`}
                >
                  ПОЛНЫЙ ТЕКСТ ЛИЦЕНЗИИ В PLAIN TEXT
                </a>
              </div>
            </div>
          </div>
          <div className={`flex flex-col w-[100%]`}>
            <button
              className={`bg-slate-400 p-2 w-[100%] text-white`}
              onClick={() => setWaiver2Open(!waiver2Open)}
            >
              {!waiver2Open ? (
                <svg
                  fill="#FFFFFF"
                  height={15}
                  width="15px"
                  className={`inline-block`}
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 330.002 330.002"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      id="XMLID_105_"
                      d="M324.001,209.25L173.997,96.75c-5.334-4-12.667-4-18,0L6.001,209.25c-6.627,4.971-7.971,14.373-3,21 c2.947,3.93,7.451,6.001,12.012,6.001c3.131,0,6.29-0.978,8.988-3.001L164.998,127.5l141.003,105.75c6.629,4.972,16.03,3.627,21-3 C331.972,223.623,330.628,214.221,324.001,209.25z"
                    ></path>
                  </g>
                </svg>
              ) : (
                <svg
                  fill="#FFFFFF"
                  height="15px"
                  className={`inline-block`}
                  width="15px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 330 330"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      id="XMLID_102_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    ></path>{" "}
                  </g>
                </svg>
              )}{" "}
              Лицензия ODbL
            </button>
            <div
              className={`${waiver2Open ? `animate-open-down h-[fit-content] p-2 border overflow-hidden` : `h-[0px] overflow-hidden`}`}
            >
              Лицензия{" "}
              <a
                href="https://opendatacommons.org/licenses/odbl/summary/"
                className={`hover:underline text-cyan-500`}
              >
                ODbL
              </a>
              <div
                className={`text-pretty text-justify p-1 border flex flex-col`}
              >
                Это человеко-читаемое резюме лицензии ODbL 1.0. Пожалуйста,
                ознакомьтесь с отказом от ответственности ниже. <br />
                Вы свободны:
                <ul className={`list-disc list-inside`}>
                  <li>
                    Делиться: копировать, распространять и использовать базу
                    данных.
                  </li>
                  <li>Создавать: производить работы из базы данных.</li>
                  <li>
                    Адаптировать: модифицировать, трансформировать и развивать
                    базу данных.
                  </li>
                </ul>
                При условии, что вы:
                <ul className={`list-disc list-inside`}>
                  <li>
                    Атрибутируете: вы должны атрибутировать любое публичное
                    использование базы данных или произведений, созданных из
                    базы данных, в соответствии с указаниями в ODbL. Для любого
                    использования или распространения базы данных или
                    произведений, созданных из нее, вы должны четко указать
                    другим лицензию базы данных и сохранить все уведомления из
                    оригинальной базы данных.
                  </li>
                  <li>
                    Сохраняете условия: если вы публично используете любую
                    адаптированную версию этой базы данных или произведения,
                    созданные из адаптированной базы данных, вы также должны
                    предложить эту адаптированную базу данных по лицензии ODbL.
                  </li>
                  <li>
                    Сохраняете открытость: если вы распространяете базу данных
                    или ее адаптированную версию, вы можете использовать
                    технологические меры, ограничивающие доступ к работе (такие
                    как DRM), только если вы также распространяете версию без
                    таких мер.
                  </li>
                </ul>
                Отказ от ответственности <br />
                Это не лицензия. Это просто удобная справка для понимания ODbL
                1.0 - это человеко-читаемое выражение некоторых ее ключевых
                условий. Этот документ не имеет юридической силы, и его
                содержание не появляется в фактической лицензии. Ознакомьтесь с
                полным текстом лицензии{" "}
                <a
                  href="https://opendatacommons.org/licenses/odbl/1-0/"
                  className={`font-bold text-cyan-500 inline-block text-xl hover:underline`}
                >
                  ODbL 1.0
                </a>{" "}
                для точных применимых условий
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/`} className={`mt-3 text-xl hover:underline`}>
        Домой
      </Link>
    </>
  );
}
