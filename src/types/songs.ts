export type SongEntry = {
  id: number;
  song: string;
  author: string;
  progress: number | null;
  lastClickDate: string | null;
  lastClickProgress: number | null;
};
