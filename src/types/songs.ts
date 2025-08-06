export type DashboardEntry = {
  id: number;
  song: string;
  author: string;
  progress: number | null;
  lastClickDate: string | null;
  lastClickProgress: number | null;
};

/**
 * Type guard for @type DashboardEntry
 * TODO check property values and respective types
 */
export const isDashboardEntry = (data?: unknown): data is DashboardEntry => {
  const o = data as Record<string, unknown>;
  return o.id != null && o.song != null && o.author != null;
};
