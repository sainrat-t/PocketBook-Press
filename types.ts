export interface Chapter {
  title: string;
  content: string;
}

export interface BookData {
  title: string;
  subtitle?: string;
  chapters: Chapter[];
  author?: string; // Optional, can be added via UI if missing in JSON
}

export type FontOption = 'times' | 'helvetica' | 'courier';

export interface PDFGenerationConfig {
  format: 'pocket'; // 110mm x 180mm
  fontSize: number;
}
