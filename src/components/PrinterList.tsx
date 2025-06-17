
import React from 'react';
import { Printer } from '../types';
import PrinterCard from './PrinterCard';

interface PrinterListProps {
  printers: Printer[];
  onLogReadingClick: (printer: Printer) => void;
  onViewHistoryClick: (printer: Printer) => void;
  listTitle: string;
}

const PrinterList: React.FC<PrinterListProps> = ({ printers, onLogReadingClick, onViewHistoryClick, listTitle }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-darkgray mb-6 pb-2 border-b-2 border-primary">{listTitle}</h2>
      {printers.length === 0 ? (
        <p className="text-mediumgray">No printers in this category yet. Add one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {printers.map(printer => (
            <PrinterCard 
              key={printer.id} 
              printer={printer} 
              onLogReadingClick={onLogReadingClick}
              onViewHistoryClick={onViewHistoryClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrinterList;
