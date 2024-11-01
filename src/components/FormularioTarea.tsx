import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { agregarTarea } from '../store/tareasSlice';
import { Plus, Users, Target, CheckSquare } from 'lucide-react';
import { AcceptanceCriteria } from '../types';

const storyPointOptions = [
  { value: 1, label: '1 Point - Simple Task, Low Risk' },
  { value: 3, label: '3 Points - Moderate Task' },
  { value: 5, label: '5 Points - Complex Task' },
  { value: 8, label: '8 Points - Very Complex Task' },
  { value: 13, label: '13+ Points - Consider Breaking Down' },
];

const prioridadOptions = [
  { value: 'alta', label: 'Alta', color: 'text-red-600' },
  { value: 'media', label: 'Media', color: 'text-yellow-600' },
  { value: 'baja', label: 'Baja', color: 'text-green-600' },
];

export const FormularioTarea: React.FC = () => {
  const dispatch = useDispatch();
  const creadores = useSelector((state: RootState) => state.creadores.items);
  const creadorActual = useSelector((state: RootState) => state.configuracion.appState.creadorActual);
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const sprintActivo = useSelector((state: RootState) => {
    if (!empresaActual) return null;
    const sprintId = state.sprints.activeSprintsByCompany[empresaActual];
    if (!sprintId) return null;
    return state.sprints.items[empresaActual]?.find(s => s.id === sprintId);
  });

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [storyPoints, setStoryPoints] = useState('');
  const [asignado, setAsignado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [userStory, setUserStory] = useState({ role: '', want: '', benefit: '' });
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriteria[]>([
    { id: '1', descripcion: '', completado: false }
  ]);
  const [definitionOfDone, setDefinitionOfDone] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim() && creadorActual && empresaActual && sprintActivo) {
      dispatch(
        agregarTarea({
          empresaId: empresaActual,
          tarea: {
            id: Date.now().toString(),
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            creador: creadorActual,
            estado: 'pendiente',
            fechaCreacion: new Date().toISOString(),
            sprintId: sprintActivo.id,
            asignado: asignado || undefined,
            storyPoints: storyPoints ? parseInt(storyPoints) : undefined,
            prioridad: prioridad as any || undefined,
            userStory: userStory.role && userStory.want ? userStory : undefined,
            acceptanceCriteria: acceptanceCriteria.filter(ac => ac.descripcion.trim()),
            definitionOfDone: definitionOfDone.filter(d => d.trim()),
            tiemposRegistrados: [],
          }
        })
      );

      // Reset form
      setTitulo('');
      setDescripcion('');
      setStoryPoints('');
      setAsignado('');
      setPrioridad('');
      setUserStory({ role: '', want: '', benefit: '' });
      setAcceptanceCriteria([{ id: '1', descripcion: '', completado: false }]);
      setDefinitionOfDone(['']);
    }
  };

  if (!empresaActual) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          Selecciona una empresa para comenzar
        </p>
      </div>
    );
  }

  if (!sprintActivo) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          Debes iniciar un sprint antes de poder crear tareas
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
            Título de la Tarea
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Título de la tarea"
            required
          />
        </div>

        <div>
          <label htmlFor="asignado" className="block text-sm font-medium text-gray-700">
            Asignado a
          </label>
          <select
            id="asignado"
            value={asignado}
            onChange={(e) => setAsignado(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sin asignar</option>
            {creadores.map((creador) => (
              <option key={creador.id} value={creador.id}>
                {creador.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Descripción detallada de la tarea"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="storyPoints" className="block text-sm font-medium text-gray-700">
            Story Points
          </label>
          <select
            id="storyPoints"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccionar puntos</option>
            {storyPointOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
            Prioridad
          </label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccionar prioridad</option>
            {prioridadOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Historia de Usuario</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Como (rol)
            </label>
            <input
              type="text"
              value={userStory.role}
              onChange={(e) => setUserStory({ ...userStory, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="ej. usuario del sistema"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quiero (acción)
            </label>
            <input
              type="text"
              value={userStory.want}
              onChange={(e) => setUserStory({ ...userStory, want: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="ej. poder crear tareas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Para (beneficio)
            </label>
            <input
              type="text"
              value={userStory.benefit}
              onChange={(e) => setUserStory({ ...userStory, benefit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="ej. organizar mejor mi trabajo"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Criterios de Aceptación</h4>
        {acceptanceCriteria.map((criterio, index) => (
          <div key={criterio.id} className="flex space-x-2">
            <input
              type="text"
              value={criterio.descripcion}
              onChange={(e) => {
                const newCriteria = [...acceptanceCriteria];
                newCriteria[index].descripcion = e.target.value;
                setAcceptanceCriteria(newCriteria);
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Criterio de aceptación"
            />
            {index === acceptanceCriteria.length - 1 && (
              <button
                type="button"
                onClick={() => setAcceptanceCriteria([
                  ...acceptanceCriteria,
                  { id: Date.now().toString(), descripcion: '', completado: false }
                ])}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!creadorActual}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Tarea
        </button>
      </div>
    </form>
  );
};