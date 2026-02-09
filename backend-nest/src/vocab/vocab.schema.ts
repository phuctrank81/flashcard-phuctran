import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "ielts_vocabulary", timestamps: true })
export class Word extends Document {
  @Prop({ required: true })
  word!: string;

  @Prop({ required: true })
  definition!: string;

  @Prop()
  example?: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
