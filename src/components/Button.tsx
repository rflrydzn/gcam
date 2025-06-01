"use client";
import { db } from "@/lib/firebase";
import {
  ref,
  query,
  limitToLast,
  orderByKey,
  get,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions"; // adjust path

const Button = ({status}: {status: string}) => {
    const [loading, setLoading] = useState(false);
    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
          const transactonRef = ref(db, "transactions");
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
    return (
        <button className="border-2 p-4"
            onClick={() => updateStatus(status)}>
            {status === 'completed' ? "TRANSACTION COMPLETED" : status === 'rejected' ? "REJECT TRANSACTION" : "UNKOWN TRANSACTION"}
        </button>
    )

}

export default Button;