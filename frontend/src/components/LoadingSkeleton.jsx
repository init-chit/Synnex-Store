// Loading Skeleton Components
export const GameCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-300"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="p-3"><div className="h-12 w-12 bg-gray-700 rounded"></div></td>
    <td className="p-3"><div className="h-4 w-32 bg-gray-700 rounded"></div></td>
    <td className="p-3"><div className="h-4 w-24 bg-gray-700 rounded"></div></td>
    <td className="p-3"><div className="h-4 w-20 bg-gray-700 rounded"></div></td>
    <td className="p-3"><div className="h-6 w-16 bg-gray-700 rounded"></div></td>
  </tr>
);

export const StatsCardSkeleton = () => (
  <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 animate-pulse">
    <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
    <div className="h-8 w-32 bg-gray-700 rounded"></div>
  </div>
);

