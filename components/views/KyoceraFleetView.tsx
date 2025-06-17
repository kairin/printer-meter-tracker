
import React, { useState, useMemo, useCallback } from 'react';
import { Printer, PrinterType, DeviceStatus, MeterReading, KyoceraProcessedPrinter, ProcessedPrinterData } from '../../types';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
// getPrinterStatus and constants are now handled globally in App.tsx for the incoming `printers` prop.

interface KyoceraFleetViewProps {
  printers: ProcessedPrinterData[]; // Receives already globally filtered and processed printers
  globalStartDate: string; // For context if needed, though printers are already filtered
  globalEndDate: string;   // For context if needed
  overallEarliestDate: string | null; // For context if needed
}

type SortableKeys = 'id' | 'name' | 'model' | 'location' | 'installationDate' | 'status' | 'latestReadingValue' | 'latestReadingDate' | 'readingsInRangeCount';

interface SortConfig {
  key: SortableKeys | null;
  direction: 'ascending' | 'descending';
}

const KyoceraFleetView: React.FC<KyoceraFleetViewProps> = ({ 
    printers: globallyFilteredPrinters, 
    globalStartDate, 
    globalEndDate,
    overallEarliestDate
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });
  const [selectedPrinterIds, setSelectedPrinterIds] = useState<string[]>([]);

  // 1. Filter for Kyocera models from the globally pre-filtered list
  const kyoceraFilteredPrinters = useMemo(() => {
    return globallyFilteredPrinters.filter(
      (p) =>
        p.model.toLowerCase().includes('kyocera') ||
        p.model.toLowerCase().includes('taskalfa') ||
        p.name.toLowerCase().includes('kyocera')
    );
  }, [globallyFilteredPrinters]);

  // 2. Sort the Kyocera-specific list
  const sortedKyoceraPrinters = useMemo(() => {
    let processablePrinters = [...kyoceraFilteredPrinters];

    if (sortConfig.key) {
      processablePrinters.sort((a, b) => {
        let aValue, bValue;
        
        // The `printers` prop (globallyFilteredPrinters) already has `readings` scoped to global date range
        // and `status` calculated based on that.
        if (sortConfig.key === 'latestReadingValue') {
            aValue = a.readings.length > 0 ? a.readings[a.readings.length - 1].reading : -1;
            bValue = b.readings.length > 0 ? b.readings[b.readings.length - 1].reading : -1;
        } else if (sortConfig.key === 'latestReadingDate') {
            aValue = a.readings.length > 0 ? a.readings[a.readings.length - 1].date : '';
            bValue = b.readings.length > 0 ? b.readings[b.readings.length - 1].date : '';
        } else if (sortConfig.key === 'readingsInRangeCount') {
            aValue = a.readings.length;
            bValue = b.readings.length;
        } else if (sortConfig.key === 'status') {
            aValue = a.status; // status is from ProcessedPrinterData
            bValue = b.status;
        } else {
            aValue = a[sortConfig.key as keyof ProcessedPrinterData];
            bValue = b[sortConfig.key as keyof ProcessedPrinterData];
        }

        if (aValue === undefined || aValue === null) return 1; 
        if (bValue === undefined || bValue === null) return -1;
        
        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else { 
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return processablePrinters;
  }, [kyoceraFilteredPrinters, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableKeys) => {
    if (sortConfig.key !== key) {
      return null; 
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronUpIcon className="h-4 w-4 inline ml-1" />;
    }
    return <ChevronDownIcon className="h-4 w-4 inline ml-1" />;
  };
  
  const handleSelectPrinter = (printerId: string) => {
    setSelectedPrinterIds(prevSelected =>
      prevSelected.includes(printerId)
        ? prevSelected.filter(id => id !== printerId)
        : [...prevSelected, printerId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPrinterIds(sortedKyoceraPrinters.map(p => p.id));
    } else {
      setSelectedPrinterIds([]);
    }
  };

  const isAllSelected = sortedKyoceraPrinters.length > 0 && selectedPrinterIds.length === sortedKyoceraPrinters.length;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 my-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-primary mb-4">Kyocera Printer Fleet (ITE CW Management)</h2>
      
      {/* Filter UI is now handled by GlobalFilters component in App.tsx */}
      <p className="text-sm text-mediumgray mb-4">
        Showing {sortedKyoceraPrinters.length} Kyocera printer(s) based on active global filters. Selected: {selectedPrinterIds.length}.
      </p>

      {sortedKyoceraPrinters.length === 0 ? (
        <p className="text-mediumgray text-center py-4">
          {globallyFilteredPrinters.length === 0 ? "No printers match global filters." : "No Kyocera printers match the current filters or have data in the selected date range."}
        </p>
      ) : (
        <div className="overflow-x-auto w-full border border-gray-300 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider sticky left-0 bg-gray-100 z-30 border-r w-10 text-center">#</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider sticky left-10 bg-gray-100 z-20 border-r w-12">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all printers"
                  />
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider sticky left-[88px] bg-gray-100 z-10 border-r cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort('id')}
                  style={{ minWidth: '120px' }} 
                  title="Click to sort by Serial Number"
                >
                  Serial # {getSortIcon('id')}
                </th>
                <th scope="col" className="pl-6 pr-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('name')} title="Click to sort by Name">Name {getSortIcon('name')}</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('model')} title="Click to sort by Model" style={{minWidth: '150px'}}>Model {getSortIcon('model')}</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider" style={{minWidth: '120px'}}>Type</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider" style={{minWidth: '120px'}}>IP Address</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('location')} title="Click to sort by Location" style={{minWidth: '250px'}}>Location {getSortIcon('location')}</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('installationDate')} title="Click to sort by Installation Date" style={{minWidth: '120px'}}>Installed {getSortIcon('installationDate')}</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('status')} title="Click to sort by Status" style={{minWidth: '120px'}}>Status {getSortIcon('status')}</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider text-right hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('latestReadingValue')} title="Click to sort by Latest Reading Value" style={{minWidth: '120px'}}>Latest Reading</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('latestReadingDate')} title="Click to sort by Latest Reading Date" style={{minWidth: '150px'}}>Latest Reading Date</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider text-right hover:bg-gray-200 cursor-pointer" onClick={() => requestSort('readingsInRangeCount')} title="Click to sort by Number of Readings" style={{minWidth: '100px'}}># Readings</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider text-right" style={{minWidth: '100px'}}>B&W Rate</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-darkgray uppercase tracking-wider text-right" style={{minWidth: '100px'}}>FC Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedKyoceraPrinters.map((printer, index) => {
                const isSelected = selectedPrinterIds.includes(printer.id);
                const rowBackgroundColor = isSelected ? 'bg-blue-50' : 'bg-white';
                const stickyCellBackgroundColor = isSelected ? '#EFF6FF' : '#FFFFFF'; 
                const hoverClass = isSelected ? '' : 'hover:bg-lightgray';
                
                const latestReadingForDisplay = printer.readings.length > 0 ? printer.readings[printer.readings.length - 1] : null;

                return (
                  <tr 
                    key={printer.id} 
                    className={`transition-colors duration-150 ${hoverClass} ${isSelected ? 'bg-blue-50' : ''}`}
                    onClick={(e) => { 
                       if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                       if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') return; 
                       handleSelectPrinter(printer.id);
                    }}
                  >
                    <td className="px-2 py-3 whitespace-nowrap text-sm text-center text-mediumgray sticky left-0 z-30 border-r w-10" style={{ backgroundColor: stickyCellBackgroundColor }}>{index + 1}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm sticky left-10 z-20 border-r w-12" style={{ backgroundColor: stickyCellBackgroundColor }}>
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        checked={isSelected}
                        onChange={() => handleSelectPrinter(printer.id)}
                        onClick={(e) => e.stopPropagation()} 
                        aria-labelledby={`printer-name-${printer.id}`}
                      />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-darkgray font-medium sticky left-[88px] z-10 border-r" style={{ minWidth: '120px', backgroundColor: stickyCellBackgroundColor }}>{printer.id}</td>
                    <td id={`printer-name-${printer.id}`} className={`pl-6 pr-3 py-3 whitespace-nowrap text-sm text-mediumgray ${rowBackgroundColor}`}>{printer.name}</td>
                    <td className={`px-3 py-3 whitespace-normal text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '150px'}}>{printer.model}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '120px'}}>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${printer.type === PrinterType.FULL_COLOUR ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                            {printer.type}
                        </span>
                    </td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '120px'}}>{printer.ipAddress || 'N/A'}</td>
                    <td className={`px-3 py-3 whitespace-normal text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '250px'}}>{printer.location || 'N/A'}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '120px'}}>{new Date(printer.installationDate).toLocaleDateString()}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '120px'}}>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            printer.status === DeviceStatus.OPERATIONAL ? 'bg-green-100 text-green-700' :
                            printer.status === DeviceStatus.NEEDS_ATTENTION ? 'bg-red-100 text-red-700' :
                            printer.status === DeviceStatus.NO_HISTORY ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {printer.status || 'N/A'}
                        </span>
                    </td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray text-right ${rowBackgroundColor}`} style={{minWidth: '120px'}}>{latestReadingForDisplay ? latestReadingForDisplay.reading.toLocaleString() : 'N/A'}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray ${rowBackgroundColor}`} style={{minWidth: '150px'}}>{latestReadingForDisplay ? new Date(latestReadingForDisplay.date).toLocaleDateString() : 'N/A'}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray text-right ${rowBackgroundColor}`} style={{minWidth: '100px'}}>{printer.readings.length}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray text-right ${rowBackgroundColor}`} style={{minWidth: '100px'}}>{printer.bwRate !== undefined ? `$${printer.bwRate.toFixed(4)}` : 'N/A'}</td>
                    <td className={`px-3 py-3 whitespace-nowrap text-sm text-mediumgray text-right ${rowBackgroundColor}`} style={{minWidth: '100px'}}>{printer.fcRate !== undefined ? `$${printer.fcRate.toFixed(4)}` : 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KyoceraFleetView;
