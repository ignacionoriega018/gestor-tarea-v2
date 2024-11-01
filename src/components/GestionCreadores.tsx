import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { agregarCreador } from '../store/creadoresSlice';
import { seleccionarCreador } from '../store/configuracionSlice';
import { UserPlus } from 'lucide-react';

export const GestionCreadores: React.FC = () => {
  const dispatch = useDispatch();
  const creadores = useSelector((state: RootState) => state.creadores.items);
  const creadorActual = useSelector((state: RootState) => state.configuracion.appState.creadorActual);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombreCreador, setNombreCreador] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoCreador = {
      id: Date.now().toString(),
      nombre: nombreCreador,
    };
    dispatch(agregarCreador(nuevoCreador));
    dispatch(seleccionarCreador(nuevoCreador.id));
    setNombreCreador('');
    setMostrarForm(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <select
          value={creadorActual}
          onChange={(e) => dispatch(seleccionarCreador(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Seleccionar Creador</option>
          {creadores.map((creador) => (
            <option key={creador.id} value={creador.id}>
              {creador.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={() => setMostrarForm(true)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Creador
        </button>
      </div>

      {mostrarForm && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Nuevo Creador</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombreCreador" className="block text-sm font-medium text-gray-700">
                Nombre del Creador
              </label>
              <input
                type="text"
                id="nombreCreador"
                value={nombreCreador}
                onChange={(e) => setNombreCreador(e.target.value)}
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