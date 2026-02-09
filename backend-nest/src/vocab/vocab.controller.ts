import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { VocabService } from "./vocab.service";
import { CreateVocabDto } from "./dto/create-vocab.dto";
import { UpdateVocabDto } from "./dto/update-vocab.dto";

@Controller("api/vocab")
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Get()
  getAll() {
    return this.vocabService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.vocabService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateVocabDto) {
    return this.vocabService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateVocabDto) {
    return this.vocabService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.vocabService.remove(id);
  }
}
