"use client";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    status: string;
    imageUrl: string;
    timestamp: string;
    receiptimageUrl?: string;
    isRequested?: boolean;
    hasDisplayed?: boolean;
  };
}


import Button from "./Button";
const TransactionDetails = ({ data, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg w-[90%] max-w-md relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        <h1 className="text-xl font-bold mb-4">Status: {data.status}</h1>
        <p className="mb-2 text-gray-600">Timestamp: {data.timestamp}</p>
        <p>id: {data.id}</p>
        <img src={data.imageUrl} alt="Transaction" className="rounded-lg mb-4" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-gray-800"
        >
          &times;
        </button>

        <Button transactionID={data.id}/>
      </div>
    </div>
  );
};

export default TransactionDetails;