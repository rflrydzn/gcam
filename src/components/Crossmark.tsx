"use client";
import { useState } from "react";

export default function CrossMark() {
  const [key] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[80px] h-[115px] mx-auto" key={key}>
        <div className="w-[80px] h-[80px] relative rounded-full box-content border-[6px] border-[var(--checkmark-circle)]">
          <span className="icon-line line-left" />
          <span className="icon-line line-right" />
          <div className="absolute top-[-4px] left-[-4px] z-10 w-[80px] h-[80px] rounded-full box-content border-[6px] border-[var(--checkmark-circle)]" />
        </div>
      </div>
      <p>Transaction rejected</p>

      <style jsx>{`
        .icon-line {
          height: 8px;
          background-color: var(--checkmark-border);
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
          transform-origin: center;
        }

        .line-left {
          top: 38px;
          left: 16px;
          width: 47px;
          transform: rotate(45deg);
          animation: icon-line-left 0.75s;
        }

        .line-right {
          top: 38px;
          left: 16px;
          width: 47px;
          transform: rotate(-45deg);
          animation: icon-line-right 0.75s;
        }

        @keyframes icon-line-left {
          0% {
            width: 0;
            top: 38px;
            left: 40px;
          }
          60% {
            width: 0;
            top: 38px;
            left: 40px;
          }
          100% {
            width: 47px;
            top: 38px;
            left: 16px;
          }
        }

        @keyframes icon-line-right {
          0% {
            width: 0;
            top: 38px;
            left: 40px;
          }
          60% {
            width: 0;
            top: 38px;
            left: 40px;
          }
          100% {
            width: 47px;
            top: 38px;
            left: 16px;
          }
        }
      `}</style>
    </div>
  );
}
