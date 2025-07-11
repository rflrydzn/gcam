"use client";
interface Transaction {
  id: string;
  status: string;
  imageUrl: string;
  timestamp: string;
  receiptimageUrl?: string;
  isRequested?: boolean;
  hasDisplayed?: boolean;
}

interface TransactionProps {
  data: Transaction[];
  onClose: () => void;
}
const TransactionHistory = ({ data, onClose }: TransactionProps) => {
  return (
    <div>
      <div className=" flex flex-col  bg-white  border-slate-200 rounded-lg w-96 absolute z-50">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={onClose}>Back</button>
            <h5 className="text-slate-800 text-lg font-semibold">
              Transaction History
            </h5>
          </div>
          <div className="divide-y divide-slate-200">
            {data.map((tx, index) => (
                            <div key={index} className="flex items-center justify-between pb-3 pt-3 last:pb-0">
              <div className="flex items-center gap-x-3">
                <img
                  src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg"
                  alt="Maria Jimenez"
                  className="relative inline-block h-8 w-8 rounded-full object-cover object-center"
                />
                <div>
                  <h6 className="text-slate-800 font-semibold">{tx.status}</h6>
                  <p className="text-slate-600 text-sm">maria@gmail.com</p>
                </div>
              </div>
              <h6 className="text-slate-600 font-medium">{tx.timestamp}</h6>
            </div>
            ))}

           

          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
