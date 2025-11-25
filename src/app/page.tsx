"use client";
import { useState, useEffect } from "react";

const YES_COLOR = "#4ade80";
const NO_COLOR = "#ef4444";
const MAX_CLICKS_MOBILE = 4;
const MAX_CLICKS_DESKTOP = 8;
const NO_TEXT_SEQUENCE = [
  "NO",
  "Are you sure?",
  "Really sure?",
  "Are you positive?",
  "Just think about it",
  "Pleaseeee...",
  "i will be very sad",
  "Pleaseeee...",
];

function getInitialYesSize() {
  if (typeof window !== "undefined" && window.innerWidth < 600) {
    // Mobile
    return { width: 80, height: 40, fontSize: "1rem" };
  }
  // Desktop
  return { width: 120, height: 56, fontSize: "1.25rem" };
}

export default function Home() {
  const [answeredYes, setAnsweredYes] = useState(false);
  const [yesSize, setYesSize] = useState(getInitialYesSize());
  const [clickCount, setClickCount] = useState(0);
  const [isMax, setIsMax] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1024);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setYesSize(getInitialYesSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMax) {
      setYesSize({
        width: window.innerWidth,
        height: window.innerHeight,
        fontSize: `${window.innerHeight / (window.innerWidth < 600 ? 10 : 6)}px`,
      });
    }
  }, [isMax]);

  const handleYes = () => setAnsweredYes(true);

  const handleNo = () => {
    if (!isMax) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      if (newClickCount >= MAX_CLICKS) {
        setIsMax(true);
      } else {
        const baseWidth = isMobile ? 80 : 120;
        const baseHeight = isMobile ? 40 : 56;
        const nextHeight = yesSize.height + (window.innerHeight - baseHeight) / MAX_CLICKS;
        setYesSize({
          width: yesSize.width + (window.innerWidth - baseWidth) / MAX_CLICKS,
          height: nextHeight,
          fontSize: `${nextHeight / (isMobile ? 4 : 2.5)}px`,
        });
      }
    }
  };

  const isMobile = windowWidth < 600;
  const MAX_CLICKS = isMobile ? MAX_CLICKS_MOBILE : MAX_CLICKS_DESKTOP;

  if (answeredYes) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#f1f5f9" }}
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-pink-600">
            Knew you would say yes ❤️
          </h1>
          <img
            src="/cat2.gif"
            alt="Cute Cat"
            style={{ width: "70vw", maxWidth: 364, height: "auto", marginBottom: "2rem" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      style={{ background: "#f1f5f9" }}
    >
      <main className="flex flex-col items-center justify-center gap-8 w-full h-full">
        {!isMax && (
          <h1 className="text-xl md:text-3xl font-bold text-center text-zinc-700 mb-8">
            Cei sayangku cintaku, Would you like to forgive me?
          </h1>
        )}
        <div
          className={`w-full justify-center items-center mb-6 ${
            isMobile ? "flex flex-col gap-4" : "flex flex-row gap-4 md:gap-8"
          }`}
        >
          {isMounted && (
            <button
              style={{
                width: yesSize.width,
                height: yesSize.height,
                minWidth: isMobile ? 60 : 80,
                minHeight: isMobile ? 32 : 56,
                fontSize: yesSize.fontSize,
                background: YES_COLOR,
                color: "#fff",
                transition: "width 0.3s, height 0.3s, font-size 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                marginLeft: isMobile ? 16 : 0,   // margin kiri di mobile
                marginRight: isMobile ? 16 : 0,  // margin kanan di mobile
                paddingLeft: isMobile ? 16 : 0,  // padding kiri di mobile
                paddingRight: isMobile ? 16 : 0, // padding kanan di mobile
              }}
              className="rounded-lg font-bold"
              onClick={handleYes}
            >
              YES
            </button>
          )}
          {!isMax && isMounted && (
            <button
              style={{
                width: isMobile ? 80 : 120,
                height: isMobile ? 40 : 56,
                fontSize: isMobile ? "1rem" : "1.25rem",
                background: NO_COLOR,
                color: "#fff",
              }}
              className="rounded-lg flex items-center justify-center"
              onClick={handleNo}
            >
              {NO_TEXT_SEQUENCE[clickCount] || "NO"}
            </button>
          )}
        </div>
        {!isMax && (
          <div className="text-2xl md:text-4xl text-center">
            <img
              src="/cat1.gif"
              alt="Cute Cat"
              style={{ width: "50vw", maxWidth: 264, height: "auto", display: "inline-block" }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
