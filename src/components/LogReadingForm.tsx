
import React, { useState } from 'react';
import { Printer, MeterReading } from '../types';

interface LogReadingFormProps {
  printer: Printer;
  onLogReading: (printerId: string, reading: MeterReading) => void;
  onClose: () => void;
}

const LogReadingForm: React.FC<LogReadingFormProps> = ({ printer, onLogReading, onClose }) => {
  const [readingValue, setReadingValue] = useState('');
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const currentReading = printer.readings.length > 0 ? Math.max(...printer.readings.map(r => r.reading)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReading = parseInt(readingValue, 10);

    if (isNaN(newReading) || newReading < 0) {
      setError('Reading must be a non-negative number.');
      return;
    }
    if (newReading < currentReading) {
      setError(`New reading (${newReading}) cannot be less than the current reading (${currentReading}).`);
      return;
    }
     if (!readingDate) {
      setError('Please select a date for the reading.');
      return;
    }

    const newMeterReading: MeterReading = {
      id: crypto.randomUUID(),
      date: new Date(readingDate).toISOString(),
      reading: newReading,
      notes: notes || undefined,
    };

    onLogReading(printer.id, newMeterReading);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-sm text-mediumgray">Logging reading for: <span className="font-semibold text-darkgray">{printer.name} ({printer.model})</span></p>
      <p className="text-sm text-mediumgray">Current Meter Reading: <span className="font-semibold text-darkgray">{currentReading.toLocaleString()}</span></p>
      
      <div>
        <label htmlFor="readingValue" className="block text-sm font-medium text-mediumgray">New Meter Reading <span className="text-red-500">*</span></label>
        <input type="number" id="readingValue" value={readingValue} onChange={(e) => setReadingValue(e.target.value)} min="0" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="readingDate" className="block text-sm font-medium text-mediumgray">Date of Reading <span className="text-red-500">*</span></label>
        <input type="date" id="readingDate" value={readingDate} onChange={(e) => setReadingDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-mediumgray">Notes (Optional)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md border border-transparent">Log Reading</button>
      </div>
    </form>
  );
};

export default LogReadingForm;
