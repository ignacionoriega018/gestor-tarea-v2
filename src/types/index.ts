export interface TiempoRegistrado {
  fecha: string;
  minutos: number;
  descripcion: string;
}

export interface HistorialTarea {
  fecha: string;
  tipo: 'creacion' | 'cambio_estado' | 'tiempo_registrado' | 'cambio_sprint';
  descripcion: string;
  estado: string;
}

export interface UserStory {
  role: string;
  want: string;
  benefit: string;
}

export interface AcceptanceCriteria {
  id: string;
  descripcion: string;
  completado: boolean;
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
  sprintId?: string;
  asignado?: string;
  storyPoints?: number;
  historial?: HistorialTarea[];
  prioridad?: 'alta' | 'media' | 'baja';
  userStory?: UserStory;
  acceptanceCriteria?: AcceptanceCriteria[];
  impediments?: string[];
  definitionOfDone?: string[];
}

export interface Creador {
  id: string;
  nombre: string;
}

export interface ConfiguracionEmpresa {
  id: string;
  nombre: string;
  logo?: string;
}

export interface AppState {
  empresaActual: string;
  creadorActual: string;
}

export interface DailyScrum {
  fecha: string;
  miembro: string;
  ayer: string;
  hoy: string;
  impedimentos: string[];
}

export interface Sprint {
  id: string;
  empresaId: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'finalizado' | 'reabierto';
  objetivos: string[];
  retrospectiva?: {
    bueno: string[];
    mejorar: string[];
    acciones: string[];
  };
  velocidad?: number;
  capacidad?: number;
  meta?: string;
  dailyScrums?: DailyScrum[];
  burndownData?: {
    fecha: string;
    puntosPendientes: number;
  }[];
}