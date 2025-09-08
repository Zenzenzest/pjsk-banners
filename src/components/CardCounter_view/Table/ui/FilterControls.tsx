import { useTheme } from "../../../../context/Theme_toggle";
import type { FilterControlsProps } from "../CounterTableTypes";

export default function FilterControls({
  showVirtualSingers,
  setShowVirtualSingers,
  showLN,
  setShowLN,
  showMMJ,
  setShowMMJ,
  showVBS,
  setShowVBS,
  showWxS,
  setShowWxS,
  showN25,
  setShowN25,
}: FilterControlsProps) {
  const { theme } = useTheme();

  return (
    <div className="mb-4 flex flex-wrap justify-center gap-4">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showVirtualSingers}
          onChange={(e) => setShowVirtualSingers(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          } `}
        >
          Virtual Singers
        </span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showLN}
          onChange={(e) => setShowLN(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          } `}
        >
          L/n
        </span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showMMJ}
          onChange={(e) => setShowMMJ(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          } `}
        >
          MMJ
        </span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showVBS}
          onChange={(e) => setShowVBS(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          } `}
        >
          VBS
        </span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showWxS}
          onChange={(e) => setShowWxS(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          } `}
        >
          WxS
        </span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showN25}
          onChange={(e) => setShowN25(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-200" : "text-gray-600"
          } `}
        >
          N25
        </span>
      </label>
    </div>
  );
}