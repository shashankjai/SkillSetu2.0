import React, { useEffect, useState } from "react";
import "./background.css";

const colors = [
  ["from-white/30", "to-blue-200/40"],
  ["from-white/40", "to-sky-200/40"],
  ["from-blue-100/40", "to-white/30"],
  ["from-sky-200/40", "to-blue-200/40"],
  ["from-cyan-200/40", "to-blue-100/40"],
  ["from-blue-200/40", "to-blue-300/40"],
  ["from-white/30", "to-cyan-200/40"],
];

const depths = [
  { z: "z-0", blur: "blur-md", opacity: 0.18 },
  { z: "z-10", blur: "blur-lg", opacity: 0.25 },
  { z: "z-20", blur: "blur-2xl", opacity: 0.35 },
];

const generateCircles = (count = 30) => {
  return Array.from({ length: count }, () => {
    const depth = depths[Math.floor(Math.random() * depths.length)];
    return {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 180 + 80),
      colors: colors[Math.floor(Math.random() * colors.length)],
      delay: `${(Math.random() * 5).toFixed(1)}s`,
      duration: `${(18 + Math.random() * 10).toFixed(1)}s`,
      blur: depth.blur,
      z: depth.z,
      opacity: depth.opacity,
    };
  });
};

const circles = generateCircles();

const Background = () => {
  const [sparkTrigger, setSparkTrigger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkTrigger(true);
      setTimeout(() => setSparkTrigger(false), 800);
    }, Math.random() * 1000 + 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
      {/* Subtle dark overlay (Home-style) */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Soft light center glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03),_transparent)] mix-blend-overlay" />

      {circles.map((circle, index) => (
        <div
          key={index}
          className={`
            absolute rounded-full bg-gradient-to-br
            ${circle.colors.join(" ")} shimmer
            ${circle.blur} ${circle.z}
            ${sparkTrigger ? "spark" : ""}
          `}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            top: circle.top,
            left: circle.left,
            opacity: circle.opacity,
            animation: `floatXY ${circle.duration} cubic-bezier(0.45, 0, 0.55, 1) infinite`,
            animationDelay: circle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
