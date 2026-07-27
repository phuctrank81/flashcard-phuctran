export interface IPDFDocument {
  fileName: string;
  s3Key: string;
  mimeType: string;
  size: number;
  category: 'IELTS' | 'TOEIC';
  series?: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export const PDFDocument = null;
