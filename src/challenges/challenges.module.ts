import { MatchsModule } from './../matchs/matchs.module';
import { CategoriesModule } from './../categories/categories.module';
import { PlayersModule } from './../players/players.module';
import { ChallengeSchema } from '../challenges/interfaces/challenge.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    PlayersModule,
    CategoriesModule,
    MatchsModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
