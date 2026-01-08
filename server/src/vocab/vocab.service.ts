import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Word, WordDocument } from './schemas/word.schema';

@Injectable()
export class VocabService {
  constructor(
    @InjectModel(Word.name) private wordModel: Model<WordDocument>,
  ) {}

  async findAll(): Promise<Word[]> {
    return this.wordModel.find().exec();
  }
}