// Landing.tsx
import LandingNavigation from "../components/Landing/Landing_nav";
import LatestBanners from "../components/Landing/Latest_banners";
import LoadingComponent from "../components/Loading";
import { useProsekaData } from "../context/Data";
import { useTheme } from "../context/Theme_toggle";
import { useIsMobile } from "../hooks/isMobile";
import styles from "./Landing.module.css";

export default function Landing() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { loading } = useProsekaData();
  const background = "/images/bg/5th_anniv.png";
  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen transition-colors duration-500 relative pt-10">
      {/* BACKGROUND IMAGE*/}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${background})`,
          opacity: 0.4,
          zIndex: -1,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4  max-sm:px-2">
        <div
          className={`text-center ${isMobile ? "mb-5" : "mb-11"} mt-5 ${
            styles.fadeInUp
          }`}
        >
          <h1 className={`text-5xl md:text-6xl font-bold mb-2 text-white`}>
            PRSK <span className="text-[#50a0fd]">Banners</span>
          </h1>

          <div
            className={`w-32 h-1 mx-auto rounded-full ${
              theme === "dark" ? "bg-[#50a0fd]" : "bg-blue-500"
            } ${styles.widthExpand}`}
          ></div>

          <p className={`mt-3 text-lg max-w-2xl mx-auto text-gray-300`}>
            Track upcoming banners/events
          </p>
        </div>
        <div className="w-full">
          <LandingNavigation />
        </div>
        {/*BANNERS */}
        <div className="space-y-10 max-w-4xl mx-auto">
          <LatestBanners />
        </div>
      </div>
    </div>
  );
}
