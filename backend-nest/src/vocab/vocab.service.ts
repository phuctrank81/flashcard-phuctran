import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Word } from "./vocab.schema";
import { CreateVocabDto } from "./dto/create-vocab.dto";
import { UpdateVocabDto } from "./dto/update-vocab.dto";

@Injectable()
export class VocabService {
  constructor(
    @InjectModel(Word.name, "words")
    private readonly wordModel: Model<Word>,
  ) {}

  async getAll() {
    return this.wordModel.find().select("word definition example").lean();
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Word not found");
    }
    const doc = await this.wordModel.findById(id).lean();
    if (!doc) {
      throw new NotFoundException("Word not found");
    }
    return doc;
  }

  async create(dto: CreateVocabDto) {
    const created = await this.wordModel.create({
      word: dto.word,
      definition: dto.definition,
      example: dto.example,
    });
    return created;
  }

  async update(id: string, dto: UpdateVocabDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Word not found");
    }
    const updated = await this.wordModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException("Word not found");
    }
    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Word not found");
    }
    const deleted = await this.wordModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException("Word not found");
    }
    return { message: "Deleted" };
  }
}
