"use client";
import { fetchOcr } from "@/lib/api/ocr";
import GeminiIcon from "../../public/gemini-color.svg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import CopyButton from "./CopyButton";
import { useAuth } from "@/hooks/useAuth";
type OCRButtoProps = {
  imageUrl: string;
  onResult?: (data: OCR) => void;
  onUnauthorized?: () => void;
  onStart?: () => void;
  onFinish?: () => void;
};

type OCR = {
  isTransaction: boolean;
  number: string;
  accountName: string;
  amount: number;
};

const OCRButton = ({
  imageUrl,
  onResult,
  onUnauthorized,
  onStart,
  onFinish,
}: OCRButtoProps) => {
  const { data, refetch } = useQuery({
    queryKey: ["ocrData", imageUrl],
    queryFn: () => fetchOcr(imageUrl),
    enabled: false,
  });

  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData(["ocrData", imageUrl]) as
    | OCR
    | undefined;
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      onUnauthorized?.();
      return;
    }
    if (!cached) {
      onStart?.();
      console.log("🚫 No cached data, calling OCR...");
      refetch().finally(() => onFinish?.()); // Only fetch if not cached
    }
  };

  useEffect(() => {
    if (data) {
      onResult?.(data);
      console.log(data);
    }
  }, [data, onResult]);
  useEffect(() => console.log("user", user), [user]);
  const result = cached || data;

  return !result ? (
    <button
      className="backdrop-blur-sm bg-white/20 dark:bg-[#1d293d]/40 border border-white/30 dark:border-white/20 text-black dark:text-white rounded-2xl px-3 py-1 flex items-center gap-1 text-sm shadow-md transition"
      onClick={handleClick}
    >
      <span className="flex text-black justify-center items-center gap-1 dark:text-white">
        OCR <GeminiIcon />
      </span>
    </button>
  ) : result.isTransaction ? (
    <CopyButton value={result?.number} />
  ) : null;
};

export default OCRButton;
