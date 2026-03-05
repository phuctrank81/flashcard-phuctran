import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "account", timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  username!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ type: String, enum: ["user", "admin"], default: "user" })
  role!: "user" | "admin";

  @Prop({ default: null })
  verificationToken?: string | null;

  @Prop({ default: null })
  verificationTokenExpiry?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
