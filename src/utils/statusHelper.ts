
import { Printer, MeterReading, DeviceStatus } from '../types';

/**
 * Calculates the operational status of a printer.
 * @param printer The printer object.
 * * @param latestOverallDataDate The most recent reading date across all printers.
 * @param highUsageThreshold Pages printed between last two readings to flag as high usage.
 * @param daysThreshold Days since last reading to consider a printer's data stale.
 * @returns The calculated DeviceStatus.
 */
export const getPrinterStatus = (
  printer: Printer,
  latestOverallDataDate: string | null,
  highUsageThreshold: number,
  daysThreshold: number
): DeviceStatus => {
  if (!printer.readings || printer.readings.length === 0) {
    return DeviceStatus.NO_HISTORY; // No readings at all
  }
  if (printer.readings.length < 2) {
    // Not enough data for trend or recency check against its own history,
    // but could be stale if other printers have very recent data.
    if (latestOverallDataDate) {
        const printerLastReadingDate = new Date(printer.readings[0].date);
        const overallLatestDate = new Date(latestOverallDataDate);
        const diffTime = overallLatestDate.getTime() - printerLastReadingDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > daysThreshold) {
            return DeviceStatus.NEEDS_ATTENTION; // Single reading is old
        }
    }
    return DeviceStatus.NO_HISTORY; 
  }

  // Readings are assumed to be sorted by date ASC
  const sortedReadings = [...printer.readings].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestReading = sortedReadings[sortedReadings.length - 1];
  const previousReading = sortedReadings[sortedReadings.length - 2];

  // Check for high usage burst
  const usageSincePrevious = latestReading.reading - previousReading.reading;
  if (usageSincePrevious > highUsageThreshold) {
    return DeviceStatus.NEEDS_ATTENTION; // High recent usage
  }

  // Check for stale data relative to overall data freshness
  if (latestOverallDataDate) {
    const printerLastReadingDate = new Date(latestReading.date);
    const overallLatestDate = new Date(latestOverallDataDate);
    // Calculate difference in days, ignoring time component for this comparison
    const printerDateOnly = new Date(printerLastReadingDate.getFullYear(), printerLastReadingDate.getMonth(), printerLastReadingDate.getDate());
    const overallDateOnly = new Date(overallLatestDate.getFullYear(), overallLatestDate.getMonth(), overallLatestDate.getDate());

    const diffTime = overallDateOnly.getTime() - printerDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > daysThreshold) {
      return DeviceStatus.NEEDS_ATTENTION; // Data is stale
    }
  } else {
    // Fallback: If no overall latest date, check staleness against 'today' with a more lenient threshold.
    // This case should be rare if there's at least one printer with readings.
    const today = new Date();
    const printerLastReadingDate = new Date(latestReading.date);
    const diffTime = today.getTime() - printerLastReadingDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
     if (diffDays > daysThreshold + 15) { // Looser threshold for 'today' check
         return DeviceStatus.NEEDS_ATTENTION;
     }
  }

  return DeviceStatus.OPERATIONAL;
};
