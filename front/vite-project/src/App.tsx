import "./App.css";
import { Root } from "./root";
import { About } from "./About";
import { makeAction, makeLoader } from "react-router-typesafe";
import Home, { OWMRes } from "./Home";
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
import Search from "./Search";
import Register from "./Register";

const cookies = new Cookies();

export let IndexAction = makeAction(async function ({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const city = formData.get("city");

  const data = await axios
    .get<OWMRes>("/weather", {
      params: {
        city: city,
      },
    })
    .then((res) => res.data);
  return data;
});

export let SearchAction = makeAction(async function ({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const city = formData.get("city");

  const data = await axios
    .get<OWMRes>("/weather", {
      params: {
        city: city,
      },
    })
    .then((res) => res.data);
  return data;
});

export let LoginLoader = makeLoader(async function () {
  const tkn: string = cookies.get("token");
  if (tkn == "" || tkn == null || tkn.length == 0) {
    return null;
  }
  let success = false;
  try {
    await axios.get("/refresh").then((res) => {
      console.log(res.status);
      if (res.status == 200) {
        console.log("promise success");
        success = true;
      } else {
        console.log("promise fail");
        success = false;
      }
    });
  } catch (err) {
    console.log(err);
  }
  if (success) {
    console.log(success);
    return redirect("/panel");
  } else {
    console.log(success);
    return null;
  }
});

export let RegisterAction = makeAction(async function ({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const mail = formData.get("mail");
  let success: { success: boolean; message?: string } = { success: false };
  await axios
    .post("/register", {
      username: username,
      password: password,
      mail: mail,
    })
    .then(() => {
      success = { success: true };
    })
    .catch((reason) => {
      success = { success: false, message: reason.response.data };
    });
  if (success.success) {
    return redirect("/panel");
  } else {
    return success.message;
  }
  return success.message;
});

export let PanelLoader = makeLoader(async function () {
  const data = await axios
    .get<{ cities: { name: string }[]; warning?: string; cod?: number }>(
      "/user/star",
    )
    .then((res) => {
      return res.data;
    })
    .catch((reason) => console.log(reason));
  console.log(data);
  return data;
});

export let IndexLoader = makeLoader(async function () {
  const token = cookies.get("token");
  if (token) {
    let prefs = await axios
      .get<{ city: string }>("/user/get")
      .then((res) => res.data)
      .catch(() => null);
    let stars = await axios
      .get<{ cities: { name: string }[] }>("/user/star")
      .then((res) => res.data)
      .catch(() => null);

    if ((prefs as any).cod != undefined) {
      prefs = null;
    }
    if ((stars as any).cod != undefined) {
      stars = null;
    }

    return { prefs, stars };
  } else {
    return null;
  }
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
export let LogoutLoader = makeLoader(async function () {
  let success = false;
  await axios
    .get("/token/logout")
    .then((res) => {
      if (res.status == 200) {
        success = true;
      }
    })
    .catch(() => null);
  if (success) {
    return redirect("/login");
  }
  return redirect("/");
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
          loader: IndexLoader,
          action: IndexAction,
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
        {
          path: "search",
          element: <Search />,
          handle: { crumb: () => <Link to="/search">Search</Link> },
          action: SearchAction,
        },
        {
          path: "logout",
          loader: LogoutLoader,
          handle: {},
        },
        {
          path: "newUser",
          element: <Register />,
          action: RegisterAction,
          handle: { crumb: () => <Link to="/newUser">Register</Link> },
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
