import React, { useState } from 'react';
import { Sprint } from '../../types';
import { ThumbsUp, AlertTriangle, Target } from 'lucide-react';

interface SprintRetrospectivaProps {
  sprint: Sprint;
  onFinalizarSprint: (retrospectiva: Sprint['retrospectiva'], velocidad: number) => void;
  onCancel: () => void;
}

export const SprintRetrospectiva: React.FC<SprintRetrospectivaProps> = ({
  sprint,
  onFinalizarSprint,
  onCancel,
}) => {
  const [bueno, setBueno] = useState<string[]>(['']);
  const [mejorar, setMejorar] = useState<string[]>(['']);
  const [acciones, setAcciones] = useState<string[]>(['']);
  const [velocidad, setVelocidad] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinalizarSprint(
      {
        bueno: bueno.filter(item => item.trim()),
        mejorar: mejorar.filter(item => item.trim()),
        acciones: acciones.filter(item => item.trim()),
      },
      parseInt(velocidad) || 0
    );
  };

  const renderInputList = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string
  ) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index] = e.target.value;
              setItems(newItems);
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder={placeholder}
          />
          {index === items.length - 1 && (
            <button
              type="button"
              onClick={() => setItems([...items, ''])}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Finalizar Sprint: {sprint.nombre}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ThumbsUp className="inline h-4 w-4 mr-2" />
                ¿Qué salió bien?
              </label>
              {renderInputList(bueno, setBueno, 'Algo que salió bien en este sprint')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="inline h-4 w-4 mr-2" />
                ¿Qué podemos mejorar?
              </label>
              {renderInputList(mejorar, setMejorar, 'Algo que podemos mejorar')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline h-4 w-4 mr-2" />
                Acciones a tomar
              </label>
              {renderInputList(acciones, setAcciones, 'Acción concreta para mejorar')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velocidad del Sprint (story points completados)
              </label>
              <input
                type="number"
                value={velocidad}
                onChange={(e) => setVelocidad(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Puntos completados"
                min="0"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Finalizar Sprint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};