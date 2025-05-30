import { Outlet, Link } from "react-router-dom";
import { useTheme } from "../../context/Theme_toggle";
import { useServer } from "../../context/Server";
export default function NavBar() {
  const { setServer } = useServer();
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`w-full h-15 flex flex-row items-center justify-evenly border-b-2 font-bold ${
          theme == "light"
            ? "bg-bg-light-mode text-text-light-mode border-border-light-mode"
            : "bg-bg-dark-mode text-text-dark-mode border-mizuki"
        }`}
      >
        <Link
          to="/"
          className="text-center w-1/3"
          onClick={() => setServer("jp")}
        >
          JP
        </Link>
        <Link
          to="/"
          className="text-center w-1/3"
          onClick={() => setServer("global")}
        >
          Global
        </Link>
        <Link to="/saved_cards" className="text-center w-1/3 pl-7 pr-7">
          Saved Cards
        </Link>
        {/* {nav_list.map((n, i) => {
          if (i == 2) {
            return (
              <Link
                to="/saved_cards"
                className="text-center w-1/3 pl-7 pr-7"
                key={n}
              >
                {n}
              </Link>
            );
          } else {
            return (
              <Link to="/" className="text-center w-1/3" key={n}>
                {n}
              </Link>
            );
          }
        })} */}
      </div>
      <Outlet />
    </>
  );
}
