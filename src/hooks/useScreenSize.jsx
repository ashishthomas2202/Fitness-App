"use client";
import { useState, useEffect } from "react";

const getScreenSize = (width) => {
  return {
    xs: width < 640,
    sm: width >= 640 && width < 768,
    md: width >= 768 && width < 1024,
    lg: width >= 1024 && width < 1280,
    xl: width >= 1280 && width < 1536,
    xxl: width >= 1536,
  };
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(
    getScreenSize({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    })
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};
