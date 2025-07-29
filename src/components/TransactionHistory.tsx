"use client";

import Image from "next/image";
import { useState } from "react";
import TransactionDetails from "./TransactionDetails";
import CashinIcon from "../../public/cashin2.png";
import BackIcon from "../../public/BackIcon.svg";
import WhiteBackIcon from "../../public/white.svg";
import { formatTime, formatDate } from "@/lib/dateTimeFormat";

interface Transaction {
  id: string;
  status: string;
  imageUrl: string;
  timestamp: string;
  receiptimageUrl?: string;
  isRequested?: boolean;
  hasDisplayed?: boolean;
}

interface TransactionProps {
  data: Transaction[];
  onClose: () => void;
}

const TransactionHistory = ({ data, onClose }: TransactionProps) => {
  const [isModalOpen, SetIsModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleModal = (tx: Transaction) => {
    SetIsModalOpen(true);
    setSelectedTransaction(tx);
  };

  const groupByDate = (transactions: Transaction[]) => {
    return transactions.reduce(
      (groups: { [key: string]: Transaction[] }, tx) => {
        const dateKey = formatDate(tx.timestamp);
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(tx);
        return groups;
      },
      {}
    );
  };

  const grouped = groupByDate(data);

  return (
    <div>
      <div className=" flex flex-col  bg-white   rounded-lg w-screen absolute z-50  overflow-y-auto dark:bg-primary-dark">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={onClose}>
              <BackIcon className="block dark:hidden" />
              <WhiteBackIcon className="hidden dark:block" />
            </button>
            <h5 className="flex-1 text-center text-slate-800 text-xl font-semibold dark:text-white">
              Transaction History
            </h5>
            {/* Empty element to balance the layout */}
            <div className="w-8" /> {/* Same width as the back button */}
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {Object.entries(grouped).map(([date, transactions]) => (
              <div key={date} className="mb-4">
                <h6 className="text-slate-500 text-2xl font-semibold mb-2">
                  {date}
                </h6>

                {transactions.map((tx, index) => (
                  <div
                    key={index}
                    onClick={() => handleModal(tx)}
                    className="flex justify-between items-center px-2 py-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-x-2">
                      <Image
                        src={CashinIcon}
                        alt="cashin"
                        className="h-8 w-8 object-cover"
                      />
                      <div>
                        <div className="font-semibold text-lg capitalize dark:text-white">
                          {tx.status}
                        </div>
                      </div>
                    </div>
                    <span className={`text-md font-medium`}>
                      {formatTime(tx.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            <TransactionDetails
              data={selectedTransaction!}
              isOpen={isModalOpen}
              onClose={() => SetIsModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
