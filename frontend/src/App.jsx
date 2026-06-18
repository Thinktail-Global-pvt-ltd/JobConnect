import "./App.css";
import FindANewJob from "./component/FindANewJob";
import Home from "./component/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<FindANewJob />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
