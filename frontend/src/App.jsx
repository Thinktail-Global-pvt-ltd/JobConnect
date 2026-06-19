import PrivacyPolicy from "./PrivacyPolicy";
import "./App.css";
import FindANewJob from "./component/FindANewJob";
import Home from "./component/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Term from "./Term";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<FindANewJob />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/terms&condications" element={<Term/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
