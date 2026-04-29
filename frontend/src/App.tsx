import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Prediction from "./Prediction";
import Analysis from "./Analysis";
import wakeUpServer from "./utils/ping";

function App() {
  useEffect(() => {
    wakeUpServer();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Analysis />} />
        <Route path="/prediction" element={<Prediction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;