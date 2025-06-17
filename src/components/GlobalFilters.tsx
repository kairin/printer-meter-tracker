
import React from 'react';

interface GlobalFiltersProps {
  startDate: string;
  endDate: string;
  filterSerial: string;
  filterName: string;
  filterModel: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilterSerialChange: (value: string) => void;
  onFilterNameChange: (value: string) => void;
  onFilterModelChange: (value: string) => void;
  overallEarliestDate: string | null;
  today: string;
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  startDate,
  endDate,
  filterSerial,
  filterName,
  filterModel,
  onStartDateChange,
  onEndDateChange,
  onFilterSerialChange,
  onFilterNameChange,
  onFilterModelChange,
  overallEarliestDate,
  today,
}) => {
  const activeFilterCount = [
    startDate !== (overallEarliestDate || new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]) || endDate !== today,
    filterSerial,
    filterName,
    filterModel,
  ].filter(Boolean).length;

  return (
    <details className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200" open={activeFilterCount > 0}>
      <summary className="text-lg font-semibold text-primary cursor-pointer hover:text-blue-700 transition-colors">
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-primary text-xs font-semibold rounded-full">
            {activeFilterCount} active
          </span>
        )}
      </summary>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="global-start-date" className="block text-sm font-medium text-mediumgray mb-1">Start Date:</label>
          <input
            type="date"
            id="global-start-date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={overallEarliestDate || undefined}
            max={endDate || today}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            aria-label="Global Start Date"
          />
        </div>
        <div>
          <label htmlFor="global-end-date" className="block text-sm font-medium text-mediumgray mb-1">End Date:</label>
          <input
            type="date"
            id="global-end-date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || overallEarliestDate || undefined}
            max={today}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            aria-label="Global End Date"
          />
        </div>
        <div>
          <label htmlFor="global-serial-filter" className="block text-sm font-medium text-mediumgray mb-1">
            Serial #:
          </label>
          <input
            type="text"
            id="global-serial-filter"
            value={filterSerial}
            onChange={(e) => onFilterSerialChange(e.target.value)}
            placeholder="Filter by serial..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            aria-label="Filter by Serial Number"
          />
        </div>
        <div>
          <label htmlFor="global-name-filter" className="block text-sm font-medium text-mediumgray mb-1">
            Name:
          </label>
          <input
            type="text"
            id="global-name-filter"
            value={filterName}
            onChange={(e) => onFilterNameChange(e.target.value)}
            placeholder="Filter by name..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            aria-label="Filter by Name"
          />
        </div>
        <div>
          <label htmlFor="global-model-filter" className="block text-sm font-medium text-mediumgray mb-1">
            Model:
          </label>
          <input
            type="text"
            id="global-model-filter"
            value={filterModel}
            onChange={(e) => onFilterModelChange(e.target.value)}
            placeholder="Filter by model..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            aria-label="Filter by Model"
          />
        </div>
      </div>
    </details>
  );
};

export default GlobalFilters;
