import "./App.css";
import { Root } from "./root";
import { About } from "./About";
import { LoaderFunction } from "react-router-typesafe";
import Home from "./Home";
import { useQuery } from "@tanstack/react-query";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import axios from "axios";

export const rootLoader = (() => {
  const { data, isSuccess } = useQuery({
    queryKey: ["todo"],
    queryFn: (): Promise<{ id: string; name: string; username: string }[]> =>
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.data),
  });
  if (isSuccess) {
    return { data };
  } else {
    return null;
  }
}) satisfies LoaderFunction;

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
          loader: rootLoader,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
