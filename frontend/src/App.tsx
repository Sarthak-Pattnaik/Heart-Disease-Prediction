import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analysis from "./Analysis";
import Dashboard from "./Dashboard";
import wakeUpServer from "./utils/ping";

function App() {
  useEffect(() => {
    wakeUpServer();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;