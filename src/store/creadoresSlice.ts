import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Creador } from '../types';

interface CreadoresState {
  items: Creador[];
}

const initialState: CreadoresState = {
  items: JSON.parse(localStorage.getItem('creadores') || '[]'),
};

const creadoresSlice = createSlice({
  name: 'creadores',
  initialState,
  reducers: {
    agregarCreador: (state, action: PayloadAction<Creador>) => {
      state.items.push(action.payload);
      localStorage.setItem('creadores', JSON.stringify(state.items));
    },
  },
});

export const { agregarCreador } = creadoresSlice.actions;
export default creadoresSlice.reducer;