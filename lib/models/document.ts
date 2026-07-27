import mongoose, { Schema, Document } from 'mongoose';

export interface IPDFDocument extends Document {
  fileName: string;
  s3Key: string;
  mimeType: string;
  size: number;
  category: 'IELTS' | 'TOEIC';
  series?: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

const DocumentSchema = new Schema({
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  s3Key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  mimeType: {
    type: String,
    default: 'application/pdf',
  },
  size: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['IELTS', 'TOEIC'],
    default: 'IELTS',
    required: true,
  },
  series: {
    type: String,
    trim: true,
    default: '',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: String,
    default: 'admin',
  },
});

// Tạo index để tìm kiếm nhanh
DocumentSchema.index({ fileName: 1 });
DocumentSchema.index({ s3Key: 1 }, { unique: true });
DocumentSchema.index({ uploadedAt: -1 });
DocumentSchema.index({ category: 1 });
DocumentSchema.index({ category: 1, series: 1 });

export const PDFDocument = mongoose.models.PDFDocument || mongoose.model<IPDFDocument>('PDFDocument', DocumentSchema);
