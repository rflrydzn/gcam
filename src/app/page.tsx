"use client";
import { db } from '@/lib/firebase';
import { ref, query, limitToLast, orderByKey, get, update } from "firebase/database";
import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions"; // adjust path

type Transaction = {
  id: string;
  status: string;
  timestamp: number;
  imageUrl: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { data: transactions = [], isLoading, error } = useTransactions();
  const [latestTransaction, ...rest] = transactions;

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const transactonRef = ref(db, 'transactions');
      const latestQuery = query(transactonRef, orderByKey(), limitToLast(1));
      const snapshot = await get(latestQuery);
      

      if (snapshot.exists()) {
        const data = snapshot.val();
        const key = Object.keys(data)[0];
        const transactionRef = ref(db, `transactions/${key}`);

        await update(transactionRef, { status: newStatus });
        alert(`Status set to "${newStatus}"`);
      } else {
        alert("No transaction found.");
      }

    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  // const TransactionsList = () => {
  //   const { data, isLoading, error } = useTransactions();

  //   if (isLoading) return <p>Loading...</p>;
  //   if (error) return <p>Error: {error.message}</p>;

  //   return (
  //     <ul>
  //       {data?.map((tx) => (
  //         <li key={tx.id}>
  //           <p>Status: {tx.status}</p>
  //           <p>Timestamp: {tx.timestamp}</p>
  //           <img src={tx.imageUrl} alt="Transaction" width={100} />
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };
  
  
  
  return (
    <div>
      {/* Header */}
      <header className='border-b-2 border-gray-300 p-4'>
        <h1 className='text-4xl'>GCam</h1>
      </header>

      {/* Main Container */}
      <div className='flex'>

        {/* Left Side */}
        <div className='border-r-2 border-gray-300 p-4 w-3/5'>
          <h2 className='text-3xl'>Latest Transaction</h2>
          <div className='border-2 w-full h-96'>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : latestTransaction ? (
              <div>
                <p>Status: {latestTransaction.status}</p>
                <p>Timestamp: </p>
                {latestTransaction.imageUrl && (
                  <img src={latestTransaction.imageUrl} alt="Transaction" width={200} />
                )}
              </div>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
          {/* Buttons */}
          <div>
            <button onClick={() => updateStatus("accepted")} className='border-2 p-4 bg-green-600'>TRANSACTION COMPLETE</button>
            <button onClick={() => updateStatus("rejected")} className='border-2 p-4 bg-red-600'>REJECT TRANSACTION</button>
          </div>
        </div>

        <div>
          <h2>Upload File</h2>
          <input type="file"></input>
        </div>
      
      </div>

      <div>
        <h2 className='text-3xl'>Transaction History</h2>
        <div className=''>
          
        </div>
      </div>
    </div>
  );
}
