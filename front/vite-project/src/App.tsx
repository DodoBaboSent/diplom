import "./App.css";
import { Nav } from "./components/nav";

export function App() {
  return (
    <>
      <div className="grid-rows-[100px_1fr_100px] grid-cols-[[start-content]_2fr_[end-content_start-nav]_1fr_[end-nav]] h-[100vh] grid">
        <div className={`col-start-1 col-end-3 h-[100px] bg-amber-900`}>
          <Nav />
        </div>
        <div
          className={`align-center justify-center flex py-3 lg:col-start-1 lg:col-end-2 col-start-1 col-end-3`}
        >
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
        </div>
        <div className="hidden lg:flex lg:flex-col lg:justify-center">
          <h1 className="text-3xl font-bold">Nav</h1>
        </div>
        <div className="bg-amber-500 col-start-1 col-end-3"></div>
      </div>
    </>
  );
}

export default App;
