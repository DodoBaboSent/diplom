import { Form } from "react-router-dom";

function Login() {
  return (
    <>
      <Form className={`flex flex-col gap-3`} method="post">
        <div className={`flex flex-col gap-3`}>
          <label htmlFor="username_id">Username </label>
          <input
            name="username"
            type="text"
            id="username_id"
            className={`border p-2`}
          />

          <label htmlFor="password_id">Password </label>
          <input
            name="password"
            type="password"
            id="password_id"
            className={`border p-2`}
          />
        </div>
        <button type="submit" className={`bg-slate-300 p-3 w-[100%]`}>
          Submit
        </button>
      </Form>
    </>
  );
}

export default Login;
