// Landing.tsx
import LatestBanners from "../components/Landing/Latest_banners";
import { useTheme } from "../context/Theme_toggle";
import styles from "./Landing.module.css";

export default function Landing() {
  const { theme } = useTheme();
  const background = "/images/bg/tree.webp";
  //  ${
  //         theme === "dark" ? "bg-[#0e1721]" : "bg-gray-50"
  //       }`
  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-[url(/images/card_thumbnail/1251.webp)] `}
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 max-sm:px-2">
        {/* Main Title with Animation */}
        <div className={`text-center mb-16 mt-8 ${styles.fadeInUp}`}>
          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } ${styles.fadeInScale}`}
          >
            PRSK{" "}
            <span
              className={theme === "dark" ? "text-[#50a0fd]" : "text-blue-600"}
            >
              Banners
            </span>
          </h1>

          <div
            className={`w-32 h-1 mx-auto rounded-full ${
              theme === "dark" ? "bg-[#50a0fd]" : "bg-blue-500"
            } ${styles.widthExpand}`}
          ></div>

          <p
            className={`mt-6 text-lg max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } ${styles.fadeIn}`}
          >
            Track and discover upcoming banners/events
          </p>
        </div>

        {/* Server Banners Section */}
        <div className="space-y-10 max-w-4xl mx-auto">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <LatestBanners key={i} n={i} />
            ))}
        </div>

        {/* Floating Elements for Decorative Purposes */}
        {theme === "dark" && (
          <>
            <div
              className={`fixed top-20 left-10 w-2 h-2 rounded-full bg-[#50a0fd]/30 ${styles.float}`}
            ></div>
            <div
              className={`fixed bottom-20 right-10 w-1 h-1 rounded-full bg-[#50a0fd]/20 ${styles.float2}`}
            ></div>
          </>
        )}
      </div>
    </div>
  );
}
