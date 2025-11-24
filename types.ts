export type GridType = 'tian' | 'mi' | 'hui' | 'square';

export interface AppState {
  text: string;
  gridType: GridType;
  showGuides: boolean;
  showPinyin: boolean;
  brushColor: string;
  isDrawingMode: boolean;
  topic: string;
  isLoading: boolean;
}

export const GRID_OPTIONS: { value: GridType; label: string }[] = [
  { value: 'tian', label: '田字格' },
  { value: 'mi', label: '米字格' },
  { value: 'hui', label: '回宫格' },
  { value: 'square', label: '方格' },
];

export const PRESET_TOPICS = [
  "春天的景色",
  "唐诗三百首",
  "成语练习",
  "文明礼貌",
  "快乐假期",
  "常用汉字",
  "数字一到十"
];

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
}