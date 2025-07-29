"use client";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEyeSlash,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
  isTransaction: boolean;
  number: string;
  accountName: string;
  amount: number;
};
const TransactionDetails = ({ data, isOpen, onClose }: ModalProps) => {
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [ocrData, setOcrData] = useState<OCR | null>(null);
  const [action, setAction] = useState<"ocr" | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploadscopied, setUploadsCopied] = useState(false);
  const [receiptcopied, setReceiptCopied] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Start animation shortly after mount
      const timeout = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  useEffect(() => console.log("from parent", ocrData), [ocrData]);
  useEffect(() => {
    // Reset OCR data when a different transaction is viewed
    setOcrData(null);
  }, [data?.id]);
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
          <div className="space-y-0.5">
            {action === "ocr" && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 dark:bg-primary-dark/90 dark:text-white">
                <div className="flex flex-col items-center">
                  <img
                    src="https://static.wikia.nocookie.net/logopedia/images/d/d2/Gemini_2024_animated.gif"
                    width={100}
                  />
                  <p>Processing...</p>
                </div>
              </div>
            )}

            {/* <p className="dark:text-white">id: {data.id}</p> */}
            {/* <p>{ocrData?.isTransaction ? ocrData.number : 'Not a transaction'}</p> */}
            <div className="relative w-72 h-56 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
              <img
                src={data.imageUrl}
                alt="Transaction"
                className="w-full h-full object-cover"
              />
              {!ocrData && action !== "ocr" && (
                <div
                  className={`absolute top-2 right-2 z-20 bg-white/80 rounded-2xl`}
                >
                  <OCRButton
                    imageUrl={data.imageUrl}
                    onResult={(data) => setOcrData(data)}
                    onStart={() => setAction("ocr")}
                    onFinish={() => setAction(null)}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center ">
              <div className="space-x-2">
                <FontAwesomeIcon
                  icon={
                    data.status === "pending"
                      ? faSpinner
                      : data.status === "completed"
                      ? faCheck
                      : faXmark
                  }
                />
                <span className="text-md">
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </div>

              <p className=" text-gray-600 dark:text-white">
                {formatDateTime(data.timestamp)}
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-xl">
                {ocrData?.isTransaction === true
                  ? `${ocrData?.number} - ₱${ocrData.amount}`
                  : ocrData?.isTransaction === false
                  ? "Not a transaction"
                  : null}
              </span>
              {ocrData && (
                <OCRButton
                  imageUrl={data.imageUrl}
                  onResult={(data) => setOcrData(data)}
                  onStart={() => setAction("ocr")}
                  onFinish={() => setAction(null)}
                />
              )}
            </div>
            <span className="block">{ocrData?.accountName}</span>
            <div className="relative inline-block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip((prev) => !prev);
                }}
                className=" hover:underline flex items-center gap-1 text-sm"
              >
                More info
                <span className="text-xs">➤</span>
              </button>

              {showTooltip && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-48 -translate-x-1/2 mt-2 w-60 text-sm text-white bg-black rounded-lg shadow-xl p-3 z-50"
                >
                  {/* Tooltip arrow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-60">
                    <div className="w-2 h-2 bg-[#1d293d] rotate-45"></div>
                  </div>

                  <ul className="space-y-1 break-words">
                    <li>
                      <strong>hasDisplayed:</strong>{" "}
                      {data.hasDisplayed ? "true" : "false"}
                    </li>
                    <li className="flex gap-2 items-center">
                      <strong>imageUrl:</strong>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(data.imageUrl);
                          setUploadsCopied(true);
                          setTimeout(() => setUploadsCopied(false), 1500);
                        }}
                        title={data.imageUrl}
                        className="truncate max-w-[140px] text-blue-400 hover:underline"
                      >
                        {data.imageUrl}
                      </button>
                      {uploadscopied && (
                        <span className=" text-xs ml-2">Copied!</span>
                      )}
                    </li>
                    <li>
                      <strong>isRequested:</strong>{" "}
                      {data.isRequested ? "true" : "false"}
                    </li>
                    <li className="flex gap-2 items-center">
                      <strong>receiptimageUrl:</strong>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            data.receiptimageUrl ?? ""
                          );
                          setReceiptCopied(true);
                          setTimeout(() => setReceiptCopied(false), 1500);
                        }}
                        title={data.receiptimageUrl}
                        className="truncate max-w-[140px] text-blue-400 hover:underline"
                      >
                        {data.receiptimageUrl}
                      </button>
                      {receiptcopied && (
                        <span className=" text-xs ml-2">Copied!</span>
                      )}
                    </li>
                    <li>
                      <strong>transactionType:</strong> Cash-In
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-gray-800"
            >
              &times;
            </button> */}

            <Button
              transactionID={data.id}
              receiptRequest={{
                requested: data.isRequested ?? false,
                timestamp: data.timestamp,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
