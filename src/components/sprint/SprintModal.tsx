import React from 'react';
import { X } from 'lucide-react';
import { SprintManager } from './SprintManager';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SprintModal: React.FC<SprintModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] m-4">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[90vh] p-6">
          <SprintManager onClose={onClose} />
        </div>
      </div>
    </div>
  );
};