import { useState, useRef, useCallback } from "react";

export const ImageLoader = (imageCount: number) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const loadedCountRef = useRef(0);
  
  const handleLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current === imageCount) {
      setIsLoaded(true);
    }
  }, [imageCount]);
  
  const reset = useCallback(() => {
    setIsLoaded(false);
    loadedCountRef.current = 0;
  }, []);
  
  return { isLoaded, handleLoad, reset };
};