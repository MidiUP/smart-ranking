import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (playerExists) {
      throw new BadRequestException(
        `the user with this email or this phone already registered`,
      );
    }

    const playerCreated = new this.playerModel(createPlayerDto);
    return await playerCreated.save();
  }

  async updatePlayer(
    createPlayerDto: CreatePlayerDto,
    _id: string,
  ): Promise<Player> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) {
      throw new NotFoundException(`cannot find user with id: ${_id}`);
    }

    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: createPlayerDto })
      .exec();
  }

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    return await this.playerModel.findOne({ _id }).exec();
  }

  async deletePlayerById(_id: string): Promise<void> {
    return this.playerModel.remove({ _id }).exec();
  }
}
