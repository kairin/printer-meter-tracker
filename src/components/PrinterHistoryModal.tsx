import React from 'react';
import { Printer } from '../types';
import Modal from './Modal';
import ReadingHistoryChart from './ReadingHistoryChart';
import { calculatePeriodicCostsForPrinter, calculateTotalCostForPrinter, PeriodicCostDetail } from '../utils/costCalculations';

interface PrinterHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  printer: Printer | null;
}

const PrinterHistoryModal: React.FC<PrinterHistoryModalProps> = ({ isOpen, onClose, printer }) => {
  if (!printer) return null;

  const periodicCosts = calculatePeriodicCostsForPrinter(printer);
  const totalPrinterCost = calculateTotalCostForPrinter(printer);
  
  // Readings for the chart (sorted oldest to newest)
  const chartReadings = [...printer.readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Define responsive width classes for the modal
  const modalWidthClasses = "md:max-w-2xl lg:max-w-4xl xl:w-4/5 xl:max-w-screen-xl";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Cost & Usage History: ${printer.name}`}
      maxWidthClass={modalWidthClasses}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-darkgray">{printer.name} - {printer.model}</h3>
          <p className="text-sm text-mediumgray">Type: {printer.type}</p>
          {printer.ipAddress && <p className="text-sm text-mediumgray">IP: {printer.ipAddress}</p>}
          {printer.location && <p className="text-sm text-mediumgray">Location: {printer.location}</p>}
          <p className="text-sm text-mediumgray">Installed: {new Date(printer.installationDate).toLocaleDateString()}</p>
        </div>
        
        <ReadingHistoryChart readings={chartReadings} />

        <div>
          <h4 className="text-md font-semibold text-darkgray mb-2">Cost & Usage Breakdown:</h4>
          {periodicCosts.length > 0 ? (
            <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-mediumgray uppercase tracking-wider">Period End</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-mediumgray uppercase tracking-wider">Start Meter</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-mediumgray uppercase tracking-wider">End Meter</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-mediumgray uppercase tracking-wider">Usage</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-mediumgray uppercase tracking-wider">Cost</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-mediumgray uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {periodicCosts.map((period: PeriodicCostDetail, index: number) => (
                    <tr key={`${period.periodEndDate}-${index}`}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-darkgray">{new Date(period.periodEndDate).toLocaleDateString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-darkgray">{period.startReadingValue.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-darkgray">{period.endReadingValue.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-darkgray">{period.chargeablePages.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-darkgray">${period.cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="px-3 py-2 text-sm text-darkgray whitespace-normal break-words max-w-xs">{period.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <p className="text-sm text-mediumgray">{printer.readings.length < 2 ? "Need at least two readings to calculate costs." : "No cost data available."}</p>
          )}
          {periodicCosts.length > 0 && (
             <div className="mt-3 text-right">
                <p className="text-md font-semibold text-darkgray">
                  Total Historical Cost: 
                  <span className="text-primary ml-2">${totalPrinterCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </p>
            </div>
          )}
        </div>
         <div className="flex justify-end pt-2">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md border border-transparent"
            >
                Close
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default PrinterHistoryModal;