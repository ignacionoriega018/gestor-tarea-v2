import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { iniciarSprint, finalizarSprint, reabrirSprint, eliminarSprint } from '../../store/sprintSlice';
import { Sprint } from '../../types';
import { Calendar, CheckSquare, RotateCcw, TrendingUp, Trash2 } from 'lucide-react';
import { SprintRetrospectiva } from './SprintRetrospectiva';
import { SprintMetrics } from './SprintMetrics';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface SprintManagerProps {
  onClose?: () => void;
}

export const SprintManager: React.FC<SprintManagerProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const sprints = useSelector((state: RootState) => 
    empresaActual ? state.sprints.items[empresaActual] || [] : []
  );
  const sprintActivo = useSelector((state: RootState) => {
    if (!empresaActual) return null;
    const sprintId = state.sprints.activeSprintsByCompany[empresaActual];
    if (!sprintId) return null;
    return sprints.find(s => s.id === sprintId);
  });
  
  const [mostrarFormSprint, setMostrarFormSprint] = useState(false);
  const [nombreSprint, setNombreSprint] = useState('');
  const [descripcionSprint, setDescripcionSprint] = useState('');
  const [objetivos, setObjetivos] = useState<string[]>(['']);
  const [mostrarRetrospectiva, setMostrarRetrospectiva] = useState(false);

  const obtenerFechasSprint = () => {
    const hoy = new Date();
    const primerDia = startOfMonth(hoy);
    const ultimoDia = endOfMonth(hoy);
    ultimoDia.setHours(23, 0, 0, 0);
    
    return {
      inicio: primerDia.toISOString(),
      fin: ultimoDia.toISOString(),
    };
  };

  const handleIniciarSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (empresaActual && nombreSprint) {
      const fechas = obtenerFechasSprint();
      const nuevoSprint: Sprint = {
        id: Date.now().toString(),
        empresaId: empresaActual,
        nombre: nombreSprint,
        descripcion: descripcionSprint,
        fechaInicio: fechas.inicio,
        fechaFin: fechas.fin,
        estado: 'activo',
        objetivos: objetivos.filter(obj => obj.trim()),
      };
      
      dispatch(iniciarSprint({ empresaId: empresaActual, sprint: nuevoSprint }));
      setMostrarFormSprint(false);
      setNombreSprint('');
      setDescripcionSprint('');
      setObjetivos(['']);
      onClose?.();
    }
  };

  const handleFinalizarSprint = (retrospectiva: Sprint['retrospectiva'], velocidad: number) => {
    if (empresaActual && sprintActivo) {
      dispatch(finalizarSprint({
        empresaId: empresaActual,
        sprintId: sprintActivo.id,
        retrospectiva,
        velocidad,
      }));
      setMostrarRetrospectiva(false);
    }
  };

  const handleReabrirSprint = (sprintId: string) => {
    if (empresaActual) {
      dispatch(reabrirSprint({ empresaId: empresaActual, sprintId }));
    }
  };

  const handleEliminarSprint = (sprintId: string) => {
    if (empresaActual && window.confirm('¿Estás seguro de que deseas eliminar este sprint?')) {
      dispatch(eliminarSprint({ empresaId: empresaActual, sprintId }));
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), 'PPP', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };

  if (!empresaActual) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona una empresa para gestionar sprints</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Sprints</h2>
          {!sprintActivo && (
            <button
              onClick={() => setMostrarFormSprint(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Iniciar Nuevo Sprint
            </button>
          )}
        </div>

        {sprintActivo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{sprintActivo.nombre}</h3>
                <p className="text-sm text-gray-500">{sprintActivo.descripcion}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Inicio: {formatearFecha(sprintActivo.fechaInicio)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fin: {formatearFecha(sprintActivo.fechaFin)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setMostrarRetrospectiva(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Finalizar Sprint
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Objetivos del Sprint:</h4>
              <ul className="list-disc list-inside space-y-1">
                {sprintActivo.objetivos.map((objetivo, index) => (
                  <li key={index} className="text-sm text-gray-600">{objetivo}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {mostrarFormSprint && (
          <form onSubmit={handleIniciarSprint} className="space-y-4">
            <div>
              <label htmlFor="nombreSprint" className="block text-sm font-medium text-gray-700">
                Nombre del Sprint
              </label>
              <input
                type="text"
                id="nombreSprint"
                value={nombreSprint}
                onChange={(e) => setNombreSprint(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="descripcionSprint" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="descripcionSprint"
                value={descripcionSprint}
                onChange={(e) => setDescripcionSprint(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos del Sprint
              </label>
              {objetivos.map((objetivo, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={objetivo}
                    onChange={(e) => {
                      const newObjetivos = [...objetivos];
                      newObjetivos[index] = e.target.value;
                      setObjetivos(newObjetivos);
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Objetivo del sprint"
                  />
                  {index === objetivos.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setObjetivos([...objetivos, ''])}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormSprint(false);
                  onClose?.();
                }}
                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Iniciar Sprint
              </button>
            </div>
          </form>
        )}

        {mostrarRetrospectiva && sprintActivo && (
          <SprintRetrospectiva
            sprint={sprintActivo}
            onFinalizarSprint={handleFinalizarSprint}
            onCancel={() => setMostrarRetrospectiva(false)}
          />
        )}

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sprints Finalizados</h3>
          <div className="space-y-4">
            {sprints
              .filter(sprint => sprint.estado === 'finalizado')
              .map(sprint => (
                <div
                  key={sprint.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">
                        {sprint.nombre}
                        <span className="ml-2 text-sm text-gray-500">
                          ({formatearFecha(sprint.fechaInicio)} - 
                          {formatearFecha(sprint.fechaFin)})
                        </span>
                      </h4>
                      {sprint.velocidad && (
                        <p className="text-sm text-gray-600 mt-1">
                          <TrendingUp className="inline h-4 w-4 mr-1" />
                          Velocidad: {sprint.velocidad} puntos
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReabrirSprint(sprint.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reabrir Sprint
                      </button>
                      <button
                        onClick={() => handleEliminarSprint(sprint.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                  {sprint.retrospectiva && (
                    <div className="mt-4 text-sm">
                      <SprintMetrics sprint={sprint} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};