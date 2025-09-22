import { useTheme } from "../../../context/Theme_toggle";
import WebsiteDisclaimer from "../../Server/Website_disclaimer";
import CanvasBday from "./Bday/Birthday";
import CanvasFes from "./Festival/Festival";
import CanvasFocusEvent from "./Focus/Focus_event";

export default function RotationsContainer() {
  const { theme } = useTheme();
  return (
    <div
      className={`w-full flex flex-col h-auto  ${
        theme === "dark"
          ? "bg-[#101828] text-gray-300"
          : "bg-[#f5f7f9] text-gray-700"
      } overflow-x-hidden `}
    >
      <h1 className="text-center text-4xl ">WIP</h1>
      <div className="flex flex-row flex-wrap gap-5 justify-center items-center ">
        <CanvasFes />
        <CanvasBday />
        <CanvasFocusEvent />
      </div>
      <WebsiteDisclaimer />
    </div>
  );
}
