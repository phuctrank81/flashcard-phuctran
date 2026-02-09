import { IsOptional, IsString } from "class-validator";

export class CreateVocabDto {
  @IsString()
  word!: string;

  @IsString()
  definition!: string;

  @IsOptional()
  @IsString()
  example?: string;
}
