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
import ReceiptIcon from "../../public/receipt.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import TransactionCard from "@/components/TransactionCard";
import SignInModal from "@/components/SignInModal";
import { useAuth } from "@/hooks/useAuth";
import { useAtomValue } from "jotai";
import { globalLoadingAtom } from "@/lib/atoms";
import { faGears } from "@fortawesome/free-solid-svg-icons";
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
  const { user } = useAuth();
  const isLoading = useAtomValue(globalLoadingAtom);

  const getPriorityScore = (transaction: Transaction) => {
    if (
      transaction.isRequested &&
      !transaction.hasDisplayed &&
      transaction.status !== "rejected"
    )
      return 100;
    if (transaction.status === "pending") return 80;
    if (transaction.hasDisplayed === true) return 0;
    return 0;
  };

  // Split into two groups: scored and unscored
  const scored = transactions.filter((tx) => getPriorityScore(tx) > 0);
  const unscored = transactions.filter((tx) => getPriorityScore(tx) === 0);

  // Sort only the scored ones
  const sortedScored = scored.sort(
    (a, b) => getPriorityScore(b) - getPriorityScore(a)
  );

  // Then destructure
  const [latestTransaction] = sortedScored;
  useEffect(
    () => console.log("latest", latestTransaction),
    [latestTransaction]
  );
  // useEffect(() => console.log("pending", scored), [scored]);

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
    <>
      <div className="block sm:hidden dark:bg-primary-dark">
        {showTransactionHistory && (
          <div className="absolute">
            <TransactionHistory
              data={unscored}
              onClose={() => setShowTransactionHistory(false)}
            />
          </div>
        )}
        <div className="bg-[#FFFFFF]  dark:bg-primary-dark 0 mx-5  ">
          <div className="flex justify-between py-7">
            <div className="flex">
              <FontAwesomeIcon icon={faCircleUser} size="3x" className=" text-black dark:text-white"/>
              <h1 className="text-2xl m-3 dark:text-white">
                {user ? (
                  <p>Welcome back, Roy</p>
                ) : !isLoading ? (
                  <p className="text-sm text-black dark:text-white">
                    Guest mode. Please log in.
                  </p>
                ) : (
                  <p>Welcome back, Roy</p>
                )}
              </h1>
              
            </div>

            <SignInModal />
          </div>

          {latestTransaction ? (
            <TransactionCard
              transaction={latestTransaction}
              timeAgo={timeAgo}
            />
          ) : (
            <p>Loading...</p>
          )}

          <div>
            <div className="relative flex flex-col my-9 w-full ">
              <div className="">
                <div className="flex items-center justify-between">
                  <h5 className="text-slate-800 text-2xl font-semibold dark:text-white">
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
                          src={tx.isRequested ? ReceiptIcon : CashinIcon}
                          alt="cashinicon"
                          className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                        />
                        <div>
                          <h6 className="text-slate-800 font-semibold dark:text-white">
                            {tx.isRequested ? "Requesting receipt" : "Cash-In"}
                          </h6>
                          <p className="text-slate-600 text-sm dark:text-white">
                            {timeAgo(tx.timestamp)}
                          </p>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4">
                        OPEN
                      </button>
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
            <div className="relative flex flex-col  bg-white  w-full dark:bg-primary-dark">
              <div className="">
                <div className="flex items-center justify-between">
                  <h5 className="text-slate-800 text-2xl font-semibold dark:text-white">
                    Other Transactions
                  </h5>
                  <button
                    onClick={handleTransactionHistory}
                    className="text-slate-600 hover:text-slate-800 dark:text-white"
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
                          <h6 className="text-slate-800 font-semibold dark:text-white">
                            {tx.status}
                          </h6>
                          <p className="text-slate-600 text-sm dark:text-white">Cash-In</p>
                        </div>
                      </div>
                      <h6 className="text-slate-600 font-medium dark:text-white">
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
      <div className="hidden sm:flex  flex-col fixed inset-0 z-50 items-center justify-center bg-white text-black text-xl font-semibold w-full">
        <FontAwesomeIcon icon={faGears} size="10x" />
        <p className="w-1/  text-center m-4">
          Paki view sa cp lods, in progress pa ang app ni baroroy
        </p>
      </div>
    </>
  );
}
