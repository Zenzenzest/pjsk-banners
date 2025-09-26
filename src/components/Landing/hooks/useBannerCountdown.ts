import { useState, useEffect, useCallback } from "react";

export const useBannerCountdown = (bannerEndTimestamp: number | null) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });


  const calculateTimeLeft = useCallback(() => {
    if (!bannerEndTimestamp) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const now = Date.now();
    const difference = bannerEndTimestamp - now;

 

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }, [bannerEndTimestamp]);

  useEffect(() => {

    setTimeLeft(calculateTimeLeft());

    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return { timeLeft };
};