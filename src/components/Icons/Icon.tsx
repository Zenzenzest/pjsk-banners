import { useTheme } from "../../context/Theme_toggle";
import type { CardIconTypes } from "./IconTypes";

export default function CardIcon({
  imgUrl,
  iconsLoader,
  cardId,
}: CardIconTypes) {
  const { theme } = useTheme();
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
      }`}
    >
      <img
        src={imgUrl}
        className="w-full h-auto transition-opacity duration-200 group-hover:opacity-80"
        alt={`Shop Card ${cardId}`}
        onLoad={iconsLoader.handleLoad}
      />
    </div>
  );
}
