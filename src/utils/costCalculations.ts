import { Printer, MeterReading, PrinterType } from '../types';

export interface PeriodicCostDetail {
  periodStartDate: string;
  periodEndDate: string;
  startReadingValue: number;
  endReadingValue: number;
  chargeablePages: number;
  cost: number;
  notes?: string;
}

export const calculatePeriodicCostsForPrinter = (printer: Printer): PeriodicCostDetail[] => {
  if (!printer.readings || printer.readings.length < 2) {
    return [];
  }

  const sortedReadings = [...printer.readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const periodicCosts: PeriodicCostDetail[] = [];
  const rate = printer.type === PrinterType.BLACK_AND_WHITE ? printer.bwRate : printer.fcRate;

  if (typeof rate !== 'number' || rate < 0) {
    // If no valid rate, costs cannot be calculated
    // Still, we can show usage if needed, but here we focus on cost details
    // For simplicity, if no rate, we return empty or costs as 0
    // Let's return costs as 0 if rate is invalid
    for (let i = 1; i < sortedReadings.length; i++) {
      const startReading = sortedReadings[i-1];
      const endReading = sortedReadings[i];
      const chargeablePages = Math.max(0, endReading.reading - startReading.reading);
      periodicCosts.push({
        periodStartDate: startReading.date,
        periodEndDate: endReading.date,
        startReadingValue: startReading.reading,
        endReadingValue: endReading.reading,
        chargeablePages,
        cost: 0, // Cost is 0 if rate is undefined or invalid
        notes: endReading.notes,
      });
    }
    return periodicCosts;
  }


  for (let i = 1; i < sortedReadings.length; i++) {
    const startReading = sortedReadings[i-1];
    const endReading = sortedReadings[i];
    
    const chargeablePages = Math.max(0, endReading.reading - startReading.reading);
    const cost = chargeablePages * rate;

    periodicCosts.push({
      periodStartDate: startReading.date,
      periodEndDate: endReading.date,
      startReadingValue: startReading.reading,
      endReadingValue: endReading.reading,
      chargeablePages,
      cost,
      notes: endReading.notes,
    });
  }

  return periodicCosts;
};

export const calculateTotalCostForPrinter = (printer: Printer): number => {
  const periodicCosts = calculatePeriodicCostsForPrinter(printer);
  return periodicCosts.reduce((total, period) => total + period.cost, 0);
};
