"use client";
import { Transaction } from "@/types/types";
import { timeAgo } from "@/lib/dateTimeFormat";
import TransactionDetails from "@/components/TransactionDetails";
import { OtherTransactionsSkeleton } from "./Skeleton";

interface Props {
  onHandleTransactionHistory: () => void;
  isQueryLoading: boolean;
  unscored: Transaction[];
  selectedTransaction: Transaction | null;
  modalOpen: boolean;
  onSelectTransaction: (tx: Transaction) => void;
  onCloseModal: () => void;
}

const OtherTransactions = ({
  onHandleTransactionHistory,
  isQueryLoading,
  unscored,
  selectedTransaction,
  modalOpen,
  onSelectTransaction,
  onCloseModal,
}: Props) => {
  return (
    <div className="relative flex flex-col bg-white w-full dark:bg-primary-dark">
      <div className="flex items-center justify-between">
        <h5 className="text-slate-800 text-2xl font-semibold dark:text-white">
          Other Transactions
        </h5>
        <button
          onClick={onHandleTransactionHistory}
          className="text-slate-600 hover:text-slate-800 dark:text-white"
        >
          View all
        </button>
      </div>

      {!isQueryLoading ? (
        <div className="divide-y divide-slate-500">
          {unscored.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between pb-3 pt-3 last:pb-0 cursor-pointer"
              onClick={() => onSelectTransaction(tx)}
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
        </div>
      ) : (
        <OtherTransactionsSkeleton />
      )}

      {selectedTransaction && (
        <TransactionDetails
          isOpen={modalOpen}
          data={selectedTransaction}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
};

export default OtherTransactions;
