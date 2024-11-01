import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { agregarEmpresa, seleccionarEmpresa } from '../store/configuracionSlice';
import { RootState } from '../store/store';
import { Settings, Building2 } from 'lucide-react';

export const Configuracion: React.FC = () => {
  const dispatch = useDispatch();
  const { empresas, appState } = useSelector((state: RootState) => state.configuracion);
  const [mostrarForm, setMostrarForm] = useState(!empresas.length);
  const [nombreEmpresa, setNombreEmpresa] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaEmpresa = {
      id: Date.now().toString(),
      nombre: nombreEmpresa,
    };
    dispatch(agregarEmpresa(nuevaEmpresa));
    dispatch(seleccionarEmpresa(nuevaEmpresa.id));
    setNombreEmpresa('');
    setMostrarForm(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <select
            value={appState.empresaActual}
            onChange={(e) => dispatch(seleccionarEmpresa(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccionar Empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMostrarForm(true)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Nueva Empresa
          </button>
        </div>
      </div>

      {mostrarForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Nueva Empresa</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                id="nombreEmpresa"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}