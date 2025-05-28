import { Outlet, Link } from "react-router-dom";
import { useTheme } from "../../context/Theme_toggle";

export default function NavBar() {
  const nav_list: string[] = ["JP", "Global", "Saved Cards"];
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`w-full h-15 flex flex-row items-center justify-evenly ${
          theme == "light"
            ? "bg-bg-light-mode text-text-light-mode"
            : "bg-bg-dark-mode text-text-dark-mode"
        }`}
      >
        {nav_list.map((n, i) => {
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
        })}
      </div>
      <Outlet />
    </>
  );
}
