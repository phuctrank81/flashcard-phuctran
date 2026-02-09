import { IsOptional, IsString } from "class-validator";

export class UpdateVocabDto {
  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsString()
  example?: string;
}
