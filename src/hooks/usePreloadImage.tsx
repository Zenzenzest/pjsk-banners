import { useEffect } from "react";
import { preload } from "react-dom";
export const usePreloadImage = (urls: string[]) => {
  useEffect(() => {
    if (urls.length === 0) return;

    const uniqueUrls = [...new Set(urls)];
    // console.log(`📸 Preloading ${uniqueUrls.length} images...`);

    uniqueUrls.forEach((url) => {
      try {
        preload(url, { as: "image" });
        // console.log(`✅ Preloaded ${index + 1}/${uniqueUrls.length}: ${url}`);
      } catch (error) {
        console.error(`❌ Failed to preload: ${url}`, error);
      }
    });
  }, [urls]);
};
