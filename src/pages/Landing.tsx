// Landing.tsx
import LatestBanners from "../components/Landing/Latest_banners";
import { useTheme } from "../context/Theme_toggle";
import styles from "./Landing.module.css";

export default function Landing() {
  const { theme } = useTheme();
  const background = "/images/bg/tree.webp";

  return (
    <div className="min-h-screen transition-colors duration-500 relative">
      {/* BACKGROUND IMAGE*/}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${background})`,
          opacity: 0.4,
          zIndex: -1,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-4 max-sm:px-2">
        <div className={`text-center mb-13 mt-5 ${styles.fadeInUp}`}>
          <h1 className={`text-5xl md:text-6xl font-bold mb-2 text-white`}>
            PRSK <span className="text-[#50a0fd]">Banners</span>
          </h1>

          <div
            className={`w-32 h-1 mx-auto rounded-full ${
              theme === "dark" ? "bg-[#50a0fd]" : "bg-blue-500"
            } ${styles.widthExpand}`}
          ></div>

          <p className={`mt-3 text-lg max-w-2xl mx-auto text-gray-300`}>
            Track and discover upcoming banners/events
          </p>
        </div>

        {/*BANNERS */}
        <div className="space-y-10 max-w-4xl mx-auto">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <LatestBanners key={i} n={i} />
            ))}
        </div>
      </div>
    </div>
  );
}
