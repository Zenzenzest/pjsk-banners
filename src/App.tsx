import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/Nav/NavBar";
import { ThemeProvider } from "./context/Theme_toggle";
import SavedCards from "./pages/SavedCards";
import { ServerProvider } from "./context/Server";
import CreateData from "./pages/CreateData";
import Test from "./pages/Test";
function App() {
  return (
    <ThemeProvider>
      <ServerProvider>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<Home />} />
            <Route path="/saved_cards" element={<SavedCards />} />
            <Route path="/create_mode" element={<CreateData />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ServerProvider>
    </ThemeProvider>
  );
}

export default App;
