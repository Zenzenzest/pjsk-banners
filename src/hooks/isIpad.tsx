import { useEffect, useState } from "react";

export const IsDeviceIpad = () => {
  const [isIpadPortrait, setIsIpadPortrait] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
   
      const isIpad =
        /ipad|macintosh/i.test(navigator.userAgent) && "ontouchend" in document;


      const checkOrientation = () => {
        if (isIpad) {
          const isLandscape = window.matchMedia(
            "(orientation: portrait)"
          ).matches;
          setIsIpadPortrait(isLandscape);
        }
      };


      checkOrientation();

      // detect orientation changes
      window.addEventListener("resize", checkOrientation);
      return () => window.removeEventListener("resize", checkOrientation);
    }
  }, []);

  return isIpadPortrait;
};
