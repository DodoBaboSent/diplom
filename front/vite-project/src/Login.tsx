import { Form, Link } from "react-router-dom";
import { useActionData } from "react-router-typesafe";
import { LoginAction } from "./App";

function Login() {
  const actionData = useActionData<typeof LoginAction>();

  return (
    <>
      <Form className={`flex flex-col gap-3`} method="post">
        <div className={`flex flex-col gap-3`}>
          <label htmlFor="username_id">Имя пользователя</label>
          <input
            name="username"
            type="text"
            id="username_id"
            className={`border p-2`}
          />

          <label htmlFor="password_id">Пароль</label>
          <input
            name="password"
            type="password"
            id="password_id"
            className={`border p-2`}
          />
        </div>
        <button type="submit" className={`bg-slate-300 p-3 w-[100%]`}>
          Войти
        </button>
      </Form>
      {actionData && actionData.message ? (
        <div className={`bg-red p-3 flex flex-col`}>
          <p className={`text-white font-bold`}>{actionData.message}</p>
        </div>
      ) : (
        <></>
      )}
      <Link to="/newUser">Зарегистрировать новый аккаунт</Link>
    </>
  );
}

export default Login;
