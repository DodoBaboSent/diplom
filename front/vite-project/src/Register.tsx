import { Form, Link } from "react-router-dom";
import { useActionData } from "react-router-typesafe";
import { RegisterAction } from "./App";

function Register() {
  const actionData = useActionData<typeof RegisterAction>();

  return (
    <>
      {actionData ? (
        <div className={`bg-red-400 p-3 flex flex-col rounded my-2`}>
          <h1 className={`text-white font-bold`}>{actionData}</h1>
        </div>
      ) : (
        <></>
      )}
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
      <Link to="/newUser">Already have an account? Sign in</Link>
    </>
  );
}

export default Register;
