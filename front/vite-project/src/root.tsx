import { useState } from "react";
import { Nav } from "./components/nav";
import Breadcrumbs from "./components/breadcrumbs";
import { Link, Outlet } from "react-router-dom";

export function Root() {
  const [navClosed, setNavClosed] = useState(false);

  return (
    <>
      <Nav isClosed={navClosed} onClick={setNavClosed} />
      <div
        className={`grid-rows-[fit-content(100px)_max(100%,_83.3vh)_100px] grid-cols-[[start-content]_2fr_[end-content_start-nav]_1fr_[end-nav]] h-[100%] grid ${navClosed ? `animate-blur-in` : `blur-none`} divide-y`}
      >
        <div
          className={`col-start-1 col-end-3 flex bg-white flex-col sticky z-50 top-0 px-3 divide-y`}
        >
          <div className="basis-11/12 flex flex-row gap-3 p-3">
            <h1 className="text-3xl font-bold">WebSite</h1>
            <div
              className={`hidden lg:flex lg:flex-row lg:text-2xl lg:items-center`}
            >
              <Breadcrumbs />
            </div>
          </div>
          <div className={`p-3 basis-1/12 lg:hidden flex flex-row gap-3`}>
            <button onClick={() => setNavClosed(!navClosed)}>
              <svg width={`24`} height={`24`}>
                <path
                  d="M5 6h14M5 12h14M5 18h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
            <Breadcrumbs />
          </div>
        </div>
        <div
          className={`items-center justify-start flex flex-col p-3 lg:col-end-2 col-start-1 col-end-3`}
        >
          <Outlet />
        </div>
        <div className="hidden lg:flex lg:flex-col lg:border-l lg:justify-start gap-4 lg:items-center">
          <h1 className="text-3xl font-bold">Навигация</h1>
          <ol className={`flex flex-col gap-2 text-xl divide-y w-[100%] px-1`}>
            <li>
              <Link to="/about" className={`text-left`}>
                О нас
              </Link>
            </li>
            <li>
              <Link to="/login" className={`text-left`}>
                Мой аккаунт
              </Link>
            </li>
            <li>
              <Link to="/search" className={`text-left`}>
                Поиск
              </Link>
            </li>
            <li>
              <Link to="/articles" className={`text-left`}>
                Новости
              </Link>
            </li>
          </ol>
        </div>
        <div className="col-start-1 col-end-3">
          <div className={`w-[100%] h-[100%] flex flex-row`}>
            <div className={`w-[100%] h-[100%] flex flex-col basis-1/3`}></div>
            <div className={`w-[100%] h-[100%] flex flex-col basis-1/3`}>
              <p className={`text-slate-300 text-center`}>
                Наугольнов Артём Игоревич 2024
              </p>
            </div>
            <div className={`w-[100%] h-[100%] flex flex-col basis-1/3`}></div>
          </div>
        </div>
      </div>
    </>
  );
}
