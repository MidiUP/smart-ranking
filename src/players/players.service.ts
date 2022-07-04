import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (playerExists) {
      this.update(createPlayerDto);
      return;
    }

    this.create(createPlayerDto);
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    return await this.playerModel.findOne({ email }).exec();
  }

  async deletePlayerByEmail(email: string): Promise<void> {
    return this.playerModel.remove({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerCreated = new this.playerModel(createPlayerDto);
    return await playerCreated.save();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ email: createPlayerDto }, { $set: createPlayerDto })
      .exec();
  }
}
