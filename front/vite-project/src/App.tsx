import "./App.css";
import { Root } from "./root";
import { About } from "./About";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home";

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      handle: {},
      children: [
        {
          path: "about",
          element: <About />,
          handle: { crumb: () => <Link to="/about">About</Link> },
        },
        {
          index: true,
          element: <Home />,
          handle: {},
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
