import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/Nav/NavBar";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
