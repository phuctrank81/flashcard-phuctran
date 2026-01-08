import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabModule } from './vocab/vocab.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    VocabModule,
  ],
})
export class AppModule {}