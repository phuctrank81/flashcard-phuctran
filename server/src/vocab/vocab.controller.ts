import { Controller, Get } from '@nestjs/common';
import { VocabService } from './vocab.service';

@Controller('api/vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Get()
  async findAll() {
    return this.vocabService.findAll();
  }
}