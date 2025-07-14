"use client";

import { useSpring, animated as a, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useState } from "react";

export default function SwipeCard() {
  const MAX_DRAG = 100;      // px limit for drag
  const ACTION_TRIGGER = 75; // px threshold to accept/reject

  const [style, api] = useSpring(() => ({ x: 0 }));
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  const handleAccept = () => {
    alert("✅ Accepted!");
  };

  const handleReject = () => {
    alert("❌ Rejected!");
  };

  const bind = useDrag(({ down, movement: [mx], last }) => {
    const clampedX = Math.max(-MAX_DRAG, Math.min(mx, MAX_DRAG));

    if (down) {
      api.start({ x: clampedX });
      setSwipeDir(clampedX < 0 ? "left" : clampedX > 0 ? "right" : null);
    } else {
      setSwipeDir(null);

      if (clampedX <= -ACTION_TRIGGER) {
        handleAccept();
      } else if (clampedX >= ACTION_TRIGGER) {
        handleReject();
      }

      api.start({ x: 0 }); // reset position after action
    }
  });

  const backgroundColor = to(style.x, (x) => {
    if (x < -75) return "rgba(34,197,94,0.15)"; // green for accept
    if (x > 75) return "rgba(239,68,68,0.15)";  // red for reject
    return "#f9fafb"; // default
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <a.div
        className="relative w-80 h-48 rounded-xl overflow-hidden"
        style={{ background: backgroundColor }}
      >
        <a.div
          {...bind()}
          style={{
            x: style.x,
            touchAction: "none",
          }}
          className="absolute w-full h-full bg-white rounded-xl shadow-lg border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 select-none"
        >
          Swipe Me ↔️
        </a.div>
      </a.div>
    </div>
  );
}