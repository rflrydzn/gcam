// components/PendingTransaction.tsx
import Image from "next/image";
import CashinIcon from "../../public/cashin2.png";
import CashinIconDark from "../../public/cashin-dark.png";
import ReceiptIcon from "../../public/receipt.png";
import ReceiptIconDark from "../../public/receipt-dark.png";
import { timeAgo } from "@/lib/dateTimeFormat";
import { useTheme } from "next-themes";
import { Transaction } from "@/types/types";
import { PendingTransactionsSkeleton } from "./Skeleton";

interface Props {
  scored: Transaction[];
  latestTransaction?: Transaction;
  isQueryLoading: boolean;
  onSelectTransaction: (tx: Transaction) => void;
}

const PendingTransaction = ({
  scored,
  latestTransaction,
  isQueryLoading,
  onSelectTransaction,
}: Props) => {
  const { theme } = useTheme();

  return (
    <div className="relative flex flex-col my-9 w-full">
      <div>
        <div className="flex items-center justify-between">
          <h5 className="text-slate-800 text-2xl font-semibold dark:text-white">
            Pending Transactions
          </h5>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {!isQueryLoading ? (
            <div>
              {scored
                .filter((tx) => tx.id !== latestTransaction?.id)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                    onClick={() => onSelectTransaction(tx)}
                  >
                    <div className="flex items-center gap-x-3">
                      <Image
                        src={
                          tx.isRequested
                            ? theme === "dark"
                              ? ReceiptIconDark
                              : ReceiptIcon
                            : theme === "dark"
                            ? CashinIconDark
                            : CashinIcon
                        }
                        alt="icon"
                        className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                      />
                      <div>
                        <h6 className="text-slate-800 font-semibold dark:text-white">
                          {tx.isRequested ? "Requesting receipt" : "Cash-In"}
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
            <PendingTransactionsSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingTransaction;
