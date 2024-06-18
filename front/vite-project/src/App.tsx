import "./App.css";
import { Root } from "./root";
import { About } from "./About";
import { makeAction, makeLoader } from "react-router-typesafe";
import Home, { OWMRes } from "./Home";
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
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
import AdminPanel from "./AdminPanel";
import Articles from "./Articles";
import Article from "./Article";

const cookies = new Cookies();

export let AdminAction = makeAction(async function ({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const body = formData.get("body");
  const continent = formData.get("cont");
  if (
    typeof name != "string" ||
    name == "" ||
    typeof body != "string" ||
    body == "" ||
    typeof continent != "string" ||
    continent == ""
  ) {
    const err: { warning: string } = { warning: "Поля заполнены неправильно" };
    return err;
  }
  const success = await axios
    .post("/admin/new_article", {
      name: name,
      body: body,
      cont: continent,
    })
    .then(() => true)
    .catch(() => false);
  if (success == true) {
    return redirect("/articles");
  } else {
    const err: { warning: string } = { warning: "Не удалось создать новость" };
    return err;
  }
});

export let AdminLoader = makeLoader(async function () {
  const data = await axios
    .get<{ admin: boolean }>("/user/checkAdmin")
    .then((res) => res.data)
    .catch(() => {
      return { admin: false };
    });

  if (data) {
    if (data.admin == false || data.admin == undefined || data.admin == null) {
      return redirect("/login");
    } else {
      const users = await axios
        .get<
          {
            ID: number;
            CreatedAt?: string;
            UpdatedAt?: string;
            DeletedAt?: string;
            Username: string;
            Email: string;
            act: boolean;
            adm: boolean;
          }[]
        >("/admin/users")
        .then((res) => res.data)
        .catch(() => undefined);
      const news = await axios
        .get<{ id: string; name: string; body: string }[]>("/news")
        .then((res) => res.data)
        .catch(() => undefined);
      return { data, users, news };
    }
  }
  return redirect("/login");
});

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

export let ArticlesLoader = makeLoader(async function () {
  const articles = await axios
    .get<{ id: string; name: string; body: string; cont: string }[]>("/news")
    .then((res) => res.data)
    .catch(() => null);
  return articles;
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

export let ArticleLoader = makeLoader(async function ({
  params,
}: LoaderFunctionArgs) {
  const id = params.articleId;
  const article = await axios
    .get<{
      id: number;
      name: string;
      body: string;
      rep: { id: number; text: string; userid: number; username: string }[];
      cont: string;
    }>(`/getart/${id}`)
    .then((res) => res.data)
    .catch(() => null);
  if (article) {
    article.rep.reverse();
  }
  return article;
});
export let ArticleAction = makeAction(async function ({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text");
  const id = formData.get("article");
  if (
    typeof text != "string" ||
    text == "" ||
    text == undefined ||
    text == null ||
    typeof id != "string" ||
    id == "" ||
    id == null ||
    id == undefined
  ) {
    const err: { warning: string } = { warning: "Поля заполнены неверно" };
    return err;
  }
  const success = await axios
    .post(`/newcomment`, {
      article: id,
      text: text,
    })
    .then(() => true)
    .catch(() => false);
  if (success == true) {
    return redirect(`/article/${id}`);
  } else {
    const err: { warning: string } = {
      warning: "Не удалось оставить комментарий",
    };
    return err;
  }
});

export let PanelLoader = makeLoader(async function () {
  const data = await axios
    .get<{ cities: { name: string }[]; warning?: string; cod?: number }>(
      "/user/star",
    )
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return {
        cities: [],
        warning: "Не удалось загрузить данные с сервера",
        cod: 15,
      };
    });
  const admin = await axios
    .get<{ admin: boolean }>("/user/checkAdmin")
    .then((res) => res.data)
    .catch(() => {
      return { admin: false };
    });
  if (data.cod == 15) {
    return redirect("/login");
  }
  return { data, admin };
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
    return { message: "Неверный логин или пароль" };
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
          handle: { crumb: () => <Link to="/about">О нас</Link> },
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
          handle: { crumb: () => <Link to="/login">Войти</Link> },
          action: LoginAction,
          loader: LoginLoader,
        },
        {
          path: "panel",
          element: <UserPanel />,
          handle: { crumb: () => <Link to="/panel">Панель пользователя</Link> },
          loader: PanelLoader,
        },
        {
          path: "search",
          element: <Search />,
          handle: { crumb: () => <Link to="/search">Поиск</Link> },
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
          handle: { crumb: () => <Link to="/newUser">Регистрация</Link> },
        },
        {
          path: "admin_panel",
          element: <AdminPanel />,
          handle: {
            crumb: () => <Link to="/admin_panel">Администрирование</Link>,
          },
          loader: AdminLoader,
          action: AdminAction,
        },
        {
          path: "articles",
          handle: { crumb: () => <Link to="/articles">Новости</Link> },
          element: <Articles />,
          loader: ArticlesLoader,
        },
        {
          path: "/article/:articleId",
          element: <Article />,
          handle: { crumb: () => <p>Статья</p> },
          loader: ArticleLoader,
          action: ArticleAction,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
