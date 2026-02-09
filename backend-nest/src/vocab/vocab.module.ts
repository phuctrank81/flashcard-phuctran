import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VocabController } from "./vocab.controller";
import { VocabService } from "./vocab.service";
import { Word, WordSchema } from "./vocab.schema";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Word.name, schema: WordSchema }],
      "words",
    ),
  ],
  controllers: [VocabController],
  providers: [VocabService],
})
export class VocabModule {}
