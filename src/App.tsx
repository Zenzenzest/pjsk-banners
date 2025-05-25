import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/Nav/NavBar";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Route>
    </Routes>
  );
}

export default App;
