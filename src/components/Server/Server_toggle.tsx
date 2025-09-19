import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ServerToggle() {
  const { server, setServer } = useServer();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // base styles
  const containerStyles = useMemo(() => {
    const isLight = theme === "light";
    return {
      container: `flex justify-center items-center p-4 border-b-2 ${
        isLight
          ? "bg-bg-light-mode border-gray-300"
          : "bg-bg-dark-mode border-gray-700"
      }`,
      activeButton: isLight
        ? "bg-blue-100 text-blue-700 shadow-inner"
        : "bg-blue-900/50 text-blue-300 shadow-inner",
      inactiveButton: isLight
        ? "hover:bg-gray-100 text-gray-700"
        : "hover:bg-gray-700/50 text-gray-300",
    };
  }, [theme]);

  // button class generator
  const getButtonClass = useMemo(() => {
    const baseClass =
      "px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors w-full cursor-pointer";
    return (isActive: boolean) =>
      `${baseClass} ${
        isActive ? containerStyles.activeButton : containerStyles.inactiveButton
      }`;
  }, [containerStyles]);

  const handleJPClick = () => {
    setServer("jp");
    if (location.pathname === "/saved") {
      navigate("/");
    }
  };

  const handleGlobalClick = () => {
    setServer("global");
    if (location.pathname === "/saved") {
      navigate("/");
    }
  };

  const handleSavedClick = () => {
    setServer("saved");
    navigate("/saved");
  };

  // Determine active state
  const isJPActive = server === "jp";
  const isGlobalActive = server === "global";
  const isSavedActive = server === "saved";

  // button classes
  const jpClass = useMemo(
    () => getButtonClass(isJPActive),
    [getButtonClass, isJPActive]
  );
  const globalClass = useMemo(
    () => getButtonClass(isGlobalActive),
    [getButtonClass, isGlobalActive]
  );
  const savedClass = useMemo(
    () => getButtonClass(isSavedActive),
    [getButtonClass, isSavedActive]
  );

  return (
    <div className={containerStyles.container}>
      <div className="flex w-full justify-evenly items-center">
        {/* JP SERVER */}
        <button
          onClick={handleJPClick}
          className={jpClass}
          type="button"
          aria-pressed={isJPActive}
        >
          JP
        </button>

        {/* GLOBAL SERVER */}
        <button
          onClick={handleGlobalClick}
          className={globalClass}
          type="button"
          aria-pressed={isGlobalActive}
        >
          Global
        </button>

        {/* SAVED BANNERS */}
        <button
          onClick={handleSavedClick}
          className={savedClass}
          type="button"
          aria-pressed={isSavedActive}
        >
          <span className="sm:hidden">Saved</span>
          <span className="hidden sm:inline">Saved Banners</span>
        </button>
      </div>
    </div>
  );
}