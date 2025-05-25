import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/Nav/NavBar";
import "./App.css";
import { ThemeProvider } from "./context/Theme_toggle";
function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
