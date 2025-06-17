
import React from 'react';
import { DeviceStatus } from '../types';

interface SummaryViewProps {
  totalDevices: number;
  totalChargeableBWPages: number;
  totalChargeableFCPages: number;
  totalEstimatedCost: number;
  latestDataDate: string | null; // ISO string or null if no data
  statusCounts: Record<DeviceStatus, number>;
}

const SummaryView: React.FC<SummaryViewProps> = ({
  totalDevices,
  totalChargeableBWPages,
  totalChargeableFCPages,
  totalEstimatedCost,
  latestDataDate,
  statusCounts,
}) => {
  const formattedDate = latestDataDate 
    ? new Date(latestDataDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
    : 'N/A';

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-primary">Overall Summary</h2>
        <p className="text-sm text-mediumgray">As of: <span className="font-semibold text-darkgray">{formattedDate}</span></p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        <SummaryCard title="Total Devices" value={formatNumber(totalDevices)} />
        <SummaryCard title="Total B&W Pages (Chargeable)" value={formatNumber(totalChargeableBWPages)} />
        <SummaryCard title="Total FC Pages (Chargeable)" value={formatNumber(totalChargeableFCPages)} />
        <SummaryCard title="Total Estimated Cost" value={`$${formatNumber(parseFloat(totalEstimatedCost.toFixed(2)))}`} />
      </div>
      <h3 className="text-lg font-semibold text-darkgray mt-6 mb-3">Device Status Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Operational" value={formatNumber(statusCounts[DeviceStatus.OPERATIONAL] || 0)} colorClass="bg-green-100 text-green-700" />
        <SummaryCard title="Needs Attention" value={formatNumber(statusCounts[DeviceStatus.NEEDS_ATTENTION] || 0)} colorClass="bg-red-100 text-red-700" />
        <SummaryCard title="No History" value={formatNumber(statusCounts[DeviceStatus.NO_HISTORY] || 0)} colorClass="bg-amber-100 text-amber-700" />
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string | number;
  colorClass?: string;
}

// SummaryCard: A reusable component to display a key metric in a styled card.
// It accepts a title, value, and an optional color class for flexible use across the application.
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, colorClass = "bg-lightgray" }) => {
  return (
    <div className={`${colorClass} p-4 rounded-md shadow`}>
      <h3 className={`text-sm font-medium ${colorClass.includes('lightgray') ? 'text-mediumgray' : ''} mb-1`}>{title}</h3>
      <p className={`text-2xl font-bold ${colorClass.includes('lightgray') ? 'text-darkgray' : ''}`}>{value}</p>
    </div>
  );
};

export default SummaryView;