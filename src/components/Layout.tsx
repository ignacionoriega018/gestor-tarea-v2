import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Building2, Calendar } from 'lucide-react';
import { SprintModal } from './sprint/SprintModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const sprintActual = useSelector((state: RootState) => {
    if (!empresaActual) return null;
    const sprintId = state.sprints.activeSprintsByCompany[empresaActual];
    if (!sprintId) return null;
    return state.sprints.items[empresaActual]?.find(s => s.id === sprintId);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Gestión de Tareas
              </h1>
            </div>
            {empresaActual && (
              <button
                onClick={() => setIsSprintModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Gestionar Sprints
              </button>
            )}
          </div>
          {sprintActual && (
            <div className="mt-4 px-4 py-2 bg-indigo-50 rounded-md">
              <p className="text-sm text-indigo-700">
                Sprint Actual: <span className="font-medium">{sprintActual.nombre}</span>
                <span className="mx-2">•</span>
                <span className="text-indigo-600">
                  {new Date(sprintActual.fechaInicio).toLocaleDateString('es-AR')} - 
                  {new Date(sprintActual.fechaFin).toLocaleDateString('es-AR')}
                </span>
              </p>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <SprintModal 
        isOpen={isSprintModalOpen} 
        onClose={() => setIsSprintModalOpen(false)} 
      />
    </div>
  );
};