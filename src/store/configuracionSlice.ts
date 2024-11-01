import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConfiguracionEmpresa, AppState } from '../types';

interface ConfiguracionState {
  empresas: ConfiguracionEmpresa[];
  appState: AppState;
}

const initialState: ConfiguracionState = {
  empresas: JSON.parse(localStorage.getItem('empresas') || '[]'),
  appState: JSON.parse(
    localStorage.getItem('appState') || 
    '{"empresaActual":"","creadorActual":""}'
  ),
};

const configuracionSlice = createSlice({
  name: 'configuracion',
  initialState,
  reducers: {
    agregarEmpresa: (state, action: PayloadAction<ConfiguracionEmpresa>) => {
      state.empresas.push(action.payload);
      localStorage.setItem('empresas', JSON.stringify(state.empresas));
    },
    seleccionarEmpresa: (state, action: PayloadAction<string>) => {
      state.appState.empresaActual = action.payload;
      localStorage.setItem('appState', JSON.stringify(state.appState));
    },
    seleccionarCreador: (state, action: PayloadAction<string>) => {
      state.appState.creadorActual = action.payload;
      localStorage.setItem('appState', JSON.stringify(state.appState));
    },
  },
});

export const { agregarEmpresa, seleccionarEmpresa, seleccionarCreador } = configuracionSlice.actions;
export default configuracionSlice.reducer;