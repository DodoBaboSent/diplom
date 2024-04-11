import "./App.css";
import { Root } from "./root";
import { About } from "./About";
import { makeAction, makeLoader } from "react-router-typesafe";
import Home from "./Home";
import {
  ActionFunctionArgs,
  Link,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import UserPanel from "./UserPanel";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export let LoginLoader = makeLoader(async function () {
  const tkn: string = cookies.get("token");
  if (tkn == "" || tkn == null || tkn.length == 0) {
    return redirect("/login");
  }
  const data = await axios.get("/refresh");
  if (data.status == 200) {
    return redirect("/panel");
  } else {
    return redirect("/login");
  }
  return null;
});

export let PanelLoader = makeLoader(async function () {
  const data = await axios
    .get("/refresh")
    .then((res) => res.data)
    .catch(() => null);
  return data;
});

export let LoginAction = makeAction(async function ({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  let success = false;
  try {
    await axios
      .post("/jwt", {
        username: username,
        password: password,
      })
      .then(() => {
        success = true;
      });
  } catch (err) {
    console.log(err);
  }
  if (success) {
    console.log("success");
    return redirect("/panel");
  } else {
    return null;
  }
});

function App() {
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
        {
          path: "login",
          element: <Login />,
          handle: { crumb: () => <Link to="/login">Login</Link> },
          action: LoginAction,
          loader: LoginLoader,
        },
        {
          path: "panel",
          element: <UserPanel />,
          handle: { crumb: () => <Link to="/panel">Panel</Link> },
          loader: PanelLoader,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
