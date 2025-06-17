import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string; // Optional prop for custom max-width
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidthClass }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className={`bg-white p-6 rounded-lg shadow-xl w-full ${maxWidthClass || 'max-w-md'} transform transition-all max-h-[90vh] flex flex-col`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold text-darkgray">{title}</h2>
          <button
            onClick={onClose}
            className="text-mediumgray hover:text-darkgray text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;