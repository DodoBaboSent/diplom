import { useState } from "react";
import { Link } from "react-router-dom";

export function Nav() {
  const [navClosed, setNavClosed] = useState(false);

  return (
    <>
      <div
        className={`${navClosed ? `fixed animate-slide-in h-[100%] flex flex-col` : `absolute w-[0px] overflow-hidden`}  z-50`}
      >
        <div
          className={`align-center whitespace-nowrap drop-shadow-[0_45px_45px_rgba(0,0,0,0.55)] overflow-hidden h-[100%] justify-start p-3 bg-slate-500 p-3 w-[75%]`}
        >
          <div className="flex flex-row mb-3">
            <h1 className="text-2xl basis-11/12 font-bold">Nav</h1>
            <button
              className={`basis-1/12 lg:hidden`}
              onClick={() => setNavClosed(!navClosed)}
            >
              X
            </button>
          </div>
          <h2 className="text-xl">Lorem ipsum</h2>
          <Link to={`/about`}>About</Link>
        </div>
      </div>
      <button className={`lg:hidden`} onClick={() => setNavClosed(!navClosed)}>
        <svg width={`24`} height={`24`}>
          <path
            d="M5 6h14M5 12h14M5 18h14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          ></path>
        </svg>
      </button>
    </>
  );
}
