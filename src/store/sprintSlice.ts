import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sprint } from '../types';

interface SprintState {
  items: Record<string, Sprint[]>;
  activeSprintsByCompany: Record<string, string>;
}

const initialState: SprintState = {
  items: JSON.parse(localStorage.getItem('sprints') || '{}'),
  activeSprintsByCompany: JSON.parse(localStorage.getItem('activeSprintsByCompany') || '{}'),
};

const saveToLocalStorage = (state: SprintState) => {
  localStorage.setItem('sprints', JSON.stringify(state.items));
  localStorage.setItem('activeSprintsByCompany', JSON.stringify(state.activeSprintsByCompany));
};

const sprintSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    iniciarSprint: (state, action: PayloadAction<{ empresaId: string; sprint: Sprint }>) => {
      const { empresaId, sprint } = action.payload;
      
      // Initialize company sprints array if it doesn't exist
      if (!state.items[empresaId]) {
        state.items[empresaId] = [];
      }

      // Add new sprint
      state.items[empresaId].push(sprint);
      
      // Set as active sprint for the company
      state.activeSprintsByCompany[empresaId] = sprint.id;
      
      saveToLocalStorage(state);
    },
    finalizarSprint: (state, action: PayloadAction<{ 
      empresaId: string; 
      sprintId: string; 
      retrospectiva?: Sprint['retrospectiva']; 
      velocidad?: number;
    }>) => {
      const { empresaId, sprintId, retrospectiva, velocidad } = action.payload;
      const sprint = state.items[empresaId]?.find(s => s.id === sprintId);
      
      if (sprint) {
        sprint.estado = 'finalizado';
        sprint.retrospectiva = retrospectiva;
        sprint.velocidad = velocidad;
        
        // Remove active sprint for the company
        if (state.activeSprintsByCompany[empresaId] === sprintId) {
          state.activeSprintsByCompany[empresaId] = null;
        }
        
        saveToLocalStorage(state);
      }
    },
    reabrirSprint: (state, action: PayloadAction<{ empresaId: string; sprintId: string }>) => {
      const { empresaId, sprintId } = action.payload;
      const sprint = state.items[empresaId]?.find(s => s.id === sprintId);
      
      if (sprint) {
        sprint.estado = 'reabierto';
        state.activeSprintsByCompany[empresaId] = sprintId;
        
        saveToLocalStorage(state);
      }
    },
    eliminarSprint: (state, action: PayloadAction<{ empresaId: string; sprintId: string }>) => {
      const { empresaId, sprintId } = action.payload;
      
      if (state.items[empresaId]) {
        state.items[empresaId] = state.items[empresaId].filter(s => s.id !== sprintId);
        
        if (state.activeSprintsByCompany[empresaId] === sprintId) {
          state.activeSprintsByCompany[empresaId] = null;
        }
        
        saveToLocalStorage(state);
      }
    },
  },
});

export const { 
  iniciarSprint, 
  finalizarSprint, 
  reabrirSprint,
  eliminarSprint 
} = sprintSlice.actions;

export default sprintSlice.reducer;