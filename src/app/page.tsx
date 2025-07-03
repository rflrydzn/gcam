"use client";
import { db } from "@/lib/firebase";
import {
  ref,
  query,
  limitToLast,
  orderByKey,
  get,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions"; // adjust path
import Button from "@/components/Button";

type Transaction = {
  id: string;
  status: string;
  timestamp: number;
  imageUrl: string;
  isRequested: boolean;
  receiptimageUrl: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { data: transactions = [], isLoading, error } = useTransactions();
  const [file, setFile] = useState<File | null>(null)

  const sortedTransactions = [...transactions].sort((a, b) => {
    const aNeedsReceipt = a.isRequested === true && a.receiptimageUrl === "";
    const bNeedsReceipt = b.isRequested === true && b.receiptimageUrl === "";
  
    if (aNeedsReceipt && !bNeedsReceipt) return -1;
    if (!aNeedsReceipt && bNeedsReceipt) return 1;
  
    const aPending = a.status === "pending";
    const bPending = b.status === "pending";
  
    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
  
    return Number(b.timestamp) - Number(a.timestamp);
  });

  const [latestTransaction, ...rest] = sortedTransactions;
  useEffect(() => console.log("rest", rest), [rest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  const handleUpload = async (transactionID: string) => {
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
    <div>
      {/* Header */}
      <header className="border-b-2 border-gray-300 p-4">
        <h1 className="text-4xl">GCam</h1>
      </header>

      {/* Main Container */}
      <div className="flex">
        {/* Left Side */}
        <div className="border-r-2 border-gray-300  w-3/5">
          <h2 className="text-3xl">Latest Transaction</h2>
          <div className="border-2 w-full h-96">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : latestTransaction ? (
              <div>
                <p>Status: {latestTransaction.status}</p>
                <p>Timestamp: </p>
                <p>isRequested: {latestTransaction.isRequested}</p>
                <p>{latestTransaction.receiptimageUrl != "" ? 'uploaded' : 'null'}</p>
                {latestTransaction.imageUrl && (
                  <img
                    src={latestTransaction.imageUrl}
                    alt="Transaction"
                    width={200}
                  />
                )}
              </div>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
          {/* Buttons */}
          <div>
            {latestTransaction && (
              <div>
              <Button transactionID={latestTransaction.id} />
              <input type="file" onChange={handleChange}></input>
              <button onClick={() => handleUpload(latestTransaction.id)}>Upload now</button>
              </div>
              
            )}
          </div>
          <h2>Upload File</h2>
           {/* <input type="file" onChange={handleChange}></input>
           <button onClick={handleUpload}>Upload now</button> */}
        </div>
        {/* Right Side */}
        <div className="w-2/5">
          <div>
            <h2 className="text-3xl">Transaction History</h2>
            
              {rest.map((ts) => (
                <ul className="border-2 p-4" key={ts.id}>
                  <li className="flex items-center justify-between gap-2">
                    status: {ts.status}, time: {ts.timestamp}
                    {ts.status === "pending" ? (
                      <div className="flex gap-2"><Button transactionID={ts.id} /></div>
                    ) : null}
                  </li>
                </ul>
              ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}
