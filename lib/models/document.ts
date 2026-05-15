import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  fileName: string;
  fileData: Buffer;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy?: string;
}

const DocumentSchema = new Schema({
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  fileData: {
    type: Buffer,
    required: true,
  },
  mimeType: {
    type: String,
    default: 'application/pdf',
  },
  size: {
    type: Number,
    required: true,
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
DocumentSchema.index({ uploadedAt: -1 });

export const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
