"use client";
import { db } from "@/lib/firebase";
import {
  ref,
  // query,
  // limitToLast,
  // orderByKey,
  // get,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions"; // adjust path
import Button from "@/components/Button";
import TransactionDetails from "@/components/TransactionDetails";

export default function Home() {
  const { data: transactions = [], isLoading, error } = useTransactions();
  const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getPriorityScore = (transactions: any) => {
    if (transactions.isRequested === true && transactions.hasDisplayed === false) return 100
    if (transactions.status === 'pending') return 80
    return 0
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    return getPriorityScore(b) - getPriorityScore(a)
  });

  const [latestTransaction, ...rest] = sortedTransactions;
  useEffect(() => console.log("rest", rest), [rest]);


let formatted = "";
if (latestTransaction && latestTransaction.timestamp) {
  const original = latestTransaction.timestamp;
  const date = new Date(original.replace(" ", "T"));

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  formatted = date.toLocaleString("en-US", options)
    .replace(" at ", " ")
    .replace(",", "")
    .replace("AM", "am")
    .replace("PM", "pm");
}

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

const handleModal = (tx: any) => {
  setModalOpen(true);
  setSelectedTransaction(tx)
}
  return (
    <div className="bg-[#FFFFFF] w-full min-h-screen">
      <header className=" bg-[#007AFF] text-white text-center py-4">
        <h1 className="text-3xl font-bold">GCam</h1>
      </header>
      <div className="">
        
        {latestTransaction ? (
        <div className="border border-gray-300 rounded-lg shadow-md m-2 p-3 bg-white space-y-0.5">
        <span className={'inline-block uppercase p-1 ' + (latestTransaction.status === 'pending' ? 'bg-[#ffee99]' : latestTransaction.status === 'completed' ? 'bg-[#e5f9ef]' : 'bg-[#FF9800]')}>{latestTransaction.status}</span>
        
        <p className="text-[#666666] block">{formatted}</p>
        <img src={latestTransaction.imageUrl} className="rounded-lg"/>
        
          <Button transactionID={latestTransaction.id}/>
        
      </div>
      ) : (<p>loading</p>)}
      </div>

      <div>
        
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-slate-800 text-lg font-semibold">
                Latest Customers
              </h5>
              <a
                href="#"
                className="text-slate-600"
              >
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-200">
            {rest.map((tx, index) => (
              <div key={tx.id} className="flex items-center justify-between pb-3 pt-3 last:pb-0" onClick={()=> handleModal(tx)}>

                <div className="flex items-center gap-x-3">
                  <img
                    src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg"
                    alt="Maria Jimenez"
                    className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                  />
                  <div>
                    <h6 className="text-slate-800 font-semibold">
                      {tx.status}
                    </h6>
                    <p className="text-slate-600 text-sm">
                      maria@gmail.com
                    </p>
                  </div>
                </div>
                <h6 className="text-slate-600 font-medium">
                  {timeAgo(tx.timestamp)}
                </h6>
              </div>
            ))}
            
              
              
              </div>

                              {selectedTransaction && (<TransactionDetails isOpen={modalOpen} data={selectedTransaction} onClose={()=> setModalOpen(false)}/>
)}
            </div>
          </div>
        </div>
      </div>
      

  );
}
