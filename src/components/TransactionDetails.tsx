"use client";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/dateTimeFormat";
import OCRButton from "./OCRButton";

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

type OCR = {
  isTransaction: boolean,
  number: string,
  accountName: string,
  amount: number
}
const TransactionDetails = ({ data, isOpen, onClose }: ModalProps) => {
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [ocrData, setOcrData] = useState<OCR | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Start animation shortly after mount
      const timeout = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  useEffect(() => console.log('from parent',ocrData), [ocrData])

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm "
      onClick={onClose}
    >
      <div
        className={`bg-white border-black dark:bg-primary-dark p-6 rounded-lg w-[90%] max-w-md relative border min-h-[300px] flex items-center justify-center ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {!user ? (
          <div className="items-center justify-center flex h-full flex-col">
            <FontAwesomeIcon
              icon={faEyeSlash}
              size="4x"
              className="dark:text-white"
            />
            <p className="dark:text-white">Please login.</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h1
                className="text-2xl font-bold"
              >
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </h1>
            </div>

            <p className="mb-2 text-gray-600 dark:text-white">
               {formatDateTime(data.timestamp)}
            </p>
            
            <p className="dark:text-white">id: {data.id}</p>
            <p>{ocrData?.isTransaction ? ocrData.number : 'Not a transaction'}</p>
            <div className="w-72 h-56 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
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

            <Button
              transactionID={data.id}
              receiptRequest={{
                requested: data.isRequested ?? false,
                timestamp: data.timestamp,
              }}
            />

            <OCRButton imageUrl={data.imageUrl} onResult={(data) => setOcrData(data)}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
