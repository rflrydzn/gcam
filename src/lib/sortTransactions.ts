import { Transaction } from "@/types/types";

export const getPriorityScore = (transaction: Transaction): number => {
  if (
    transaction.isRequested &&
    !transaction.hasDisplayed &&
    transaction.status !== "rejected"
  )
    return 100;
  if (transaction.status === "pending") return 80;
  if (transaction.hasDisplayed === true) return 0;
  return 0;
};

export const getSortedTransactions = (transactions: Transaction[]) => {
  const scored = transactions.filter((tx) => getPriorityScore(tx) > 0);
  const unscored = transactions.filter((tx) => getPriorityScore(tx) === 0);

  const sortedScored = scored.sort(
    (a, b) => getPriorityScore(b) - getPriorityScore(a)
  );
  const [latestTransaction] = sortedScored;

  return { scored, unscored, latestTransaction };
};
