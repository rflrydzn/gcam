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
import { useState } from "react";

const Button = ({transactionID}: {transactionID: string}) => {
    const [, setLoading] = useState(false);
    const updateStatus = async (transactionID: string, newStatus: string) => {
        setLoading(true);
        try {
          const transactionRef = ref(db, `transactions/${transactionID}`);
      
          await update(transactionRef, { status: newStatus });
          alert(`Status set to "${newStatus}"`);
        } catch (err) {
          console.error("Error updating status:", err);
        } finally {
          setLoading(false);
        }
      };
    return (
        <>
            <button className="border-2 p-4 bg-green-500" onClick={() => updateStatus(transactionID, "completed")}>
                TRANSACTION COMPLETED
            </button>

            <button className="border-2 p-4 bg-red-500" onClick={() => updateStatus(transactionID, "rejected")}>
                REJECT TRANSACTION
            </button>
        </>
    )
}

export default Button;