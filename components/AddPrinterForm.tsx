
import React, { useState } from 'react';
import { Printer, PrinterType, MeterReading } from '../types';
import { PRINTER_TYPES } from '../constants';

interface AddPrinterFormProps {
  onAddPrinter: (newPrinter: Omit<Printer, 'id' | 'readings' | 'status'> & { initialReading?: number; initialReadingDate?: string }) => void;
  onClose: () => void;
}

const AddPrinterForm: React.FC<AddPrinterFormProps> = ({ onAddPrinter, onClose }) => {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<PrinterType>(PrinterType.BLACK_AND_WHITE);
  const [ipAddress, setIpAddress] = useState('');
  const [location, setLocation] = useState('');
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0]);
  const [bwRate, setBwRate] = useState('');
  const [fcRate, setFcRate] = useState('');
  const [initialReading, setInitialReading] = useState('');
  const [initialReadingDate, setInitialReadingDate] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !model || !installationDate) {
      setError('Name, Model, and Installation Date are required.');
      return;
    }

    const newPrinterBase: Omit<Printer, 'id' | 'readings' | 'status'> = {
      name,
      model,
      type,
      ipAddress: ipAddress || undefined,
      location: location || undefined,
      installationDate: new Date(installationDate).toISOString(),
      bwRate: bwRate ? parseFloat(bwRate) : undefined,
      fcRate: type === PrinterType.FULL_COLOUR && fcRate ? parseFloat(fcRate) : undefined,
    };
    
    const newPrinterData = {
        ...newPrinterBase,
        initialReading: initialReading ? parseInt(initialReading, 10) : undefined,
        initialReadingDate: initialReading && initialReadingDate ? new Date(initialReadingDate).toISOString() : undefined,
    }

    onAddPrinter(newPrinterData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-mediumgray">Printer Name <span className="text-danger">*</span></label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-mediumgray">Model <span className="text-danger">*</span></label>
        <input type="text" id="model" value={model} onChange={e => setModel(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-mediumgray">Type <span className="text-danger">*</span></label>
        <select id="type" value={type} onChange={e => setType(e.target.value as PrinterType)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
          {PRINTER_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
        </select>
      </div>
       <div>
        <label htmlFor="installationDate" className="block text-sm font-medium text-mediumgray">Installation Date <span className="text-danger">*</span></label>
        <input type="date" id="installationDate" value={installationDate} onChange={e => setInstallationDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="initialReading" className="block text-sm font-medium text-mediumgray">Initial Meter Reading (Optional)</label>
          <input type="number" id="initialReading" value={initialReading} onChange={e => setInitialReading(e.target.value)} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
          <label htmlFor="initialReadingDate" className="block text-sm font-medium text-mediumgray">Date of Initial Reading</label>
          <input type="date" id="initialReadingDate" value={initialReadingDate} onChange={e => setInitialReadingDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="ipAddress" className="block text-sm font-medium text-mediumgray">IP Address (Optional)</label>
        <input type="text" id="ipAddress" value={ipAddress} onChange={e => setIpAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-mediumgray">Location (Optional)</label>
        <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bwRate" className="block text-sm font-medium text-mediumgray">B&W Rate (e.g., 0.02)</label>
          <input type="number" step="0.0001" id="bwRate" value={bwRate} onChange={e => setBwRate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        {type === PrinterType.FULL_COLOUR && (
          <div>
            <label htmlFor="fcRate" className="block text-sm font-medium text-mediumgray">Full Colour Rate (e.g., 0.10)</label>
            <input type="number" step="0.0001" id="fcRate" value={fcRate} onChange={e => setFcRate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md border border-transparent">Add Printer</button>
      </div>
    </form>
  );
};

export default AddPrinterForm;
