import { Outlet, Link } from "react-router-dom";
export default function NavBar() {
  const nav_list: string[] = ["JP", "Global", "Saved Cards"];
  return (
    <>
      <div className={`w-full h-15 flex flex-row items-center justify-evenly`}>
        {nav_list.map((n) => {
          return (
            <div className="text-center w-1/3" key={n}>
              {n}
            </div>
          );
        })}
      </div>
      <Outlet />
    </>
  );
}
