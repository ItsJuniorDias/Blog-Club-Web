import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/App";
import Redirect from "../pages/Redirect";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<Redirect />} />
      </Routes>
    </>
  );
}

export default App;
