import { configureStore } from '@reduxjs/toolkit';
import tareasReducer from './tareasSlice';
import creadoresReducer from './creadoresSlice';
import configuracionReducer from './configuracionSlice';
import sprintReducer from './sprintSlice';

const preloadedState = {
  configuracion: {
    empresas: JSON.parse(localStorage.getItem('empresas') || '[]'),
    appState: JSON.parse(
      localStorage.getItem('appState') || 
      '{"empresaActual":"","creadorActual":""}'
    ),
  },
  creadores: {
    items: JSON.parse(localStorage.getItem('creadores') || '[]'),
  },
  tareas: {
    items: JSON.parse(localStorage.getItem('tareas') || '{}'),
    loading: false,
    error: null,
  },
  sprints: {
    items: JSON.parse(localStorage.getItem('sprints') || '{}'),
    activeSprintsByCompany: JSON.parse(localStorage.getItem('activeSprintsByCompany') || '{}'),
  },
};

export const store = configureStore({
  reducer: {
    tareas: tareasReducer,
    creadores: creadoresReducer,
    configuracion: configuracionReducer,
    sprints: sprintReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;