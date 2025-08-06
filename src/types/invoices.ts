export type InvoiceEntry = {
  id: number;
  date: string;
  author: string;
  songName: string;
  progress: number;
};

/**
 * Type guard for @type InvoiceEntry
 * TODO check property values and respective types
 */
export const isInvoiceEntry = (data?: unknown): data is InvoiceEntry => {
  const o = data as Record<string, unknown>;
  return (
    o.id != null &&
    o.date != null &&
    o.author != null &&
    o.songName != null &&
    o.progress != null
  );
};
