import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Tarea } from '../types';
import { Clock, AlertCircle } from 'lucide-react';
import { TareaModal } from './TareaModal';

interface TarjetaTareaProps {
  tarea: Tarea;
  columnaActual: string;
}

const obtenerColorTarjeta = (estado: Tarea['estado']) => {
  switch (estado) {
    case 'pendiente':
      return 'bg-red-50 hover:bg-red-100';
    case 'en-proceso':
      return 'bg-yellow-50 hover:bg-yellow-100';
    case 'terminada':
      return 'bg-green-50 hover:bg-green-100';
    default:
      return 'bg-gray-50 hover:bg-gray-100';
  }
};

const obtenerColorPrioridad = (prioridad?: string) => {
  switch (prioridad) {
    case 'alta':
      return 'bg-red-100 text-red-800';
    case 'media':
      return 'bg-yellow-100 text-yellow-800';
    case 'baja':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const obtenerColorStoryPoints = (points?: number) => {
  if (!points) return 'bg-gray-100 text-gray-800';
  if (points <= 3) return 'bg-green-100 text-green-800';
  if (points <= 5) return 'bg-yellow-100 text-yellow-800';
  if (points <= 8) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export const TarjetaTarea: React.FC<TarjetaTareaProps> = ({ tarea, columnaActual }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const creadores = useSelector((state: RootState) => state.creadores.items);
  const asignado = creadores.find(c => c.id === tarea.asignado);

  const tiempoTotal = tarea.tiemposRegistrados.reduce(
    (acc, curr) => acc + curr.minutos, 
    0
  );

  return (
    <>
      <div 
        onClick={() => setModalAbierto(true)}
        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${obtenerColorTarjeta(tarea.estado)}`}
      >
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">{tarea.titulo}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {tarea.prioridad && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${obtenerColorPrioridad(tarea.prioridad)}`}>
                  {tarea.prioridad}
                </span>
              )}
              {tarea.storyPoints && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${obtenerColorStoryPoints(tarea.storyPoints)}`}>
                  {tarea.storyPoints} pts
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {asignado && (
                <span className="flex items-center">
                  {asignado.nombre}
                </span>
              )}
            </div>
            {tiempoTotal > 0 && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(tiempoTotal / 60)}h {tiempoTotal % 60}m
              </span>
            )}
          </div>

          {tarea.impediments && tarea.impediments.length > 0 && (
            <div className="flex items-center text-red-600 text-xs mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {tarea.impediments.length} impedimento(s)
            </div>
          )}
        </div>
      </div>

      <TareaModal
        tarea={tarea}
        columnaActual={columnaActual}
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
      />
    </>
  );
};