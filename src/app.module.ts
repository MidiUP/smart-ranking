import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchsModule } from './matchs/matchs.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mateus:123@cluster0.uj8bzof.mongodb.net/smartranking?retryWrites=true&w=majority',
    ),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
    MatchsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
