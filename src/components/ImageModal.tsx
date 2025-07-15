"use client";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function ImageModal({img}: {img: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, ] = useState(img); // replace with your image
  const [caption, setCaption] = useState("09xx xxx xxxx");
  const [, setOrigin] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);



  const openModal = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setOrigin({ top: rect.top, left: rect.left });
    }
    setIsOpen(true);
    setCaption("09xx xxx xxxx"); // Or dynamically set caption
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={openModal}
        className="cursor-pointer  hover:text-black flex items-center space-x-2"
      >
        <FontAwesomeIcon icon={faImage} size="2x" />
        <span className="text-sm">Open Image</span>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black/80 flex items-center justify-center" onClick={closeModal}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <span
              className="absolute top-2 right-4 text-white text-4xl font-bold cursor-pointer hover:text-gray-400"
              onClick={closeModal}
            >
              &times;
            </span>

            <img
              src={imgSrc}
              alt={caption}
              className="max-w-[700px] w-[80vw] rounded-md animate-zoom"
            />
            <div className="text-center text-gray-300 mt-4 max-w-[700px] mx-auto text-xl">
              {caption}
            </div>
          </div>
        </div>
      )}

      {/* Tailwind animation */}
      <style jsx>{`
        @keyframes zoom {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-zoom {
          animation: zoom 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}