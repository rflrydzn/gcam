import { useState } from "react";
import ImageModal from "@/components/ImageModal";
import Button from "@/components/Button";
import CheckMark from "@/components/Checkmark";
import CrossMark from "@/components/Crossmark";
import CopyButton from "./CopyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import UploadAnimation from "./UploadAnimation";
import OCRButton from "./OCRButton";
import { TransactionCardSkeleton } from "./Skeleton";
type Transaction = {
  id: string;
  status: string;
  timestamp: string;
  imageUrl: string;
  isRequested: boolean;
  receiptimageUrl: string;
  hasDisplayed: boolean;
};

type OCR = {
  isTransaction: boolean;
  number: string;
  accountName: string;
  amount: number | string;
};

export default function TransactionCard({
  transaction,
  timeAgo,
}: {
  transaction: Transaction;
  timeAgo: (timestamp: string) => string;
}) {
  const [action, setAction] = useState<
    | "accepted"
    | "rejected"
    | "ocr"
    | "anonymous"
    | "uploading"
    | "uploaded"
    | null
  >(null);
  const [ocrData, setOcrData] = useState<OCR>({
    isTransaction: true,
    number: "09xx xxx xxxx",
    accountName: "xxx... x",
    amount: "...",
  });
  const [isOcr] = useState(false);
  const [fontawesomeIcon, setFontawesomeIcon] =
    useState<IconDefinition>(faEyeSlash);
  const handleAccept = () => {
    setAction("accepted");
    setTimeout(() => setAction(null), 2000);
  };

  const handleReject = () => {
    setAction("rejected");
    setTimeout(() => setAction(null), 2000);
  };

  const handleUnauthorized = (logo: IconDefinition) => {
    setFontawesomeIcon(logo);
    setAction("anonymous");
    setTimeout(() => setAction(null), 5000);
  };

  // const handleOCR = async (imageUrl: string) => {
  //   if (!user) {
  //     setAction("anonymous");
  //     setFontawesomeIcon(faLock);
  //     setTimeout(() => setAction(null), 5000);
  //     return;
  //   }
  //   setAction("ocr");
  //   try {
  //     const res = await fetch("/api/", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ imageUrl }),
  //     });

  //     const data = await res.json();
  //     console.log(data);
  //     setOcrData(data);
  //     setIsOcr(true);
  //     setAction(null);
  //   } catch (err) {
  //     console.error("Error sending image", err);
  //   }
  // };
  const handleOCR = (data: OCR) => {
    setOcrData(data);
    console.log("card ocr", data);
  };

  const handleUpload = (isUploading: boolean) => {
    if (isUploading) {
      setAction("uploading");
      console.log("uploading");
    } else {
      setAction("uploaded");
      setTimeout(() => setAction(null), 5000);
      console.log("uploaded");
    }
  };
  const renderOverlayContent = () => {
    switch (action) {
      case "accepted":
        return <CheckMark text="accept" />;
      case "rejected":
        return <CrossMark />;
      case "uploading":
        return <UploadAnimation />;
      case "uploaded":
        return <CheckMark text="upload" />;
      case "ocr":
        return (
          <div className="flex flex-col items-center">
            <img
              src="https://static.wikia.nocookie.net/logopedia/images/d/d2/Gemini_2024_animated.gif"
              width={100}
            />
            <p>Processing...</p>
          </div>
        );
      case "anonymous":
        return (
          <div
            className="flex flex-col items-center h-full justify-center"
            onClick={() => setAction(null)}
          >
            <FontAwesomeIcon icon={fontawesomeIcon} size="4x" />
            <p className="p-2">Please login.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!transaction) return <TransactionCardSkeleton />;

  return (
    <div className="relative">
      {action && (
        <div className="absolute inset-0 bg-white/100 backdrop-blur-sm flex items-center justify-center z-10 dark:bg-primary-dark/80 dark:text-white">
          {renderOverlayContent()}
        </div>
      )}

      <div
        className={`shadow absolute top-0 left-0 w-full h-full rounded-[8px]`}
      ></div>

      <div className="relative border border-black w-full h-[212px] rounded-[8px] px-5 py-6 flex flex-col gap-[1px] bg-white dark:bg-primary-dark ">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl leading-6 dark:text-white">
              {!ocrData.isTransaction
                ? "Not a transaction."
                : `${ocrData.number} - ₱${ocrData.amount}`}
            </h1>
            <h1 className="dark:text-white">
              {ocrData.isTransaction && ocrData.accountName}
            </h1>
            <span className="text-[14px] leading-6 dark:text-white">
              {ocrData.isTransaction && "Cash-In"}
            </span>
          </div>

          <div className="flex items-start pt-1">
            {isOcr && ocrData.isTransaction ? (
              <CopyButton value={ocrData.number} />
            ) : ocrData.isTransaction ? (
              // <button
              //   className="border border-black rounded-2xl px-3 py-1 flex items-center gap-1 text-sm dark:border-white"
              //   onClick={() => handleOCR(transaction.imageUrl)}
              // >
              //   <span className="flex text-black justify-center items-center gap-1 dark:text-white">
              //     OCR <GeminiIcon />
              //   </span>
              // </button>
              <OCRButton
                imageUrl={transaction.imageUrl}
                onResult={(data) => handleOCR(data)}
                onUnauthorized={() => handleUnauthorized(faLock)}
                onStart={() => setAction("ocr")}
                onFinish={() => setAction(null)}
              />
            ) : null}
          </div>
          {/* <img src="https://static.wikia.nocookie.net/logopedia/images/d/d2/Gemini_2024_animated.gif" /> */}
        </div>

        <ImageModal
          img={transaction.imageUrl}
          onUnauthorized={() => handleUnauthorized(faEyeSlash)}
          caption={
            !ocrData.isTransaction
              ? "Not a transaction"
              : `${ocrData.number} - ₱${ocrData.amount}`
          }
        />

        <Button
          transactionID={transaction.id}
          onAccept={() => handleAccept()}
          onReject={() => handleReject()}
          onUnauthorized={() => handleUnauthorized(faLock)}
          onUpload={(upload) => handleUpload(upload)}
          receiptRequest={{
            requested: transaction.isRequested,
            timestamp: transaction.timestamp,
          }}
        />
        {/* <p>{transaction.id}</p> */}
        <span className="text-gray-500 dark:text-gray-400">
          {timeAgo(transaction.timestamp)}
        </span>
      </div>
      <style jsx>{`
        .shadow {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          border-radius: 8px;
          filter: blur(25px);
          z-index: 0;
          opacity: 1;
          overflow: hidden;
        }

        .shadow::before {
          content: "";
          position: absolute;
          top: -25%;
          left: -25%;
          height: 150%;
          width: 150%;
          background: conic-gradient(
            #4b82d4,
            #6a29e9,
            #4b82d4,
            #6a29e9,
            #c58357,
            #ffc940,
            #4b82d4
          );
          animation: shadow-animate 5s linear infinite;
        }

        @keyframes shadow-animate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
