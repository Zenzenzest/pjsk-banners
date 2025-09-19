import { useTheme } from "../../../context/Theme_toggle";
import WebsiteDisclaimer from "../../Server/Website_disclaimer";
import CompactBday from "./Bday/Compact_bday";
import CompactBFes from "./Bloom_fes/Compact_bfes";

export default function CompactContainer() {
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
      <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
        <CompactBFes />
        <CompactBday />
      </div>
      <WebsiteDisclaimer />
    </div>
  );
}
