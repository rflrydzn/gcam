"use client";
// import { db } from "@/lib/firebase";
// import {
//   ref,
//   query,
//   limitToLast,
//   orderByKey,
//   get,
//   update,
// } from "firebase/database";
import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions"; // adjust path
import TransactionDetails from "@/components/TransactionDetails";
import TransactionHistory from "@/components/TransactionHistory";
import Image from "next/image";
import CashinIcon from "../../public/cashin2.png";
import ReceiptIcon from "../../public/receipt.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import TransactionCard from "@/components/TransactionCard";

type Transaction = {
  id: string;
  status: string;
  timestamp: string;
  imageUrl: string;
  isRequested: boolean;
  receiptimageUrl: string;
  hasDisplayed: boolean;
};

export default function Home() {
  const { data: transactions = [] } = useTransactions();
  // const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const getPriorityScore = (transaction: Transaction) => {
  if (transaction.isRequested && !transaction.hasDisplayed && transaction.status !== "rejected") return 100;
  if (transaction.status === "pending") return 80;
  if (transaction.hasDisplayed === true) return 0;
  return 0;
};

// Split into two groups: scored and unscored
const scored = transactions.filter((tx) => getPriorityScore(tx) > 0);
const unscored = transactions.filter((tx) => getPriorityScore(tx) === 0);

// Sort only the scored ones
const sortedScored = scored.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

// Then destructure
const [latestTransaction, ] = sortedScored;
  useEffect(() => console.log("latest", latestTransaction), [latestTransaction]);
  useEffect(
    () => console.log("pending", scored),
    [scored]
  
  );
  useEffect(()=> console.log("history", unscored), [])

  // let formatted = "";
  // if (latestTransaction && latestTransaction.timestamp) {
  //   const original = latestTransaction.timestamp;
  //   const date = new Date(original.replace(" ", "T"));

  //   const options: Intl.DateTimeFormatOptions = {
  //     year: "numeric",
  //     month: "long",
  //     day: "2-digit",
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //   };

  //   formatted = date
  //     .toLocaleString("en-US", options)
  //     .replace(" at ", " ")
  //     .replace(",", "")
  //     .replace("AM", "am")
  //     .replace("PM", "pm");
  // }

  function timeAgo(dateString: string) {
    const createdAt = new Date(dateString.replace(" ", "T")); // ensure valid ISO format
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec${seconds === 1 ? "" : "s"} ago`;
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const handleModal = (tx: Transaction) => {
    setModalOpen(true);
    setSelectedTransaction(tx);
  };

  const handleTransactionHistory = () => {
    setShowTransactionHistory(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <div>
      {showTransactionHistory && (
        <div className="absolute">
          <TransactionHistory
            data={unscored}
            onClose={() => setShowTransactionHistory(false)}
          />
        </div>
      )}
    <div className="bg-[#FFFFFF] mx-5 ">
      
      {/* <header className=" bg-slate-800 text-white text-center py-4">
        <h1 className="text-3xl font-bold">GCam</h1>
      </header> */}
      
      <div className="flex items-center my-3">
        <FontAwesomeIcon icon={faCircleUser} size="3x"/>
        <h1 className="text-2xl m-3">Hi, Admin Roy!</h1>
      </div>
      

      {/* <div
        {...swipeHandlers}
        className="relative flex flex-col bg-white text-gray-700 shadow-md w-full overflow-hidden rounded-xl transition-transform duration-300"
      > */}
        {/* {latestTransaction ? (
          <div className="border border-gray-300 rounded-lg shadow-md m-2 p-3 bg-white space-y-0.5">
            <span
              className={
                "inline-block uppercase p-1 " +
                (latestTransaction.status === "pending"
                  ? "bg-[#ffee99]"
                  : latestTransaction.status === "completed"
                  ? "bg-[#e5f9ef]"
                  : "bg-[#FF9800]")
              }
            >
              {latestTransaction.status}
            </span>

            <p className="text-[#666666] block">{formatted}</p>
            <img src={latestTransaction.imageUrl} className="rounded-lg" alt="transaction image"/>

            <Button transactionID={latestTransaction.id} />
          </div>
        ) : (
          <p>loading</p>
        )} */}

        {/* {latestTransaction ? (
          <>
            <div className="relative">
              <img
                src={latestTransaction.imageUrl}
                alt="transaction"
                className="h-80 w-full object-cover"
              />
              <div className="absolute left-6 -bottom-5 py-3 p-6 bg-white/80 shadow-none shadow-black/5 saturate-200 backdrop-blur-sm rounded-full border-gray-300 border">
                <p className="block text-sm font-medium -mt-1 text-gray-600">
                  {latestTransaction.status}
                </p>
              </div>
            </div>

            <div className="p-6 pt-12 flex items-start justify-between">
              <div className="w-48 max-w-full">
                <div className="flex items-center gap-1">
                  <img src={CashinIcon.src} className="w-8 h-8" alt="cashin" />
                  <h4 className="text-[1rem] font-semibold tracking-normal text-gray-900">
                    Cash-In
                  </h4>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-1">Type</p>
              </div>

              <div className="text-right w-full">
                <p className="text-sm font-bold text-gray-600">{formatted}</p>
                <p className="text-xs text-slate-500 italic mt-1">
                  (Swipe left to accept, right to reject)
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        )}
      </div> */}
      {latestTransaction ? (
        <TransactionCard transaction={latestTransaction} timeAgo={timeAgo}/>
      ) : (<p>Loading...</p>)}

      
      
      <div>
        <div className="relative flex flex-col my-9 w-full ">
          <div className="">
            <div className="flex items-center justify-between">
              <h5 className="text-slate-800 text-2xl font-semibold">
                Pending Transactions
              </h5>
              
            </div>
            <div className="max-h-64 overflow-y-auto">
              {scored.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                  onClick={() => handleModal(tx)}
                >
                  <div className="flex items-center gap-x-3">
                    <Image
                      src={tx.isRequested ? (ReceiptIcon) : (CashinIcon)}
                      alt="cashinicon"
                      className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                    />
                    <div>
                      <h6 className="text-slate-800 font-semibold">
                        {tx.isRequested ? ('Requesting receipt') : ('Cash-In')}
                      </h6>
                      <p className="text-slate-600 text-sm">{timeAgo(tx.timestamp)}</p>
                    </div>
                  </div>
                              <button className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4">OPEN</button>

                </div>
              ))}
            </div>

            {selectedTransaction && (
              <TransactionDetails
                isOpen={modalOpen}
                data={selectedTransaction}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

       <div>
        <div className="relative flex flex-col my-6 bg-white w-full">
          <div className="">
            <div className="flex items-center justify-between">
              <h5 className="text-slate-800 text-2xl font-semibold">
                Other Transactions
              </h5>
              <button
                onClick={handleTransactionHistory}
                className="text-slate-600 hover:text-slate-800"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              {unscored.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                  onClick={() => handleModal(tx)}
                >
                  <div className="flex items-center gap-x-3">
                    
                    <div>
                      <h6 className="text-slate-800 font-semibold">
                        {tx.status}
                      </h6>
                      <p className="text-slate-600 text-sm">Cash-In</p>
                    </div>
                  </div>
                  <h6 className="text-slate-600 font-medium">
                    {timeAgo(tx.timestamp)}
                  </h6>
                </div>
              ))}
            </div>

            {selectedTransaction && (
              <TransactionDetails
                isOpen={modalOpen}
                data={selectedTransaction}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
