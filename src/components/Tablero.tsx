import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FormularioTarea } from './FormularioTarea';
import { TarjetaTarea } from './TarjetaTarea';
import { GestionCreadores } from './GestionCreadores';
import { Tarea } from '../types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { actualizarEstadoTarea } from '../store/tareasSlice';

const columnas = [
  { id: 'pendiente', titulo: 'Pendiente' },
  { id: 'en-proceso', titulo: 'En Proceso' },
  { id: 'terminada', titulo: 'Terminada' },
] as const;

export const Tablero: React.FC = () => {
  const dispatch = useDispatch();
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const sprintActivo = useSelector((state: RootState) => {
    if (!empresaActual) return null;
    const sprintId = state.sprints.activeSprintsByCompany[empresaActual];
    return sprintId || null;
  });
  
  const tareas = useSelector((state: RootState) => {
    if (!empresaActual || !state.tareas.items[empresaActual]) return [];
    const tareasList = state.tareas.items[empresaActual];
    return tareasList.filter(tarea => 
      tarea.sprintId === sprintActivo || 
      (!tarea.sprintId && tarea.estado === 'pendiente')
    );
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination || !empresaActual) return;

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceId !== destinationId) {
      dispatch(actualizarEstadoTarea({
        empresaId: empresaActual,
        id: taskId,
        estado: destinationId as Tarea['estado']
      }));
    }
  };

  const exportarExcel = () => {
    if (!tareas.length) {
      alert('No hay tareas para exportar');
      return;
    }

    try {
      const tareasParaExportar = tareas.map((tarea) => ({
        'Estado': columnas.find(col => col.id === tarea.estado)?.titulo || tarea.estado,
        'Título': tarea.titulo || '',
        'Descripción': tarea.descripcion || '',
        'Story Points': tarea.storyPoints || 0,
        'Tiempo Estimado (min)': tarea.tiempoEstimado || 0,
        'Tiempo Total (min)': tarea.tiemposRegistrados?.reduce((acc, curr) => acc + curr.minutos, 0) || 0,
      }));

      const ws = XLSX.utils.json_to_sheet(tareasParaExportar);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tareas');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      saveAs(data, `tareas-sprint-${new Date().toLocaleDateString('es-AR')}.xlsx`);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('Error al exportar el archivo Excel');
    }
  };

  if (!empresaActual) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona o crea una empresa para comenzar</p>
      </div>
    );
  }

  if (!sprintActivo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Inicia un sprint para comenzar a gestionar tareas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GestionCreadores />
      <div className="flex justify-between items-center">
        <FormularioTarea />
        <button
          onClick={exportarExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Tareas
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columnas.map((columna) => (
            <Droppable key={columna.id} droppableId={columna.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-lg shadow-sm"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      {columna.titulo}
                    </h3>
                  </div>
                  <div className="p-4 space-y-4 min-h-[200px]">
                    {tareas
                      .filter((tarea) => tarea.estado === columna.id)
                      .map((tarea, index) => (
                        <Draggable
                          key={tarea.id}
                          draggableId={tarea.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TarjetaTarea
                                tarea={tarea}
                                columnaActual={columna.id}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};