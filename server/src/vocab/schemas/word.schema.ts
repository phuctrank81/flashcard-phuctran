import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WordDocument = Word & Document;

@Schema({ timestamps: true })
export class Word {
  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  definition: string;

  @Prop({ required: true })
  example: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);