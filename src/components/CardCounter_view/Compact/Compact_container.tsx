import WebsiteDisclaimer from "../../Nav/Website_disclaimer";
import CompactBday from "./Bday/Compact_bday";
import CompactBFes from "./Bloom_fes/Compact_bfes";

export default function CompactContainer() {
  return (
    <div className="w-full flex flex-col h-auto bg-[#101828] overflow-x-hidden ">
      <h1 className="text-center text-4xl ">WIP</h1>
      <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
        <CompactBFes />
        <CompactBday />
      </div>
      <WebsiteDisclaimer />
    </div>
  );
}
