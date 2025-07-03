import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase"; // adjust this path if needed

type Transaction = {
    id: string;
    status: string;
    timestamp: string;
    imageUrl: string;
    isRequested: boolean;
    receiptimageUrl: string;
    hasDisplayed: boolean;
  };
  
  const fetchTransactions = async (): Promise<Transaction[]> => {
    const snapshot = await get(ref(db, "transactions"));
    const data = snapshot.val();
  
    if (!data || typeof data !== "object") return [];
  
    return Object.entries(data).reverse().map(([key, value]) => ({
      id: key,
      ...(value as Omit<Transaction, "id">),
    }));
  };

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
};