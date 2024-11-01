import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { actualizarEstadoTarea, agregarTiempoTarea, eliminarTarea } from '../store/tareasSlice';
import { Tarea, TiempoRegistrado } from '../types';
import { 
  X, Clock, ChevronDown, ChevronUp, User, Trash2, 
  History, AlertCircle, CheckSquare, Target, ArrowRight 
} from 'lucide-react';

interface TareaModalProps {
  tarea: Tarea;
  columnaActual: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TareaModal: React.FC<TareaModalProps> = ({ 
  tarea, 
  columnaActual, 
  isOpen, 
  onClose 
}) => {
  const dispatch = useDispatch();
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const creadores = useSelector((state: RootState) => state.creadores.items);
  
  const [mostrarFormTiempo, setMostrarFormTiempo] = useState(false);
  const [tiempoNuevo, setTiempoNuevo] = useState('');
  const [descripcionTiempo, setDescripcionTiempo] = useState('');
  const [seccionActiva, setSeccionActiva] = useState<string>('detalles');

  const creador = useMemo(() => 
    creadores.find(c => c.id === tarea.creador),
    [creadores, tarea.creador]
  );

  const asignado = useMemo(() =>
    creadores.find(c => c.id === tarea.asignado),
    [creadores, tarea.asignado]
  );

  const tiemposRegistrados = useMemo(() => 
    [...(tarea.tiemposRegistrados || [])].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    ),
    [tarea.tiemposRegistrados]
  );

  const tiempoTotal = useMemo(() => 
    tiemposRegistrados.reduce((acc, curr) => acc + curr.minutos, 0),
    [tiemposRegistrados]
  );

  if (!isOpen) return null;

  const handleAgregarTiempo = (e: React.FormEvent) => {
    e.preventDefault();
    if (tiempoNuevo && descripcionTiempo && empresaActual) {
      const tiempo: Omit<TiempoRegistrado, 'fecha'> = {
        minutos: parseInt(tiempoNuevo),
        descripcion: descripcionTiempo.trim(),
      };

      dispatch(
        agregarTiempoTarea({
          empresaId: empresaActual,
          id: tarea.id,
          tiempo,
        })
      );
      setTiempoNuevo('');
      setDescripcionTiempo('');
      setMostrarFormTiempo(false);
    }
  };

  const handleEliminarTarea = () => {
    if (empresaActual && window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      dispatch(eliminarTarea({ empresaId: empresaActual, id: tarea.id }));
      onClose();
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'detalles', label: 'Detalles', icon: <Target className="h-4 w-4" /> },
    { id: 'tiempos', label: 'Tiempos', icon: <Clock className="h-4 w-4" /> },
    { id: 'historial', label: 'Historial', icon: <History className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="flex justify-between items-start p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{tarea.titulo}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Creado por {creador?.nombre} el {formatearFecha(tarea.fechaCreacion)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSeccionActiva(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${
                seccionActiva === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {seccionActiva === 'detalles' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Descripción</h3>
                <p className="mt-1 text-sm text-gray-600">{tarea.descripcion || 'Sin descripción'}</p>
              </div>

              {tarea.userStory && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Historia de Usuario</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Como <span className="font-medium">{tarea.userStory.role}</span>,{' '}
                    quiero <span className="font-medium">{tarea.userStory.want}</span>,{' '}
                    para <span className="font-medium">{tarea.userStory.benefit}</span>
                  </p>
                </div>
              )}

              {tarea.acceptanceCriteria && tarea.acceptanceCriteria.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Criterios de Aceptación</h3>
                  <ul className="mt-1 space-y-1">
                    {tarea.acceptanceCriteria.map((criterio, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckSquare className={`h-4 w-4 mr-2 ${
                          criterio.completado ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        {criterio.descripcion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tarea.impediments && tarea.impediments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Impedimentos</h3>
                  <ul className="mt-1 space-y-1">
                    {tarea.impediments.map((impediment, index) => (
                      <li key={index} className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {impediment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {seccionActiva === 'tiempos' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Registro de Tiempos</h3>
                  <p className="text-sm text-gray-500">
                    Tiempo total: {Math.floor(tiempoTotal / 60)}h {tiempoTotal % 60}m
                  </p>
                </div>
                <button
                  onClick={() => setMostrarFormTiempo(!mostrarFormTiempo)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Registrar tiempo
                </button>
              </div>

              {mostrarFormTiempo && (
                <form onSubmit={handleAgregarTiempo} className="space-y-3">
                  <input
                    type="number"
                    value={tiempoNuevo}
                    onChange={(e) => setTiempoNuevo(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Minutos trabajados"
                    min="1"
                    required
                  />
                  <input
                    type="text"
                    value={descripcionTiempo}
                    onChange={(e) => setDescripcionTiempo(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Descripción del trabajo realizado"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Guardar tiempo
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {tiemposRegistrados.map((tiempo, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {Math.floor(tiempo.minutos / 60)}h {tiempo.minutos % 60}m
                      </span>
                      <span className="text-gray-500">{formatearFecha(tiempo.fecha)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{tiempo.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {seccionActiva === 'historial' && tarea.historial && (
            <div className="space-y-3">
              {tarea.historial.map((evento, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {evento.tipo.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-500">{formatearFecha(evento.fecha)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{evento.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex justify-between items-center">
          <div className="flex space-x-3">
            {columnaActual !== 'pendiente' && (
              <button
                onClick={() => {
                  dispatch(actualizarEstadoTarea({ 
                    empresaId: empresaActual,
                    id: tarea.id, 
                    estado: 'pendiente' 
                  }));
                  onClose();
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Mover a Pendiente
              </button>
            )}
            {columnaActual !== 'en-proceso' && (
              <button
                onClick={() => {
                  dispatch(actualizarEstadoTarea({ 
                    empresaId: empresaActual,
                    id: tarea.id, 
                    estado: 'en-proceso' 
                  }));
                  onClose();
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Mover a En Proceso
              </button>
            )}
            {columnaActual !== 'terminada' && (
              <button
                onClick={() => {
                  dispatch(actualizarEstadoTarea({ 
                    empresaId: empresaActual,
                    id: tarea.id, 
                    estado: 'terminada' 
                  }));
                  onClose();
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Marcar como Terminada
              </button>
            )}
          </div>
          
          <button
            onClick={handleEliminarTarea}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Tarea
          </button>
        </div>
      </div>
    </div>
  );
};