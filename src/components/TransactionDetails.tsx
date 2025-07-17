"use client";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    status: string;
    imageUrl: string;
    timestamp: string;
    receiptimageUrl?: string;
    isRequested?: boolean;
    hasDisplayed?: boolean;
  };
}

const TransactionDetails = ({ data, isOpen, onClose }: ModalProps) => {
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start animation shortly after mount
      const timeout = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-lg w-[90%] max-w-md relative border min-h-[300px] flex items-center justify-center transition-all duration-300 transform ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {!user ? (
          <div className="items-center justify-center flex h-full flex-col">
            <FontAwesomeIcon icon={faEyeSlash} size="4x" />
            <p>Please login.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-4">Status: {data.status}</h1>
            <p className="mb-2 text-gray-600">Timestamp: {data.timestamp}</p>
            <p>id: {data.id}</p>
            <div className="w-full h-56 mb-4 rounded-lg overflow-hidden bg-gray-100 ">
              <img
                src={data.imageUrl}
                alt="Transaction"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-gray-800"
            >
              &times;
            </button>

            <Button transactionID={data.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
