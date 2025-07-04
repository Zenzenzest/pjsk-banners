import { Outlet, Link } from "react-router-dom";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";

export default function NavBar() {
  const { server, setServer } = useServer();
  const { theme } = useTheme();

  return (
    <>
      <nav
        className={`w-full h-16 flex items-center border-b-2 sticky top-0 z-50 ${
          theme == "light"
            ? "bg-bg-light-mode text-text-light-mode border-gray-300"
            : "bg-bg-dark-mode text-text-dark-mode border-gray-700"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex justify-evenly">
            {/* JP Server Link */}
            <Link
              to="/"
              onClick={() => setServer("jp")}
              className={`flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors ${
                server === "jp"
                  ? theme == "light"
                    ? "bg-blue-100 text-blue-700 shadow-inner"
                    : "bg-blue-900/50 text-blue-300 shadow-inner"
                  : theme == "light"
                    ? "hover:bg-gray-100 text-gray-700"
                    : "hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              JP
            </Link>

            {/* Global Server Link */}
            <Link
              to="/"
              onClick={() => setServer("global")}
              className={`flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors ${
                server === "global"
                  ? theme == "light"
                    ? "bg-blue-100 text-blue-700 shadow-inner"
                    : "bg-blue-900/50 text-blue-300 shadow-inner"
                  : theme == "light"
                    ? "hover:bg-gray-100 text-gray-700"
                    : "hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              Global
            </Link>

            {/* Saved Cards Link */}
            <Link
              to="/saved_cards"
              onClick={() => setServer("saved")}
              className={`flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors ${
                server === "saved"
                  ? theme == "light"
                    ? "bg-blue-100 text-blue-700 shadow-inner"
                    : "bg-blue-900/50 text-blue-300 shadow-inner"
                  : theme == "light"
                    ? "hover:bg-gray-100 text-gray-700"
                    : "hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              Saved Cards
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}