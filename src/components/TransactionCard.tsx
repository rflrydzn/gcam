import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "@/components/ImageModal";
import Button from "@/components/Button";
import CheckMark from "@/components/Checkmark";
import CrossMark from "@/components/Crossmark";
import styles from "./UploadAnimation.module.css"

type Transaction = {
    id: string;
    status: string;
    timestamp: string;
    imageUrl: string;
    isRequested: boolean;
    receiptimageUrl: string;
    hasDisplayed: boolean;
  };

export default function TransactionCard({ transaction, timeAgo }: { transaction: Transaction, timeAgo: (timestamp: string) => string}) {
  const [action, setAction] = useState<"accepted" | "rejected" | null>(null);
    
  const handleAccept = () => {
    setAction("accepted");
    setTimeout(() => setAction(null), 2000);
  };

  const handleReject = () => {
    setAction("rejected");
    setTimeout(() => setAction(null), 2000);
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
  <div className={`${styles.shadow} absolute top-0 left-0 w-full h-full rounded-[8px]`}></div>

      <div className="relative border w-full h-[212px] rounded-[8px] px-5 py-6 flex flex-col gap-2 bg-white">
        <div className="flex justify-between">
          <h1 className="text-xl leading-6">09xx xxx xxxx</h1>
          <div className="flex items-center justify-center flex-row space-x-1">
            <FontAwesomeIcon icon={faClipboard} style={{ fontSize: "25px" }} />
            <span className="cursor-not-allowed">Copy</span>
          </div>
        </div>

        <span className="text-[14px] leading-6">Cash-In</span>

        <ImageModal img={transaction.imageUrl} />

        <Button transactionID={transaction.id} onAccept={()=> handleAccept()} onReject={()=> handleReject()}/>
        {/* <p>{transaction.id}</p> */}
        <span>{timeAgo(transaction.timestamp)}</span>
      </div>
    </div>
  );
}