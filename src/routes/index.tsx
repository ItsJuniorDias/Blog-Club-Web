import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/App";
import Redirect from "../pages/Redirect";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<Redirect />} />
      </Routes>
    </div>
  );
}

export default App;
