
export enum PrinterType {
  BLACK_AND_WHITE = 'Black and White',
  FULL_COLOUR = 'Full Colour',
}

export interface MeterReading {
  id: string;
  date: string; // ISO string for date
  reading: number;
  notes?: string;
}

export enum DeviceStatus {
  OPERATIONAL = 'Operational',
  NEEDS_ATTENTION = 'Needs Attention',
  NO_HISTORY = 'No History',
}

export interface Printer {
  id:string;
  name: string;
  model: string;
  type: PrinterType;
  ipAddress?: string;
  location?: string;
  installationDate: string; // ISO string for date
  readings: MeterReading[]; // This will hold the original, complete list of readings
  bwRate?: number; // Cost per black and white page
  fcRate?: number; // Cost per full colour page
  status?: DeviceStatus; // Calculated operational status, potentially based on global filters
  
  // Optional field to store readings filtered by a specific date range for processing
  // This helps avoid mutating the original readings array frequently.
  processedReadings?: MeterReading[]; 
}

// Interface for printers after processing global filters, used by views
export interface ProcessedPrinterData extends Printer {
  // `readings` in this context will be scoped by global date filters.
  // The original full list of readings is still in Printer.readings if initialData isn't mutated
  // Or, we can ensure Printer.readings always has original and pass a differently named prop.
  // For clarity, let's assume `readings` on ProcessedPrinterData is the date-scoped one.
  // And the `status` is also calculated based on this scope.
}

// Specific for Kyocera view or views needing detailed in-range data
export interface KyoceraProcessedPrinter extends Printer {
  latestReadingInRange: MeterReading | null;
  readingsInRangeCount: number;
  statusInRange: DeviceStatus; // Status calculated specifically for the Kyocera view's active date range
}
