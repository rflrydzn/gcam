"use client";

import Image from "next/image";
import { useState } from "react";
import TransactionDetails from "./TransactionDetails";
import CashinIcon from "../../public/cashin2.png";
import BackIcon from "../../public/BackIcon.svg";
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

  return (
    <div>
      <div className=" flex flex-col  bg-white   rounded-lg w-screen absolute z-50  overflow-y-auto dark:bg-primary-dark">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={onClose} >
              <BackIcon />
            </button>
            <h5 className="flex-1 text-center text-slate-800 text-lg font-semibold dark:text-white">
              Transaction History
            </h5>
            {/* Empty element to balance the layout */}
            <div className="w-8" /> {/* Same width as the back button */}
          </div>
          <div className="divide-y divide-slate-200">
            {data.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                onClick={() => handleModal(tx)}
              >
                
                <div className="flex items-center gap-x-3">
                  <Image
                    src={CashinIcon}
                    alt="cashinicon"
                    className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                  />
                  <div>
                    <h6 className="text-slate-800 font-semibold dark:text-white">
                      {tx.status}
                    </h6>
                    <p className="text-slate-600 text-sm dark:text-white">maria@gmail.com</p>
                  </div>
                </div>
                <h6 className="text-slate-600 font-medium dark:text-white">{tx.timestamp}</h6>
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
