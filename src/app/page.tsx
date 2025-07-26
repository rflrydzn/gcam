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
import CashinIconDark from "../../public/cashin-dark.png"
import ReceiptIcon from "../../public/receipt.png";
import ReceiptIconDark from "../../public/receipt-dark.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import TransactionCard from "@/components/TransactionCard";
import SignInModal from "@/components/SignInModal";
import { useAuth } from "@/hooks/useAuth";
import { useAtomValue } from "jotai";
import { globalLoadingAtom } from "@/lib/atoms";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { timeAgo } from "@/lib/dateTimeFormat";
import { useTheme } from "next-themes";
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
  const { data: transactions = [], isLoading: isQueryLoading } =
    useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const { user } = useAuth();
  const isLoading = useAtomValue(globalLoadingAtom);
  const {theme} = useTheme();
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
      <div className="block sm:hidden dark:bg-primary-dark ">
        {showTransactionHistory && (
          <div className="absolute">
            <TransactionHistory
              data={unscored}
              onClose={() => setShowTransactionHistory(false)}
            />
          </div>
        )}
        <div className="bg-[#FFFFFF]  dark:bg-primary-dark 0 mx-5 ">
          {!isQueryLoading ? (
            <div className="flex justify-between py-7">
            <div className="flex">
              <FontAwesomeIcon
                icon={faCircleUser}
                size="3x"
                className=" text-black dark:text-white w-12 h-12"
              />
              <h1 className=" m-3 dark:text-white">
                {user
                  ? "Welcome back, Roy"
                  : !isLoading
                  ? "Guest mode. Please log in."
                  : "Welcome back, Roy"}
              </h1>
            </div>
            <SignInModal />
          </div>
          ) : (
            <div
                       
                        className="flex items-center justify-between animate-pulse py-8 "
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <div className="space-y-2">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
                            
                          </div>
                        </div>
                        <div className=" bg-gray-300 dark:bg-gray-700 rounded-full w-7 h-7" />
                      </div>
          )}
          

          {latestTransaction ? (
            <TransactionCard
              transaction={latestTransaction}
              timeAgo={timeAgo}
            />
          ) : (
            <div
              role="status"
              className="flex items-center justify-center h-[212px] w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
            >
              
              
            </div>
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
                  {!isQueryLoading ? (
                    <div>
                      {scored.filter((tx) => tx.id !== latestTransaction?.id).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                          onClick={() => handleModal(tx)}
                        >
                          <div className="flex items-center gap-x-3">
                            <Image
src={
  tx.isRequested
    ? theme === 'dark'
      ? ReceiptIconDark
      : ReceiptIcon
    : theme === 'dark'
      ? CashinIconDark
      : CashinIcon
}                              alt="cashinicon"
                              className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                            />
                            <div>
                              <h6 className="text-slate-800 font-semibold dark:text-white">
                                {tx.isRequested
                                  ? "Requesting receipt"
                                  : "Cash-In"}
                              </h6>
                              <p className="text-slate-500 text-sm dark:text-gray-400">
                                {timeAgo(tx.timestamp)}
                              </p>
                            </div>
                          </div>
                          <button className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4">
                            DETAILS
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-3 pt-3 last:pb-0 animate-pulse space-y-2"
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <div className="space-y-2">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
                          </div>
                        </div>
                        <div className="px-5 py-2.5 bg-gray-300 dark:bg-gray-700 rounded-3xl w-20 h-8" />
                      </div>
                    ))
                  )}
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
                
                  {!isQueryLoading ? (<div className="divide-y divide-slate-200">
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
                          <p className="text-slate-500 text-sm dark:text-slate-400">
                            Cash-In
                          </p>
                        </div>
                      </div>
                      <h6 className="text-slate-500 font-medium dark:text-slate-400">
                        {timeAgo(tx.timestamp)}
                      </h6>
                    </div>
                  ))}
                  </div>) : (
                    Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-3 pt-3 last:pb-0 animate-pulse"
                      >
                        <div className="flex items-center gap-x-3">
                          
                          <div className="space-y-2">
                            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
                          </div>
                        </div>
                        <div className="px-5 py-2.5 bg-gray-300 dark:bg-gray-700 rounded w-20 h-3" />
                      </div>
                    ))
                  )}
                  
                

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
