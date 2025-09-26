import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function ServerToggle() {
  const { server, setServer } = useServer();
  const { theme } = useTheme();

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
      homeIcon: isLight
        ? "text-gray-700 hover:text-gray-900"
        : "text-gray-300 hover:text-gray-100",
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
  };

  const handleGlobalClick = () => {
    setServer("global");
  };

  // Determine active state
  const isJPActive = server === "jp";
  const isGlobalActive = server === "global";

  // button classes
  const jpClass = useMemo(
    () => getButtonClass(isJPActive),
    [getButtonClass, isJPActive]
  );
  const globalClass = useMemo(
    () => getButtonClass(isGlobalActive),
    [getButtonClass, isGlobalActive]
  );

  return (
    <div className={containerStyles.container}>
      <div className="flex w-full justify-between items-center">
        {/* HOME BUTTON */}
        <Link
          to="/"
          className={`p-2 rounded-md hover:opacity-80 w-1/5 transition-opacity ${containerStyles.homeIcon}`}
          aria-label="Home"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>

        {/* SERVER BUTTONS */}
        <div className="flex justify-center gap-5 items-center w-3/5">
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
        </div>
        <div className="w-1/5"></div>
      </div>
    </div>
  );
}
