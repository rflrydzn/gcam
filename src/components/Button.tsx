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
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

type ButtonProps = {
  transactionID: string;
  onAccept?: () => void;
  onReject?: () => void;
  onUnauthorized?: () => void;
};
const Button = ({
  transactionID,
  onAccept,
  onReject,
  onUnauthorized,
}: ButtonProps) => {
  // const [file, setFile] = useState<File | null>(null);
  const [, setLoading] = useState(false);
  const [, setIsUploading] = useState(false);
  const { user } = useAuth();

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
        alert(`Receipt uploaded`);
      } catch (err) {
        console.error("Error uploading receipt:", err);
        setIsUploading(false);
      }
    };

  return (
    <div className="flex justify-between w-full">
      <button
        className="px-6 py-3 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4"
        onClick={() => updateStatus(transactionID, "completed")}
      >
        Accept
      </button>

      <button
        className="px-6 py-3 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4"
        onClick={() => updateStatus(transactionID, "rejected")}
      >
        Reject
      </button>
      <label
        className="px-6 py-3 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4 "
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            onUnauthorized?.();
          }
        }}
      >
        <div className="flex">
          <FontAwesomeIcon icon={faCloudArrowUp} />
          <p className="hidden pl-1 [@media(min-width:378px)]:inline">Upload</p>
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
