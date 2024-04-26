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
          className={`align-center flex flex-col divide-y whitespace-nowrap drop-shadow-[0_45px_45px_rgba(0,0,0,0.55)] overflow-hidden h-[100%] justify-start w-[75%] bg-white`}
        >
          <div className="flex flex-row p-3">
            <h1 className="text-2xl basis-10/12 font-bold">Nav</h1>
            <Link
              to="/"
              onClick={closeNav}
              className={`basis-1/12 flex flex-col justify-center`}
            >
              <svg
                width={20}
                height={20}
                className={`inline-block`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="bgCarrier" strokeWidth="0"></g>
                <g
                  id="tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="iconCarrier">
                  {" "}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.18753 11.3788C4.03002 11.759 4 11.9533 4 12V20.0018C4 20.5529 4.44652 21 5 21H8V15C8 13.8954 8.89543 13 10 13H14C15.1046 13 16 13.8954 16 15V21H19C19.5535 21 20 20.5529 20 20.0018V12C20 11.9533 19.97 11.759 19.8125 11.3788C19.6662 11.0256 19.4443 10.5926 19.1547 10.1025C18.5764 9.1238 17.765 7.97999 16.8568 6.89018C15.9465 5.79788 14.9639 4.78969 14.0502 4.06454C13.5935 3.70204 13.1736 3.42608 12.8055 3.2444C12.429 3.05862 12.1641 3 12 3C11.8359 3 11.571 3.05862 11.1945 3.2444C10.8264 3.42608 10.4065 3.70204 9.94978 4.06454C9.03609 4.78969 8.05348 5.79788 7.14322 6.89018C6.23505 7.97999 5.42361 9.1238 4.8453 10.1025C4.55568 10.5926 4.33385 11.0256 4.18753 11.3788ZM10.3094 1.45091C10.8353 1.19138 11.4141 1 12 1C12.5859 1 13.1647 1.19138 13.6906 1.45091C14.2248 1.71454 14.7659 2.07921 15.2935 2.49796C16.3486 3.33531 17.4285 4.45212 18.3932 5.60982C19.3601 6.77001 20.2361 8.0012 20.8766 9.08502C21.1963 9.62614 21.4667 10.1462 21.6602 10.6134C21.8425 11.0535 22 11.5467 22 12V20.0018C22 21.6599 20.6557 23 19 23H16C14.8954 23 14 22.1046 14 21V15H10V21C10 22.1046 9.10457 23 8 23H5C3.34434 23 2 21.6599 2 20.0018V12C2 11.5467 2.15748 11.0535 2.33982 10.6134C2.53334 10.1462 2.80369 9.62614 3.12345 9.08502C3.76389 8.0012 4.63995 6.77001 5.60678 5.60982C6.57152 4.45212 7.65141 3.33531 8.70647 2.49796C9.2341 2.07921 9.77521 1.71454 10.3094 1.45091Z"
                    fill="#000000"
                  ></path>{" "}
                </g>
              </svg>
            </Link>
            <button className={`basis-1/12 lg:hidden`} onClick={closeNav}>
              <svg
                width={15}
                height={15}
                viewBox="0 0 25 25"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#000000"
              >
                <g id="bgCarrier" strokeWidth="0"></g>
                <g
                  id="tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="iconCarrier">
                  <g
                    id="Page-1"
                    strokeWidth="0.00025"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Icon-Set-Filled"
                      transform="translate(-469.000000, -1041.000000)"
                      fill="#000000"
                    >
                      <path
                        d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48"
                        id="cross"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
          <div className={`flex flex-col gap-3 p-3`}>
            <ul className={`list-inside`}>
              <h1 className={`text-xl font-bold`}>Information</h1>
              <li className={`indent-3`}>
                <Link to={`/about`} onClick={closeNav}>
                  <svg
                    width={15}
                    height={15}
                    className={`inline-block mr-2`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="bgCarrier" strokeWidth="0"></g>
                    <g
                      id="tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="iconCarrier">
                      {" "}
                      <g id="Warning / Info">
                        {" "}
                        <path
                          id="Vector"
                          d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                  About
                </Link>
              </li>
            </ul>
            <ul className={`list-inside`}>
              <h1 className={`text-xl font-bold`}>User</h1>
              <li className={`indent-3`}>
                <Link to={`/login`} onClick={closeNav}>
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`inline-block mr-2`}
                  >
                    <g id="bgCarrier" strokeWidth="0"></g>
                    <g
                      id="tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="iconCarrier">
                      <path
                        d="M13 2C10.2386 2 8 4.23858 8 7C8 7.55228 8.44772 8 9 8C9.55228 8 10 7.55228 10 7C10 5.34315 11.3431 4 13 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H13C11.3431 20 10 18.6569 10 17C10 16.4477 9.55228 16 9 16C8.44772 16 8 16.4477 8 17C8 19.7614 10.2386 22 13 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H13Z"
                        fill="#000000"
                      ></path>
                      <path
                        d="M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11.2821C11.1931 13.1098 11.1078 13.2163 11.0271 13.318C10.7816 13.6277 10.5738 13.8996 10.427 14.0945C10.3536 14.1921 10.2952 14.2705 10.255 14.3251L10.2084 14.3884L10.1959 14.4055L10.1915 14.4115C10.1914 14.4116 10.191 14.4122 11 15L10.1915 14.4115C9.86687 14.8583 9.96541 15.4844 10.4122 15.809C10.859 16.1336 11.4843 16.0346 11.809 15.5879L11.8118 15.584L11.822 15.57L11.8638 15.5132C11.9007 15.4632 11.9553 15.3897 12.0247 15.2975C12.1637 15.113 12.3612 14.8546 12.5942 14.5606C13.0655 13.9663 13.6623 13.2519 14.2071 12.7071L14.9142 12L14.2071 11.2929C13.6623 10.7481 13.0655 10.0337 12.5942 9.43937C12.3612 9.14542 12.1637 8.88702 12.0247 8.7025C11.9553 8.61033 11.9007 8.53682 11.8638 8.48679L11.822 8.43002L11.8118 8.41602L11.8095 8.41281C11.4848 7.96606 10.859 7.86637 10.4122 8.19098C9.96541 8.51561 9.86636 9.14098 10.191 9.58778L11 9C10.191 9.58778 10.1909 9.58773 10.191 9.58778L10.1925 9.58985L10.1959 9.59454L10.2084 9.61162L10.255 9.67492C10.2952 9.72946 10.3536 9.80795 10.427 9.90549C10.5738 10.1004 10.7816 10.3723 11.0271 10.682C11.1078 10.7837 11.1931 10.8902 11.2821 11H3Z"
                        fill="#000000"
                      ></path>
                    </g>
                  </svg>
                  User Panel
                </Link>
              </li>
            </ul>
            <li>
              <Link to="/search" onClick={closeNav}>
                <svg
                  width={20}
                  className={`inline-block`}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="bgCarrier" stroke-width="0"></g>
                  <g
                    id="tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="iconCarrier">
                    {" "}
                    <path
                      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
                Search
              </Link>
            </li>
          </div>
        </div>
      </div>
    </>
  );
}
