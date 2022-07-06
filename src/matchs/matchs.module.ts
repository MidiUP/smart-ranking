import { MatchSchema } from './interfaces/match.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
  ],
  providers: [MatchsService],
  exports: [MatchsService],
})
export class MatchsModule {}
