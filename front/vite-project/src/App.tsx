import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Root } from "./root";
import { About } from "./About";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
