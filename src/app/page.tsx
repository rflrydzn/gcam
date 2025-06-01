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
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { data: transactions = [], isLoading, error } = useTransactions();

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return Number(b.timestamp) - Number(a.timestamp);
  });

  const [latestTransaction, ...rest] = sortedTransactions;

  return (
    <div>
      {/* Header */}
      <header className="border-b-2 border-gray-300 p-4">
        <h1 className="text-4xl">GCam</h1>
      </header>

      {/* Main Container */}
      <div className="flex">
        {/* Left Side */}
        <div className="border-r-2 border-gray-300 p-4 w-3/5">
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
            {latestTransaction && <Button transactionID={latestTransaction.id}/>}
          </div>
          <div>
        <h2 className="text-3xl">Transaction History</h2>
        <div className="">
          {rest.map((ts) => (
            <ul className="border-2 p-4" key={ts.id}>
              <li className="">
                status: {ts.status}, time: {ts.timestamp}
                {ts.status === 'pending' ? <Button transactionID={ts.id}/> : null}
              </li>
            </ul>
          ))}
        </div>
      </div>
        </div>
        {/* Right Side */}
        <div>
          <h2>Upload File</h2>
          <input type="file"></input>
        </div>
      </div>
    </div>
  );
}
