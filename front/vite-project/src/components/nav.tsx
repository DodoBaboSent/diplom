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
            <h1 className="text-2xl basis-10/12 font-bold">Навигация</h1>
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
              <h1 className={`text-xl font-bold`}>Информация</h1>
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
                  О нас
                </Link>
              </li>
            </ul>
            <ul className={`list-inside`}>
              <h1 className={`text-xl font-bold`}>Мой аккаунт</h1>
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
                  Панель пользователя
                </Link>
              </li>
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
                  Поиск
                </Link>
              </li>
              <li>
                <Link to="/articles" onClick={closeNav}>
                  <svg
                    fill="#000000"
                    className={`inline-block`}
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width={15}
                    height={15}
                    viewBox="0 0 81.288 81.288"
                    xmlSpace="preserve"
                  >
                    <g id="bgCarrier" stroke-width="0"></g>
                    <g
                      id="tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path d="M38.379,39.885h0.935l-2.465,8.857h-0.878h-0.881l-1.422-6.969l-1.391,6.969h-0.88H30.52l-2.465-8.857h0.962h0.963 l1.476,6.48l1.269-6.48h0.98h0.989l1.277,6.432h0.002l1.469-6.432H38.379z M44.024,43.47c-0.89-0.196-1.466-0.364-1.741-0.513 c-0.278-0.144-0.416-0.35-0.416-0.618c0-0.37,0.133-0.657,0.396-0.867c0.265-0.205,0.633-0.311,1.104-0.311 c0.539,0,0.979,0.128,1.319,0.372c0.338,0.244,0.52,0.582,0.552,1.006h1.8c-0.066-0.89-0.415-1.594-1.038-2.114 c-0.62-0.526-1.423-0.786-2.419-0.786c-1.057,0-1.899,0.253-2.525,0.757c-0.623,0.505-0.934,1.191-0.934,2.043 c0,0.771,0.234,1.334,0.706,1.699c0.471,0.362,1.411,0.704,2.817,1.02c0.765,0.169,1.26,0.333,1.497,0.488 c0.237,0.154,0.355,0.405,0.355,0.734c0,0.342-0.164,0.6-0.499,0.791c-0.333,0.191-0.794,0.288-1.383,0.288 c-0.579,0-1.023-0.128-1.346-0.379c-0.319-0.253-0.49-0.62-0.511-1.088h-1.783c0.044,0.955,0.381,1.697,1.012,2.208 c0.631,0.524,1.507,0.78,2.627,0.78c1.12,0,1.996-0.242,2.658-0.73c0.654-0.488,0.98-1.145,0.98-1.979 c0-0.826-0.219-1.429-0.652-1.803C46.178,44.095,45.316,43.76,44.024,43.47z M47.419,38.357h-6.512v-5.715 c-0.946,0.464-2.002,0.726-3.104,0.726c-0.911,0-1.79-0.172-2.601-0.5v5.492h-3.805h-3.209h-6.407l1.027-3.747l0.76-2.761 c-0.682,0.265-1.413,0.423-2.177,0.423c-0.82,0-1.605-0.18-2.332-0.483l0.778,2.822l1.031,3.747h-9.481 c0-2.642,1.032-5.04,2.709-6.83v-5.663c0-4.492,3.269-8.133,7.297-8.133c4.034,0,7.3,3.646,7.3,8.133v5.663 c0.423,0.453,0.806,0.943,1.138,1.469c0.64-0.943,1.436-1.768,2.358-2.432c-0.401-0.535-0.735-1.13-0.976-1.781 c-0.778-0.037-1.406-0.859-1.406-1.866c0-0.769,0.372-1.425,0.916-1.703c-0.093-1.235,0.051-2.94,1.13-4.232 c0.557-0.664,1.286-1.179,2.023-1.509c-0.343-0.114-0.62-0.138-0.62-0.138c0.552-0.722,1.273-0.359,1.273-0.359 c0.167-1.049,1.023-1.467,1.023-1.467c-0.143,0.533-0.203,0.957-0.221,1.312c2.515-1.408,4.961-0.713,7.687,1.327 c1.98,1.478,1.996,3.695,1.844,5.05c0.554,0.268,0.933,0.934,0.933,1.709c0,1.006-0.63,1.83-1.409,1.866 c-0.239,0.647-0.57,1.243-0.973,1.778C45.838,32.308,47.419,35.146,47.419,38.357z M27.964,26.683c0-0.535-0.252-0.99-0.616-1.144 c-0.062,0.364-0.127,0.564-0.183,0.669c-0.009,0.028-0.023,0.047-0.038,0.06h-0.002c-0.051,0.065-0.1,0.065-0.14,0.065h-0.395 l0.215-0.254c-0.021-0.145-0.16-0.573-0.472-1.072c-0.14,0.107-0.306,0.191-0.504,0.248c-0.247,0.072-1.333,0.183-2.007-0.764 c-0.271-0.383-0.424-1.233-0.455-1.409c-0.542,1.047-1.425,1.538-2.497,1.333c-0.543-0.101-1.061-0.152-1.544-0.152 c-2.635,0-3.539,1.528-3.613,1.834l0.105,0.176l-0.248,0.051c-0.056,0.002-0.12,0.004-0.196-0.089v0.002 c0,0-0.002-0.004-0.002-0.009c-0.064-0.078-0.136-0.225-0.213-0.484c-0.206,0.224-0.329,0.556-0.329,0.93 c0,0.68,0.39,1.226,0.87,1.226l0.068-0.027l0.152-0.024l0.049,0.147c0.185,0.54,0.453,1.038,0.773,1.495 c0.567,0.79,1.324,1.418,2.198,1.833c0.75,0.356,1.584,0.561,2.452,0.561c0.813,0,1.589-0.185,2.299-0.497 c0.937-0.417,1.754-1.061,2.352-1.897c0.325-0.45,0.591-0.949,0.775-1.495l0.047-0.145l0.152,0.019 c0.038,0.007,0.067,0.019,0.086,0.027h0.002C27.576,27.911,27.964,27.358,27.964,26.683z M43.004,30.278 c0.421-0.548,0.753-1.172,0.986-1.852l0.063-0.192h0.002l0.203,0.029h0.005c0.023,0,0.042,0.009,0.059,0.016 c0.01,0.002,0.023,0.004,0.03,0.009c0.523-0.014,0.94-0.624,0.94-1.366c0-0.123-0.014-0.243-0.036-0.354 c-0.019-0.098-0.051-0.188-0.087-0.274c-0.005-0.009-0.005-0.025-0.009-0.04c-0.041-0.091-0.087-0.172-0.142-0.248 c-0.005-0.004-0.005-0.014-0.009-0.022c-0.049-0.059-0.097-0.111-0.146-0.159c-0.014-0.015-0.032-0.033-0.05-0.048 c-0.092,0.634-0.227,1.054-0.251,1.044c0.014-0.018,0.004-0.107-0.032-0.238c-0.055,0.145-0.104,0.243-0.125,0.238 c0.034-0.058,0.004-0.497-0.201-1.047c-0.346-0.658-0.972-1.499-1.99-2.123c-0.558-0.243-1.249-0.383-2.104-0.354 c-0.354,0.016-0.729,0.048-1.139,0.123c-1.437,0.265-2.191,0.509-3.686-0.521c-0.063,0.015-0.122,0.038-0.189,0.049 c-2.812,0.652-3.847,2.904-4.037,3.642c-0.033,0.129-0.044,0.216-0.028,0.236c-0.027,0.009-0.163-0.408-0.254-1.044 c-0.016,0.016-0.03,0.03-0.047,0.049c-0.053,0.049-0.103,0.1-0.147,0.159c-0.004,0.009-0.007,0.018-0.011,0.022 c-0.054,0.078-0.103,0.154-0.143,0.245c0,0.015-0.005,0.029-0.009,0.042c-0.033,0.086-0.062,0.173-0.084,0.274 c-0.023,0.109-0.035,0.233-0.035,0.352c0,0.746,0.423,1.353,0.942,1.367c0.007-0.005,0.021-0.007,0.03-0.009 c0.017-0.007,0.033-0.014,0.062-0.018c0.002,0,0.002,0,0.002,0l0.205-0.029l0.065,0.196c0.229,0.68,0.566,1.301,0.983,1.852 c0.5,0.655,1.114,1.212,1.815,1.633c0.252,0.152,0.516,0.288,0.79,0.406c0.8,0.345,1.685,0.54,2.597,0.54 c1.114,0,2.173-0.285,3.107-0.79c0.096-0.049,0.189-0.1,0.283-0.156C41.891,31.49,42.504,30.934,43.004,30.278z M22.41,44.862 h4.333V44.1v-0.758H22.41v-1.879h4.669v-0.796v-0.783h-6.521v8.857h6.727v-0.786V47.17H22.41V44.862z M17.054,39.885v6.218 l-3.555-6.218h-0.97h-0.972v8.857h0.869h0.865v-6.385l3.651,6.385h0.922h0.923v-8.857h-0.869H17.054z M18.908,25.882 c-0.282,0-0.528,0.167-0.638,0.415c-0.042,0.091-0.067,0.187-0.067,0.292c0,0.393,0.317,0.708,0.705,0.708 c0.392,0,0.708-0.316,0.708-0.708c0-0.105-0.026-0.201-0.065-0.292C19.436,26.05,19.193,25.882,18.908,25.882z M34.948,26.008 c-0.448,0-0.811,0.36-0.811,0.811c0,0.443,0.363,0.808,0.811,0.808c0.444,0,0.811-0.362,0.811-0.808 C35.759,26.373,35.395,26.008,34.948,26.008z M21.393,30.367c-0.208,0-0.406-0.024-0.598-0.049 c-0.467-0.068-0.871-0.216-1.166-0.417c0.103,0.162,0.278,0.297,0.475,0.417c0.341,0.203,0.787,0.336,1.289,0.336 c0.508,0,0.954-0.133,1.292-0.336c0.198-0.12,0.37-0.25,0.475-0.417c-0.292,0.201-0.702,0.343-1.164,0.417 C21.805,30.343,21.604,30.367,21.393,30.367z M40.657,26.008c-0.448,0-0.812,0.36-0.812,0.811c0,0.443,0.364,0.808,0.812,0.808 c0.446,0,0.811-0.362,0.811-0.808C41.468,26.373,41.103,26.008,40.657,26.008z M35.78,30.659c0.328,0.507,1.11,0.854,2.023,0.854 c0.917,0,1.695-0.348,2.024-0.854c-0.477,0.325-1.203,0.526-2.024,0.526C36.981,31.185,36.254,30.976,35.78,30.659z M23.882,25.882 c-0.285,0-0.526,0.167-0.639,0.415c-0.039,0.091-0.065,0.187-0.065,0.292c0,0.393,0.316,0.708,0.706,0.708 c0.392,0,0.707-0.316,0.707-0.708c0-0.105-0.025-0.201-0.065-0.292C24.411,26.05,24.17,25.882,23.882,25.882z M81.288,48.735 v13.176h-1.947v5.529h-2.017v3.772v0.493v1.633H58.359v-0.187v-1.939v-3.371h-1.647v-3.663H54.62v-4.143H2.686 C1.202,60.036,0,58.832,0,57.348V10.633C0,9.151,1.206,7.95,2.686,7.95h70.076c1.482,0,2.683,1.208,2.683,2.684v33.768h1.993v2.095 h1.982v2.244L81.288,48.735L81.288,48.735z M71.074,35.643c0,0.93,0.752,1.689,1.688,1.689c0.933,0,1.686-0.755,1.686-1.689 c0-0.925-0.753-1.684-1.686-1.684C71.826,33.959,71.074,34.718,71.074,35.643z M50.727,54h-1.645v-5.563h0.152h1.976h3.217v0.901 h1.916V33.401h2.021v-2.02h4.293v2.02h1.8v7.641h3.524v2.014h1.629h0.306h0.155V13.319H5.372v41.342h45.354V54z M79.16,48.872 h-2.261v-2.349h-1.455h-0.146v6.4h-2.126v-7.747h-3.1H69.92v6.401h-2.126v-8.413h-3.335v7.59h-2.131V33.503h-3.859v21.153v3.536 h-2.121v-3.536v-2.404h-2.026v-1.688h-3.106v3.108h1.643v0.983v0.961h2.021v3.818h1.875v0.595v3.068h2.095v4.491h1.646v3.622 h14.708v-5.57h2.017v-4.263h1.948V48.872H79.16z"></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>{" "}
                  Новости
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
