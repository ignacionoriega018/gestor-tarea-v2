export interface TiempoRegistrado {
  fecha: string;
  minutos: number;
  descripcion: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  creador: string;
  estado: 'pendiente' | 'en-proceso' | 'terminada';
  fechaCreacion: string;
  fechaFinalizacion?: string;
  tiempoEstimado?: number;
  tiemposRegistrados: TiempoRegistrado[];
}

export interface Creador {
  id: string;
  nombre: string;
}

export interface AppState {
  empresaActual: string;
  creadorActual: string;
}