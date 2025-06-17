
import { PrinterType } from './types';

export const PRINTER_TYPES = [
  PrinterType.BLACK_AND_WHITE,
  PrinterType.FULL_COLOUR,
];

export const HIGH_USAGE_THRESHOLD = 5000; // Pages printed between two readings to flag attention
export const DAYS_SINCE_LAST_READING_THRESHOLD = 30; // Days to consider a reading stale
