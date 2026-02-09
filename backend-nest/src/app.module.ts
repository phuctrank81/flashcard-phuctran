import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { VocabModule } from "./vocab/vocab.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
        dbName: config.get<string>("MONGODB_DB_WORDS") || "words",
      }),
      connectionName: "words",
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
        dbName: config.get<string>("MONGODB_DB_USERS") || "users",
      }),
      connectionName: "users",
    }),
    VocabModule,
    AuthModule,
  ],
})
export class AppModule {}
