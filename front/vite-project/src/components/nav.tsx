import { Link } from "react-router-dom";

type NavProps = {
  isClosed: boolean;
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Nav(props: NavProps) {
  const closeNav = () => props.onClick(!props.isClosed);

  return (
    <>
      <div
        className={`${props.isClosed ? `fixed animate-slide-in h-[100%] flex flex-col` : `absolute w-[0px] overflow-hidden`}  z-50`}
      >
        <div
          className={`align-center flex flex-col whitespace-nowrap drop-shadow-[0_45px_45px_rgba(0,0,0,0.55)] overflow-hidden h-[100%] justify-start p-3 bg-slate-500 p-3 w-[75%]`}
        >
          <div className="flex flex-row mb-3">
            <h1 className="text-2xl basis-11/12 font-bold">Nav</h1>
            <button
              className={`basis-1/12 lg:hidden`}
              onClick={() => props.onClick(!props.isClosed)}
            >
              X
            </button>
          </div>
          <h2 className="text-xl">Lorem ipsum</h2>
          <Link to={`/about`} onClick={closeNav}>
            About
          </Link>
          <Link to={`/login`} onClick={closeNav}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
