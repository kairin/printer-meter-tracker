import React from 'react';
import { Printer, MeterReading, DeviceStatus } from '../types';
import { calculateTotalCostForPrinter } from '../utils/costCalculations'; // Import new utility

interface PrinterCardProps {
  printer: Printer; // Printer object now includes 'status'
  onLogReadingClick: (printer: Printer) => void;
  onViewHistoryClick: (printer: Printer) => void;
}

const PrinterCard: React.FC<PrinterCardProps> = ({ printer, onLogReadingClick, onViewHistoryClick }) => {
  const latestReading = printer.readings.length > 0 
    ? [...printer.readings].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  const currentMeterValue = latestReading ? latestReading.reading : 'N/A';
  const lastReadingDate = latestReading ? new Date(latestReading.date).toLocaleDateString() : 'N/A';
  const totalCost = calculateTotalCostForPrinter(printer); // Calculate total cost

  const getStatusBadgeClass = (status?: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.OPERATIONAL:
        return 'bg-green-100 text-green-700';
      case DeviceStatus.NEEDS_ATTENTION:
        return 'bg-red-100 text-red-700';
      case DeviceStatus.NO_HISTORY:
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-semibold text-primary">{printer.name}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${printer.type === 'Full Colour' ? 'bg-pink-100 text-pink-700' : 'bg-gray-200 text-gray-700'}`}>
            {printer.type}
          </span>
        </div>
        <p className="text-sm text-mediumgray mb-3">{printer.model}</p>

        {printer.status && (
          <div className="mb-3">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getStatusBadgeClass(printer.status)}`}>
              Status: {printer.status}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-mediumgray">Current Reading:</span>
            <span className="font-semibold text-darkgray">{typeof currentMeterValue === 'number' ? currentMeterValue.toLocaleString() : currentMeterValue}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-mediumgray">Last Reading Date:</span>
            <span className="text-darkgray">{lastReadingDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-mediumgray">Installed:</span>
            <span className="text-darkgray">{new Date(printer.installationDate).toLocaleDateString()}</span>
          </div>
          {printer.location && (
            <div className="flex justify-between text-sm">
              <span className="text-mediumgray">Location:</span>
              <span className="text-darkgray text-right break-words">{printer.location}</span>
            </div>
          )}
          {printer.ipAddress && (
            <div className="flex justify-between text-sm">
              <span className="text-mediumgray">IP Address:</span>
              <span className="text-darkgray">{printer.ipAddress}</span>
            </div>
          )}
           <div className="flex justify-between text-sm pt-1 border-t border-gray-200 mt-2">
            <span className="text-mediumgray font-semibold">Total Cost Incurred:</span>
            <span className="font-bold text-primary">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => onLogReadingClick(printer)}
          className="w-full sm:w-auto flex-1 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md transition-colors duration-150"
          aria-label={`Log new reading for ${printer.name}`}
        >
          Log New Reading
        </button>
        <button
          onClick={() => onViewHistoryClick(printer)}
          className="w-full sm:w-auto flex-1 px-4 py-2 text-sm font-medium text-primary bg-blue-100 hover:bg-blue-200 rounded-md border border-primary transition-colors duration-150"
          aria-label={`View history for ${printer.name}`}
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default PrinterCard;