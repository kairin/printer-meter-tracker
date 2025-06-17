
import React, { useState, useMemo, useCallback } from 'react';
import { Printer, MeterReading, PrinterType, DeviceStatus, ProcessedPrinterData } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Navbar, { ActiveView } from './components/Navbar';
import PrinterList from './components/PrinterList';
import Modal from './components/Modal';
import LogReadingForm from './components/LogReadingForm';
import PrinterHistoryModal from './components/PrinterHistoryModal';
import SummaryView from './components/SummaryView';
import AnalyticsDashboard from './components/AnalyticsDashboard'; 
import GlobalFilters from './components/GlobalFilters'; // New
import { initialPrinters } from './data/initialData';
import { getSchoolFromLocation, getDepartmentFromLocation } from './utils/textExtractors';
import { getPrinterStatus } from './utils/statusHelper';
import { HIGH_USAGE_THRESHOLD, DAYS_SINCE_LAST_READING_THRESHOLD } from './constants';

// View Components
import InvoicesPOsView from './components/views/InvoicesPOsView';
import KyoceraFleetView from './components/views/KyoceraFleetView';
import MisidentifiedPrintersView from './components/views/MisidentifiedPrintersView';
import MaintenanceAlertsView from './components/views/MaintenanceAlertsView';

type GroupingMode = 'type' | 'location' | 'school' | 'department';

const App: React.FC = () => {
  const [printersData, setPrintersData] = useLocalStorage<Printer[]>('printers', initialPrinters);
  const [isLogReadingModalOpen, setIsLogReadingModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPrinterForModal, setSelectedPrinterForModal] = useState<Printer | null>(null);
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('type');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Global Filter States
  const overallEarliestDateForAllPrinters = useMemo(() => {
    let earliest: string | null = null;
    printersData.forEach(printer => {
      printer.readings.forEach(reading => {
        if (!earliest || new Date(reading.date) < new Date(earliest)) {
          earliest = reading.date;
        }
      });
    });
    return earliest ? new Date(earliest).toISOString().split('T')[0] : null;
  }, [printersData]);

  const oneYearAgoStatic = useMemo(() => new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0], []);
  const todayStatic = useMemo(() => new Date().toISOString().split('T')[0], []);

  const initialGlobalStartDate = overallEarliestDateForAllPrinters 
    ? (new Date(overallEarliestDateForAllPrinters) > new Date(oneYearAgoStatic) ? overallEarliestDateForAllPrinters : oneYearAgoStatic) 
    : oneYearAgoStatic;

  const [globalStartDate, setGlobalStartDate] = useState<string>(initialGlobalStartDate);
  const [globalEndDate, setGlobalEndDate] = useState<string>(todayStatic);
  const [globalFilterSerial, setGlobalFilterSerial] = useState<string>('');
  const [globalFilterName, setGlobalFilterName] = useState<string>('');
  const [globalFilterModel, setGlobalFilterModel] = useState<string>('');

  const handleLogReading = (printerId: string, newReading: MeterReading) => {
    setPrintersData(prevPrinters =>
      prevPrinters.map(p =>
        p.id === printerId 
          ? { ...p, readings: [...p.readings, newReading].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) } 
          : p
      )
    );
  };
  
  const openLogReadingModal = (printer: Printer) => {
    setSelectedPrinterForModal(printer);
    setIsLogReadingModalOpen(true);
  };

  const openHistoryModal = (printer: Printer) => {
    // For history modal, always show ALL readings, not the globally filtered ones.
    // So we find the original printer data.
    const originalPrinter = printersData.find(p => p.id === printer.id) || printer;
    setSelectedPrinterForModal(originalPrinter);
    setIsHistoryModalOpen(true);
  };

  const globallyFilteredPrinters = useMemo((): ProcessedPrinterData[] => {
    let filtered = [...printersData];

    // Apply text filters first
    if (globalFilterSerial) {
      filtered = filtered.filter(p => p.id.toLowerCase().includes(globalFilterSerial.toLowerCase()));
    }
    if (globalFilterName) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(globalFilterName.toLowerCase()));
    }
    if (globalFilterModel) {
      filtered = filtered.filter(p => p.model.toLowerCase().includes(globalFilterModel.toLowerCase()));
    }
    
    // Then process for date range and status
    const sDate = new Date(globalStartDate);
    const eDate = new Date(globalEndDate);
    eDate.setHours(23, 59, 59, 999); // Inclusive end date

    return filtered.map(printer => {
      const readingsInDateRange = printer.readings.filter(r => {
        const readingDate = new Date(r.date);
        return readingDate >= sDate && readingDate <= eDate;
      }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Pass the printer with its readings scoped to the global date range for status calculation
      const status = getPrinterStatus(
        { ...printer, readings: readingsInDateRange }, 
        globalEndDate, // Use globalEndDate as the reference for staleness
        HIGH_USAGE_THRESHOLD, 
        DAYS_SINCE_LAST_READING_THRESHOLD
      );
      
      return { 
        ...printer, 
        readings: readingsInDateRange, // `readings` property now contains date-scoped readings
        status: status 
      };
    }).filter(p => p.readings.length > 0); // Remove printers with no readings in the selected global date range

  }, [printersData, globalStartDate, globalEndDate, globalFilterSerial, globalFilterName, globalFilterModel]);


  const summaryStats = useMemo(() => {
    let totalChargeableBWPages = 0;
    let totalChargeableFCPages = 0;
    let totalEstimatedCost = 0;
    
    const statusCounts: Record<DeviceStatus, number> = {
      [DeviceStatus.OPERATIONAL]: 0,
      [DeviceStatus.NEEDS_ATTENTION]: 0,
      [DeviceStatus.NO_HISTORY]: 0,
    };

    // Use globallyFilteredPrinters for all summary calculations
    globallyFilteredPrinters.forEach(printer => {
      // Status is already calculated based on global date range and is part of `printer` object
      statusCounts[printer.status!]++; // Non-null assertion as status is set in globallyFilteredPrinters

      // Cost and page calculations should use the `readings` which are already date-scoped
      if (printer.readings && printer.readings.length > 1) {
        let printerTotalCost = 0;
        let printerChargeableBW = 0;
        let printerChargeableFC = 0;

        for (let i = 1; i < printer.readings.length; i++) {
          const firstReading = printer.readings[i-1].reading;
          const latestReadingVal = printer.readings[i].reading;
          const chargeablePagesInPeriod = Math.max(0, latestReadingVal - firstReading);

          if (printer.type === PrinterType.BLACK_AND_WHITE && typeof printer.bwRate === 'number') {
            printerChargeableBW += chargeablePagesInPeriod;
            printerTotalCost += chargeablePagesInPeriod * printer.bwRate;
          } else if (printer.type === PrinterType.FULL_COLOUR && typeof printer.fcRate === 'number') {
            printerChargeableFC += chargeablePagesInPeriod;
            printerTotalCost += chargeablePagesInPeriod * printer.fcRate;
          }
        }
        totalChargeableBWPages += printerChargeableBW;
        totalChargeableFCPages += printerChargeableFC;
        totalEstimatedCost += printerTotalCost;
      }
    });
    
    return {
      totalDevices: globallyFilteredPrinters.length, // Count of devices *after* all global filters
      totalChargeableBWPages,
      totalChargeableFCPages,
      totalEstimatedCost,
      latestDataDate: globalEndDate, // Summary is "as of" the global filter's end date
      statusCounts,
    };
  }, [globallyFilteredPrinters, globalEndDate]);


  const groupedPrinters = useMemo(() => {
    const groups: Record<string, ProcessedPrinterData[]> = {};

    globallyFilteredPrinters.forEach(printer => { // Use globally filtered and processed printers
      let groupKey: string;
      switch (groupingMode) {
        case 'location':
          groupKey = printer.location || "Unknown Location";
          break;
        case 'school':
          groupKey = getSchoolFromLocation(printer.location);
          break;
        case 'department':
          groupKey = getDepartmentFromLocation(printer.location);
          break;
        case 'type':
        default:
          groupKey = printer.type;
          break;
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(printer);
    });

    if (groupingMode === 'type') {
        if (!groups[PrinterType.BLACK_AND_WHITE]) groups[PrinterType.BLACK_AND_WHITE] = [];
        if (!groups[PrinterType.FULL_COLOUR]) groups[PrinterType.FULL_COLOUR] = [];
    }
    return groups;
  }, [globallyFilteredPrinters, groupingMode]); 

  const sortedGroupNames = useMemo(() => Object.keys(groupedPrinters).sort((a,b) => {
      if (groupingMode === 'type') {
        if (a === PrinterType.BLACK_AND_WHITE && b === PrinterType.FULL_COLOUR) return -1;
        if (a === PrinterType.FULL_COLOUR && b === PrinterType.BLACK_AND_WHITE) return 1;
      }
      return a.localeCompare(b);
  }), [groupedPrinters, groupingMode]);


  const groupingOptions: { mode: GroupingMode, label: string }[] = [
    { mode: 'type', label: 'By Type' },
    { mode: 'location', label: 'By Location' },
    { mode: 'school', label: 'By School' },
    { mode: 'department', label: 'By Department' },
  ];

  const renderActiveView = () => {
    // Pass globallyFilteredPrinters to views that display lists of printers
    // Note: AnalyticsDashboard and PrinterList within the dashboard view will use `groupedPrinters` which is derived from `globallyFilteredPrinters`.
    // SummaryView uses `summaryStats` also derived from `globallyFilteredPrinters`.
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <SummaryView
              totalDevices={summaryStats.totalDevices}
              totalChargeableBWPages={summaryStats.totalChargeableBWPages}
              totalChargeableFCPages={summaryStats.totalChargeableFCPages}
              totalEstimatedCost={summaryStats.totalEstimatedCost}
              latestDataDate={summaryStats.latestDataDate}
              statusCounts={summaryStats.statusCounts}
            />
            {/* AnalyticsDashboard receives printers that have been globally filtered and processed */}
            <AnalyticsDashboard printers={globallyFilteredPrinters} /> 
            <div className="my-8 p-4 bg-white rounded-md shadow">
              <h2 className="text-lg font-semibold text-darkgray mb-2">Group Printers By:</h2>
              <div className="flex flex-wrap gap-2">
                {groupingOptions.map(opt => (
                  <button
                    key={opt.mode}
                    onClick={() => setGroupingMode(opt.mode)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150
                      ${groupingMode === opt.mode 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {sortedGroupNames.map(groupName => {
              const currentGroupPrinters = groupedPrinters[groupName];
               // Ensure list title is shown even if empty after filtering, if grouping by type
              if (currentGroupPrinters.length > 0 || groupingMode === 'type') {
                return (
                  <PrinterList 
                    key={groupName}
                    printers={currentGroupPrinters} // These are already globally filtered and processed
                    onLogReadingClick={openLogReadingModal}
                    onViewHistoryClick={openHistoryModal}
                    listTitle={groupName}
                  />
                );
              }
              return null;
            })}
          </>
        );
      case 'invoices':
        return <InvoicesPOsView />; // This view might need its own data source and filtering logic unrelated to printers
      case 'kyoceraFleet':
        // KyoceraFleetView expects the full list of printers and will do its own Kyocera-specific filtering internally
        // *after* applying global text/date filters.
        return <KyoceraFleetView 
                  printers={globallyFilteredPrinters} 
                  globalStartDate={globalStartDate}
                  globalEndDate={globalEndDate}
                  overallEarliestDate={overallEarliestDateForAllPrinters} // Pass this for its own date logic if needed, though global filters handle it
                />;
      case 'misidentified':
        return <MisidentifiedPrintersView printers={globallyFilteredPrinters} />;
      case 'maintenance':
        return <MaintenanceAlertsView printers={globallyFilteredPrinters} />;
      default:
        return <p>View not found.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-lightgray">
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <GlobalFilters
          startDate={globalStartDate}
          endDate={globalEndDate}
          filterSerial={globalFilterSerial}
          filterName={globalFilterName}
          filterModel={globalFilterModel}
          onStartDateChange={setGlobalStartDate}
          onEndDateChange={setGlobalEndDate}
          onFilterSerialChange={setGlobalFilterSerial}
          onFilterNameChange={setGlobalFilterName}
          onFilterModelChange={setGlobalFilterModel}
          overallEarliestDate={overallEarliestDateForAllPrinters}
          today={todayStatic}
        />
      </div>
      
      <main className="container mx-auto p-4 md:p-8 pt-0"> {/* Reduced top padding for main */}
        {renderActiveView()}
      </main>

      {selectedPrinterForModal && (
        <Modal isOpen={isLogReadingModalOpen} onClose={() => setIsLogReadingModalOpen(false)} title="Log New Meter Reading">
          <LogReadingForm 
            printer={selectedPrinterForModal} 
            onLogReading={(printerId, newReading) => {
              handleLogReading(printerId, newReading);
              setIsLogReadingModalOpen(false); 
            }} 
            onClose={() => setIsLogReadingModalOpen(false)} 
          />
        </Modal>
      )}

      {selectedPrinterForModal && (
        <PrinterHistoryModal 
          isOpen={isHistoryModalOpen} 
          onClose={() => setIsHistoryModalOpen(false)} 
          printer={selectedPrinterForModal} // This uses the original printer data for full history
        />
      )}
    </div>
  );
};

export default App;
