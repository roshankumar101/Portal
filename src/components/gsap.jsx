import { useEffect, useState, useMemo } from "react";
import sidebarImg from "../assets/sidebar.jpg";

export default function SidebarCard() {
  // Quotes list
  const quotes = [
    "Ready for the next round? Welcome to the Patience Test!",
    "Great things take time… and so do HR emails",
    "Rome wasn’t built in a day… neither are offer letters."
  ];

  // Start random
  const startIndex = useMemo(
    () => Math.floor(Math.random() * quotes.length),
    []
  );

  const [quoteIndex, setQuoteIndex] = useState(startIndex);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Typing effect
  useEffect(() => {
    if (charIndex < quotes[quoteIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + quotes[quoteIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 90); // typing speed
      return () => clearTimeout(timeout);
    } else {
      // When finished typing, wait 4–5 seconds before changing
      const pause = setTimeout(() => {
        const nextIndex = (quoteIndex + 1) % quotes.length;
        setQuoteIndex(nextIndex);
        setDisplayText("");
        setCharIndex(0);
      }, 4500); // pause time after fully typed
      return () => clearTimeout(pause);
    }
  }, [charIndex, quoteIndex, quotes]);

  return (
    <div className="hidden lg:block lg:w-[30%] bg-neutral-50 dark:bg-neutral-900">
      <div className="sticky top-0 h-screen p-8 flex flex-col items-center justify-center">
        <div
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
          style={{ minHeight: "400px" }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-2 pb-6 flex flex-col items-center"
            style={{
              border: "8px solid white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              transform: "rotate(-2deg)",
              maxWidth: "260px",
            }}
          >
            <img
              src={sidebarImg}
              alt="Polaroid"
              className="w-56 h-64 object-cover rounded-md mb-4"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
            />

            {/* Typewriter animated text */}
            <span
              className="text-center w-full block"
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: "1.35rem",
                color: "#1e293b",
                fontWeight: 600,
                letterSpacing: ".02em",
                minHeight: "3.5rem",
              }}
            >
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          {/* Load font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap"
            rel="stylesheet"
          />
        </div>
      </div>
    </div>
  );
}
