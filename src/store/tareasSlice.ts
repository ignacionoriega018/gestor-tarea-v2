import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tarea, TiempoRegistrado } from '../types';

interface TareasState {
  items: Record<string, Tarea[]>;
  loading: boolean;
  error: string | null;
}

const initialState: TareasState = {
  items: JSON.parse(localStorage.getItem('tareas') || '{}'),
  loading: false,
  error: null,
};

const saveTareasToStorage = (items: Record<string, Tarea[]>) => {
  try {
    localStorage.setItem('tareas', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

const tareasSlice = createSlice({
  name: 'tareas',
  initialState,
  reducers: {
    agregarTarea: (state, action: PayloadAction<{ empresaId: string; tarea: Tarea }>) => {
      const { empresaId, tarea } = action.payload;
      if (!state.items[empresaId]) {
        state.items[empresaId] = [];
      }
      state.items[empresaId].push({
        ...tarea,
        historial: [{
          fecha: new Date().toISOString(),
          tipo: 'creacion',
          descripcion: 'Tarea creada',
          estado: tarea.estado
        }]
      });
      saveTareasToStorage(state.items);
    },
    actualizarEstadoTarea: (
      state,
      action: PayloadAction<{
        empresaId: string;
        id: string;
        estado: Tarea['estado'];
      }>
    ) => {
      const { empresaId, id, estado } = action.payload;
      const tareas = state.items[empresaId];
      if (tareas) {
        const tareaIndex = tareas.findIndex(t => t.id === id);
        if (tareaIndex !== -1) {
          const tarea = tareas[tareaIndex];
          tareas[tareaIndex] = {
            ...tarea,
            estado,
            fechaFinalizacion: estado === 'terminada'
              ? new Date().toLocaleString('es-AR', {
                  timeZone: 'America/Argentina/Buenos_Aires',
                })
              : tarea.fechaFinalizacion,
            historial: [
              ...(tarea.historial || []),
              {
                fecha: new Date().toISOString(),
                tipo: 'cambio_estado',
                descripcion: `Estado cambiado a ${estado}`,
                estado
              }
            ]
          };
          saveTareasToStorage(state.items);
        }
      }
    },
    eliminarTarea: (
      state,
      action: PayloadAction<{
        empresaId: string;
        id: string;
      }>
    ) => {
      const { empresaId, id } = action.payload;
      if (state.items[empresaId]) {
        state.items[empresaId] = state.items[empresaId].filter(t => t.id !== id);
        saveTareasToStorage(state.items);
      }
    },
    agregarTiempoTarea: (
      state,
      action: PayloadAction<{
        empresaId: string;
        id: string;
        tiempo: Omit<TiempoRegistrado, 'fecha'>;
      }>
    ) => {
      const { empresaId, id, tiempo } = action.payload;
      const tareas = state.items[empresaId];
      if (tareas) {
        const tareaIndex = tareas.findIndex(t => t.id === id);
        if (tareaIndex !== -1) {
          const tarea = tareas[tareaIndex];
          const nuevoTiempo = {
            ...tiempo,
            fecha: new Date().toLocaleString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
            }),
          };
          tareas[tareaIndex] = {
            ...tarea,
            tiemposRegistrados: [...(tarea.tiemposRegistrados || []), nuevoTiempo],
            historial: [
              ...(tarea.historial || []),
              {
                fecha: new Date().toISOString(),
                tipo: 'tiempo_registrado',
                descripcion: `Se registraron ${tiempo.minutos} minutos: ${tiempo.descripcion}`,
                estado: tarea.estado
              }
            ]
          };
          saveTareasToStorage(state.items);
        }
      }
    },
    actualizarTareasSprint: (
      state,
      action: PayloadAction<{
        empresaId: string;
        sprintAnteriorId: string;
        sprintNuevoId: string | null;
        tareasAMover: string[];
        tareasPendientes: string[];
      }>
    ) => {
      const { empresaId, sprintAnteriorId, sprintNuevoId, tareasAMover, tareasPendientes } = action.payload;
      const tareas = state.items[empresaId];
      if (tareas) {
        tareas.forEach((tarea, index) => {
          if (tarea.sprintId === sprintAnteriorId) {
            if (tareasAMover.includes(tarea.id)) {
              tareas[index] = {
                ...tarea,
                sprintId: sprintNuevoId || undefined,
                historial: [
                  ...(tarea.historial || []),
                  {
                    fecha: new Date().toISOString(),
                    tipo: 'cambio_sprint',
                    descripcion: sprintNuevoId 
                      ? 'Tarea movida al siguiente sprint'
                      : 'Tarea removida del sprint',
                    estado: tarea.estado
                  }
                ]
              };
            } else if (tareasPendientes.includes(tarea.id)) {
              tareas[index] = {
                ...tarea,
                sprintId: undefined,
                historial: [
                  ...(tarea.historial || []),
                  {
                    fecha: new Date().toISOString(),
                    tipo: 'cambio_sprint',
                    descripcion: 'Tarea marcada como pendiente',
                    estado: tarea.estado
                  }
                ]
              };
            }
          }
        });
        saveTareasToStorage(state.items);
      }
    },
  },
});

export const { 
  agregarTarea, 
  actualizarEstadoTarea, 
  agregarTiempoTarea,
  actualizarTareasSprint,
  eliminarTarea
} = tareasSlice.actions;

export default tareasSlice.reducer;