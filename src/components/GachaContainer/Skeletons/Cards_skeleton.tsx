import { useTheme } from "../../../context/Theme_toggle";

export default function CardSkeleton() {
  const { theme } = useTheme();
  
  return (
    <div
      className={`relative overflow-hidden rounded-xl animate-pulse ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      <div className="aspect-square w-full">
        <div
          className={`w-full h-full ${
            theme === "dark" ? "bg-gray-600" : "bg-gray-300"
          }`}
        />
      </div>
    </div>
  );
}