export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  columnId: string;
  position?: {
    x: number;
    y: number;
  };
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  completedSteps?: number;
  totalSteps?: number;
  tags?: string[];
  dueDate?: string;
  isAnimating?: boolean;
  sortOrder?: number;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
  icon?: string;
}

export interface Board {
  columns: Column[];
  theme: 'light' | 'dark';
  view: 'kanban' | 'freeform';
  confetti: boolean;
  sound: boolean;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
}

export interface AppSettings {
  animations: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  compactView: boolean;
  freeformMode: boolean;
} 