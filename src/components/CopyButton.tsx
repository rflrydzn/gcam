import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import {faClipboard} from "@fortawesome/free-regular-svg-icons"

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleCopy}>
      <FontAwesomeIcon icon={faClipboard} style={{ fontSize: "25px" }} />

      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded z-10">
          Copied!
        </div>
      )}
    </div>
  );
}