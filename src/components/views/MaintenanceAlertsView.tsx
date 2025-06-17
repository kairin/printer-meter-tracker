
import React from 'react';
import { Printer, DeviceStatus, ProcessedPrinterData } from '../../types';

interface MaintenanceAlertsViewProps {
  printers: ProcessedPrinterData[]; // Receives globally filtered and processed printers
}

const MaintenanceAlertsView: React.FC<MaintenanceAlertsViewProps> = ({ printers }) => {
  // Printers prop already has status calculated based on global filters.
  const printersNeedingAttention = printers.filter(p => p.status === DeviceStatus.NEEDS_ATTENTION);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-primary mb-4">Maintenance & Alerts</h2>
      <p className="text-mediumgray">
        This view consolidates information about printers requiring attention, based on current global filters.
        It could also show reminders for scheduled maintenance, or alerts for low toner/supplies in the future.
      </p>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-darkgray">Printers Currently Needing Attention (within filtered range):</h3>
        {printersNeedingAttention.length > 0 ? (
          <ul className="list-disc list-inside text-mediumgray ml-4 mt-2">
            {printersNeedingAttention.map(printer => (
              <li key={printer.id} className="text-danger">
                {printer.name} ({printer.model}) - Status: {printer.status}
                {/* Readings shown here are already filtered by global date range */}
                {printer.readings && printer.readings.length > 0 && 
                 ` (Last reading in range: ${new Date(printer.readings[printer.readings.length - 1].date).toLocaleDateString()})`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-mediumgray mt-2">No printers currently flagged as 'Needs Attention' based on active filters.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-darkgray">Future Enhancements:</h3>
        <ul className="list-disc list-inside text-mediumgray ml-4">
          <li>Scheduled maintenance reminders.</li>
          <li>Toner/supply level indicators (if API available).</li>
          <li>Consumables replacement tracking.</li>
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceAlertsView;
