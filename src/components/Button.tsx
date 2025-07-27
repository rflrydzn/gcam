"use client";
import { db } from "@/lib/firebase";
import {
  ref,
  // query,
  // limitToLast,
  // orderByKey,
  // get,
  update,
} from "firebase/database";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { isWithinADay } from "@/lib/dateTimeFormat";

type ButtonProps = {
  transactionID: string;
  onAccept?: () => void;
  onReject?: () => void;
  onUnauthorized?: () => void;
  onUpload?: (upload: boolean) => void;
  receiptRequest?: {
    requested: boolean;
    timestamp?: string;
    
  }
};
const Button = ({
  transactionID,
  onAccept,
  onReject,
  onUnauthorized,
  onUpload,
  receiptRequest,
}: ButtonProps) => {
  // const [file, setFile] = useState<File | null>(null);
  const [, setLoading] = useState(false);
  const [, setIsUploading] = useState(false);
  const { user } = useAuth();
  const isRecentRequest = receiptRequest?.requested && isWithinADay(receiptRequest.timestamp);
  const updateStatus = async (transactionID: string, newStatus: string) => {
    if (!user) {
      if (onUnauthorized) onUnauthorized();
      return;
    }
    setLoading(true);
    try {
      const transactionRef = ref(db, `transactions/${transactionID}`);

      await update(transactionRef, { status: newStatus });
      if (newStatus === "completed" && onAccept) onAccept();
      if (newStatus === "rejected" && onReject) onReject();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange =
    (transactionID: string) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      onUpload?.(true)
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("https://rddizon.pythonanywhere.com/receipt", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      try {
        const transactionRef = ref(db, `transactions/${transactionID}`);

        await update(transactionRef, { receiptimageUrl: result.url });
        // alert(`Receipt uploaded`);
        onUpload?.(false)
      } catch (err) {
        console.error("Error uploading receipt:", err);
        setIsUploading(false);
        
      }
    };
  return (
    <div className="flex w-full gap-2">
      <button
        className="flex-1 p-2 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4  "
        onClick={() => updateStatus(transactionID, "completed")}
      >
        <div className="flex justify-center gap-1">
          <FontAwesomeIcon icon={faCheck} className=""/>
        <span className="hidden [@media(min-width:391px)]:inline">Accept</span>
        </div>
        
      </button>

      <button
        className="flex-1 p-2 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4"
        onClick={() => updateStatus(transactionID, "rejected")}
      >
        <div className="flex justify-center gap-1">
              <FontAwesomeIcon icon={faXmark} className=""/>
        <span className="hidden [@media(min-width:391px)]:inline">Reject</span>
        </div>

      </button>
      <label
        className={`flex-1 p-2 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4 ${isRecentRequest && 'animate-bounce'} `}
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            onUnauthorized?.();
          }
        }}
      >
        <div className="flex justify-center gap-1">
           <FontAwesomeIcon icon={faCloudArrowUp} className=""/>
          <span className="hidden [@media(min-width:391px)]:inline">Upload</span>
        </div>
         
        
        <input
          type="file"
          className="hidden"
          onChange={handleChange(transactionID)}
        />
      </label>
    </div>
  );
};

export default Button;
