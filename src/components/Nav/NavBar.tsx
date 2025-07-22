import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import { useMemo, useCallback } from "react";

export default function NavBar() {
  const { server, setServer } = useServer();
  const { theme } = useTheme();

  // Pre-compute base styles
  const navStyles = useMemo(() => {
    const isLight = theme === "light";
    return {
      nav: `w-full h-16 flex justify-center items-center border-b-2 sticky top-0 z-50 ${
        isLight
          ? "bg-bg-light-mode text-text-light-mode border-gray-300"
          : "bg-bg-dark-mode text-text-dark-mode border-gray-700"
      }`,
      activeButton: isLight
        ? "bg-blue-100 text-blue-700 shadow-inner"
        : "bg-blue-900/50 text-blue-300 shadow-inner",
      inactiveButton: isLight
        ? "hover:bg-gray-100 text-gray-700"
        : "hover:bg-gray-700/50 text-gray-300",
    };
  }, [theme]);

  // M button class generator
  const getButtonClass = useMemo(() => {
    const baseClass =
      "flex-1 text-center px-2 py-3 mx-1 rounded-md text-sm sm:text-base font-medium transition-colors mt-auto mb-auto";
    return (isActive: boolean) =>
      `${baseClass} ${
        isActive ? navStyles.activeButton : navStyles.inactiveButton
      }`;
  }, [navStyles]);

  //  event handlers
  const handleJPClick = useCallback(() => setServer("jp"), [setServer]);
  const handleGlobalClick = useCallback(() => setServer("global"), [setServer]);
  const handleSavedClick = useCallback(() => setServer("saved"), [setServer]);

  //  button classes
  const jpClass = useMemo(
    () => getButtonClass(server === "jp"),
    [getButtonClass, server]
  );
  const globalClass = useMemo(
    () => getButtonClass(server === "global"),
    [getButtonClass, server]
  );
  const savedClass = useMemo(
    () => getButtonClass(server === "saved"),
    [getButtonClass, server]
  );

  return (
    <>
      <nav className={navStyles.nav}>
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex justify-evenly">
            {/* JP Server button */}
            <button
              onClick={handleJPClick}
              className={jpClass}
              type="button"
              aria-pressed={server === "jp"}
            >
              JP
            </button>

            {/* Global Server button */}
            <button
              onClick={handleGlobalClick}
              className={globalClass}
              type="button"
              aria-pressed={server === "global"}
            >
              Global
            </button>

            {/* Saved Banners button */}
            <button
              onClick={handleSavedClick}
              className={savedClass}
              type="button"
              aria-pressed={server === "saved"}
            >
              <span className="sm:hidden">Saved</span>
              <span className="hidden sm:inline">Saved Banners</span>
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
