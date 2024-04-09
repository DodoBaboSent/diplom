import { useLoaderData } from "react-router-typesafe";
import { PanelLoader } from "./App";

function UserPanel() {
  const data = useLoaderData<typeof PanelLoader>();
  console.log(data);

  return (
    <>
      <h1>Hello User Panel!</h1>
    </>
  );
}

export default UserPanel;
