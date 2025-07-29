"use client";

const Skeleton = () => {
  return (
    <div
      role="status"
      className="max-w-md p-4 space-y-4  divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;

export const HeaderSkeleton = () => (
  <div className="flex items-center justify-between animate-pulse py-8 ">
    <div className="flex items-center gap-x-3">
      <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className=" bg-gray-300 dark:bg-gray-700 rounded-full w-7 h-7" />
  </div>
);

export const TransactionCardSkeleton = () => (
  <div
    role="status"
    className="flex items-center justify-center h-[212px] w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
  ></div>
);

// components/skeletons/PendingTransactionsSkeleton.tsx
export const PendingTransactionsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between pb-3 pt-3 last:pb-0 animate-pulse space-y-2"
        >
          <div className="flex items-center gap-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>
          <div className="px-5 py-2.5 bg-gray-300 dark:bg-gray-700 rounded-3xl w-20 h-8" />
        </div>
      ))}
    </>
  );
};

export const OtherTransactionsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between pb-3 pt-3 last:pb-0 animate-pulse"
        >
          <div className="flex items-center gap-x-3">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>
          <div className="px-5 py-2.5 bg-gray-300 dark:bg-gray-700 rounded w-20 h-3" />
        </div>
      ))}
    </>
  );
};
