import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Match } from 'src/challenges/interfaces/challenge.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MatchsService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  async createMatch(match: any): Promise<Match> {
    const matchCreated = new this.matchModel(match);
    return await matchCreated.save();
  }

  // async createMatch(createPlayerDto: CreatePlayerDto): Promise<Player> {
  //   const { email } = createPlayerDto;
  //   const playerExists = await this.playerModel.findOne({ email }).exec();

  //   if (playerExists) {
  //     throw new BadRequestException(
  //       `the user with this email or this phone already registered`,
  //     );
  //   }

  //   const playerCreated = new this.playerModel(createPlayerDto);
  //   return await playerCreated.save();
  // }
}
