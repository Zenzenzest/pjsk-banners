import { Outlet, Link } from "react-router-dom";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
export default function NavBar() {
  const { server, setServer } = useServer();
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`w-full h-15 flex flex-row items-center justify-evenly border-b-2 font-bold ${
          theme == "light"
            ? "bg-bg-light-mode text-text-light-mode border-gray-300"
            : "bg-bg-dark-mode text-text-dark-mode border-mizuki"
        }`}
      >
        <Link
          to="/"
          className={`${server === "jp" && "text-mizuki "} text-center w-1/3`}
          onClick={() => setServer("jp")}
        >
          JP
        </Link>
        <Link
          to="/"
          className={`${
            server === "global" && "text-mizuki "
          } text-center w-1/3`}
          onClick={() => setServer("global")}
        >
          Global
        </Link>
        <Link
          to="/saved_cards"
          className={`${
            server === "" && "text-mizuki "
          }  text-center w-1/3 pl-7 pr-7`}
          onClick={() => setServer("")}
        >
          Saved Cards
        </Link>
      </div>
      <Outlet />
    </>
  );
}
