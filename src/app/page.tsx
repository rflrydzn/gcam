"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions"; // adjust path
import TransactionHistory from "@/components/TransactionHistory";
import TransactionCard from "@/components/TransactionCard";
import { timeAgo } from "@/lib/dateTimeFormat";
import { getSortedTransactions } from "../lib/sortTransactions";
import { Transaction } from "@/types/types";
import Header from "@/components/Header";
import PendingTransaction from "@/components/PendingTransactions";
import OtherTransactions from "@/components/OtherTransactions";
import DesktopNotice from "@/components/DesktopNotice";

export default function Home() {
  const { data: transactions = [], isLoading: isQueryLoading } =
    useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const { scored, unscored, latestTransaction } =
    getSortedTransactions(transactions);

  const handleModal = (tx: Transaction) => {
    setModalOpen(true);
    setSelectedTransaction(tx);
  };

  const handleTransactionHistory = () => {
    setShowTransactionHistory(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  useEffect(
    () => console.log("latest", latestTransaction),
    [latestTransaction]
  );

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
          <Header isLoading={isQueryLoading} />

          <TransactionCard transaction={latestTransaction} timeAgo={timeAgo} />

          <PendingTransaction
            scored={scored}
            latestTransaction={latestTransaction}
            isQueryLoading={isQueryLoading}
            onSelectTransaction={handleModal}
          />

          <OtherTransactions
            onHandleTransactionHistory={handleTransactionHistory}
            isQueryLoading={isQueryLoading}
            unscored={unscored}
            selectedTransaction={selectedTransaction}
            modalOpen={modalOpen}
            onSelectTransaction={handleModal}
            onCloseModal={() => setModalOpen(false)}
          />
        </div>
      </div>

      {/* Overlay for large screens */}
      <DesktopNotice />
    </>
  );
}
