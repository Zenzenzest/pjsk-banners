import { useEffect, useState } from "react";

export const IsDeviceIpad = () => {
  const [isIpadPortrait, setIsIpadPortrait] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for iPad user agent
      const isIpad =
        /ipad|macintosh/i.test(navigator.userAgent) && "ontouchend" in document;

      // Orientation check function
      const checkOrientation = () => {
        if (isIpad) {
          const isLandscape = window.matchMedia(
            "(orientation: portrait)"
          ).matches;
          setIsIpadPortrait(isLandscape);
        }
      };

      // Initial check
      checkOrientation();

      // Add event listener for orientation changes
      window.addEventListener("resize", checkOrientation);
      return () => window.removeEventListener("resize", checkOrientation);
    }
  }, []);

  return isIpadPortrait;
};
