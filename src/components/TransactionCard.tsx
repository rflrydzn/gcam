import { useState } from "react";
import ImageModal from "@/components/ImageModal";
import Button from "@/components/Button";
import CheckMark from "@/components/Checkmark";
import CrossMark from "@/components/Crossmark";
import styles from "./UploadAnimation.module.css";
import CopyButton from "./CopyButton";
import GeminiIcon from "../../public/gemini-color.svg";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

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
    "accepted" | "rejected" | "ocr" | "anonymous" | null
  >(null);
  const [ocrData, setOcrData] = useState<OCR>({
    isTransaction: true,
    number: "09xx xxx xxxx",
    accountName: "xxx... x",
    amount: "...",
  });
  const [isOcr, setIsOcr] = useState(false);
  const [fontawesomeIcon, setFontawesomeIcon] = useState<IconDefinition>(faEyeSlash);
  const { user } = useAuth();

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

  const handleOCR = async (imageUrl: string) => {
    if (!user) {
      setAction("anonymous");
      setFontawesomeIcon(faLock);
      setTimeout(() => setAction(null), 5000)
      return;
    }
    setAction("ocr");
    try {
      const res = await fetch("/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();
      console.log(data);
      setOcrData(data);
      setIsOcr(true);
      setAction(null);
    } catch (err) {
      console.error("Error sending image", err);
    }
  };

  return (
    <div className="relative">
      {action === "accepted" && (
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10">
          <CheckMark />
        </div>
      )}
      {action === "rejected" && (
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10">
          <CrossMark />
        </div>
      )}

      {action === "ocr" && (
        <div className="absolute inset-0 bg-white/80  backdrop-blur-sm flex items-center justify-center z-10">
          <div>
            <img
              src="https://static.wikia.nocookie.net/logopedia/images/d/d2/Gemini_2024_animated.gif"
              width={100}
            />
            <p>Processing...</p>
          </div>
        </div>
      )}

      {action === "anonymous" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10" onClick={() => setAction(null)}>
          <div className="items-center justify-center flex h-full flex-col">
            <FontAwesomeIcon icon={fontawesomeIcon} size="4x" />
            <p className="p-2">Please login.</p>
          </div>
        </div>
      )}
      <div
        className={`${styles.shadow} absolute top-0 left-0 w-full h-full rounded-[8px]`}
      ></div>

      <div className="relative border w-full h-[212px] rounded-[8px] px-5 py-6 flex flex-col gap-[1px] bg-white">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl leading-6">
              {!ocrData.isTransaction
                ? "Not a transaction."
                : `${ocrData.number} - ₱${ocrData.amount}`}
            </h1>
            <h1>{ocrData.isTransaction && ocrData.accountName}</h1>
            <span className="text-[14px] leading-6">
              {ocrData.isTransaction && "Cash-In"}
            </span>
          </div>

          <div className="flex items-start pt-1">
            {isOcr && ocrData.isTransaction ? (
              <CopyButton value={ocrData.number} />
            ) : ocrData.isTransaction ? (
              <button
                className="border rounded-2xl px-3 py-1 flex items-center gap-1 text-sm"
                onClick={() => handleOCR(transaction.imageUrl)}
              >
                OCR <GeminiIcon />
              </button>
            ) : null}
          </div>
          {/* <img src="https://static.wikia.nocookie.net/logopedia/images/d/d2/Gemini_2024_animated.gif" /> */}
        </div>

        <ImageModal
          img={transaction.imageUrl}
          onUnauthorized={() => handleUnauthorized(faEyeSlash)}
        />

        <Button
          transactionID={transaction.id}
          onAccept={() => handleAccept()}
          onReject={() => handleReject()}
          onUnauthorized={() => handleUnauthorized(faLock)}
        />
        {/* <p>{transaction.id}</p> */}
        <span>{timeAgo(transaction.timestamp)}</span>
      </div>
    </div>
  );
}
