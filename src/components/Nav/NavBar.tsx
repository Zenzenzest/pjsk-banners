import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import WebsiteDisclaimer from "./Website_disclaimer";

export default function NavBar() {
  const { server, setServer } = useServer();
  const { theme } = useTheme();

  return (
    <>
      <nav
        className={`w-full h-16 flex justify-center items-center border-b-2 sticky top-0 z-50 ${
          theme == "light"
            ? "bg-bg-light-mode text-text-light-mode border-gray-300"
            : "bg-bg-dark-mode text-text-dark-mode border-gray-700"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-4 ">
          <div className="flex justify-evenly">
            {/* JP Server div */}
            <div
              onClick={() => setServer("jp")}
              className={`flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors mt-auto mb-auto ${
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
            </div>

            {/* Global Server div */}
            <div
              onClick={() => setServer("global")}
              className={`flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors mt-auto mb-auto ${
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
            </div>

            {/* Saved Banners div */}
            <div
              onClick={() => setServer("saved")}
              className={`flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors mt-auto mb-auto ${
                server === "saved"
                  ? theme == "light"
                    ? "bg-blue-100 text-blue-700 shadow-inner"
                    : "bg-blue-900/50 text-blue-300 shadow-inner"
                  : theme == "light"
                  ? "hover:bg-gray-100 text-gray-700"
                  : "hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              <span className="sm:hidden">Saved</span>
              <span className="hidden sm:inline">Saved Banners</span>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
      <WebsiteDisclaimer />
    </>
  );
}
