import React from "react";
import { useAtomValue } from "jotai";
import { globalLoadingAtom } from "@/lib/atoms";
import { useAuth } from "@/hooks/useAuth";

export default function PulseLoader() {
  const { user } = useAuth();

  const isLoading = useAtomValue(globalLoadingAtom);
  if (!isLoading) return null;

  const bgOpacity = user
    ? "bg-white/100 dark:bg-primary-dark/100"
    : "bg-white/40 dark:bg-primary-dark/40";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center  ${bgOpacity} transition-opacity duration-700 animate-fadeOut`}
    >
      <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse" />
    </div>
  );
}
