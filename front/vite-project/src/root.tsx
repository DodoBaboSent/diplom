import { useState } from "react";
import { Nav } from "./components/nav";

export function Root() {
  const [navClosed, setNavClosed] = useState(false);
  return (
    <>
      <Nav isClosed={navClosed} onClick={setNavClosed} />
      <div
        className={`grid-rows-[fit-content(100px)_1fr_auto] grid-cols-[[start-content]_2fr_[end-content_start-nav]_1fr_[end-nav]] h-[100vh] grid ${navClosed ? `animate-blur-in` : `blur-none`} divide-y`}
      >
        <div
          className={`col-start-1 col-end-3 flex bg-white flex-col sticky top-0 px-3 divide-y`}
        >
          <div className="basis-11/12 p-3">
            <h1 className="text-3xl font-bold">WebSite</h1>
          </div>
          <div className="p-3 basis-1/12">
            <button
              className={`lg:hidden`}
              onClick={() => setNavClosed(!navClosed)}
            >
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
          </div>
        </div>
        <div
          className={`items-center justify-start flex flex-col p-3 lg:col-start-1 lg:col-end-2 col-start-1 col-end-3`}
        >
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          <div>sdasdasdasdasdasdasdasdasda</div>
        </div>
        <div className="hidden lg:flex lg:flex-col lg:justify-start lg:items-center">
          <h1 className="text-3xl font-bold">Nav</h1>
        </div>
        <div className="bg-amber-500 col-start-1 col-end-3"></div>
      </div>
    </>
  );
}
