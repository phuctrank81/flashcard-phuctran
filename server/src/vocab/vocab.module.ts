import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabController } from './vocab.controller';
import { VocabService } from './vocab.service';
import { Word, WordSchema } from './schemas/word.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }])],
  controllers: [VocabController],
  providers: [VocabService],
})
export class VocabModule {}