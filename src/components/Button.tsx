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

const Button = ({ transactionID }: { transactionID: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [, setLoading] = useState(false);
  const updateStatus = async (transactionID: string, newStatus: string) => {
    setLoading(true);
    try {
      const transactionRef = ref(db, `transactions/${transactionID}`);

      await update(transactionRef, { status: newStatus });
      alert(`Status set to "${newStatus}"`);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (transactionID: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    }
  };

  return (
    <div className="flex justify-between text-2xl ">
      <button
        className="flex items-center rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick={() => updateStatus(transactionID, "completed")}
      >
        Accept
      </button>

      <button
        className="px-3 py-1.5  font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative bg-[#f6f7fb]"
        onClick={() => updateStatus(transactionID, "rejected")}
      >
        Reject
      </button>
      <label className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">

        Upload File
        <input type="file" className="hidden" onChange={handleChange(transactionID)} />
      </label>
    </div>
  );
};

export default Button;
