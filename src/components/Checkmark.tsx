"use client";
import { useState } from "react";

export default function Checkmark({ text }: { text: string }) {
  const [key] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="successCheckmark" key={key}>
        <div className="checkIcon">
          <span className="iconLine lineTip"></span>
          <span className="iconLine lineLong"></span>
          <div className="iconCircle"></div>
          <div className="iconFix"></div>
        </div>
      </div>
      <p>
        {text === "upload"
          ? "Upload Done"
          : text === "accept"
          ? "Transaction done"
          : null}
      </p>

      <style jsx>{`
        .successCheckmark {
          width: 80px;
          height: 115px;
          margin: 0 auto;
        }

        .checkIcon {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 6px solid var(--checkmark-border);
        }

        .checkIcon::before,
        .checkIcon::after {
          content: "";
          height: 100px;
          position: absolute;
          background: var(--checkmark-fill);
          transform: rotate(-45deg);
        }

        .checkIcon::before {
          top: 3px;
          left: -2px;
          width: 30px;
          transform-origin: 100% 50%;
          border-radius: 100px 0 0 100px;
        }

        .checkIcon::after {
          top: 0;
          left: 30px;
          width: 60px;
          transform-origin: 0 50%;
          border-radius: 0 100px 100px 0;
          animation: rotate-circle 4.25s ease-in;
        }

        .iconLine {
          height: 8px;
          background-color: var(--checkmark-border);
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }

        .lineTip {
          top: 46px;
          left: 14px;
          width: 25px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.75s;
        }

        .lineLong {
          top: 38px;
          right: 8px;
          width: 47px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.75s;
        }

        .iconCircle {
          top: -4px;
          left: -4px;
          z-index: 10;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: absolute;
          box-sizing: content-box;
          border: 6px solid var(--checkmark-circle);
        }

        .iconFix {
          top: 8px;
          width: 5px;
          left: 26px;
          z-index: 1;
          height: 85px;
          position: absolute;
          transform: rotate(-45deg);
          background-color: var(--checkmark-fill);
        }

        @keyframes rotate-circle {
          0% {
            transform: rotate(-45deg);
          }
          5% {
            transform: rotate(-45deg);
          }
          12% {
            transform: rotate(-405deg);
          }
          100% {
            transform: rotate(-405deg);
          }
        }

        @keyframes icon-line-tip {
          0% {
            width: 0;
            left: 1px;
            top: 19px;
          }
          54% {
            width: 0;
            left: 1px;
            top: 19px;
          }
          70% {
            width: 50px;
            left: -8px;
            top: 37px;
          }
          84% {
            width: 17px;
            left: 21px;
            top: 48px;
          }
          100% {
            width: 25px;
            left: 14px;
            top: 45px;
          }
        }

        @keyframes icon-line-long {
          0% {
            width: 0;
            right: 46px;
            top: 54px;
          }
          65% {
            width: 0;
            right: 46px;
            top: 54px;
          }
          84% {
            width: 55px;
            right: 0px;
            top: 35px;
          }
          100% {
            width: 47px;
            right: 8px;
            top: 38px;
          }
        }
      `}</style>
    </div>
  );
}
