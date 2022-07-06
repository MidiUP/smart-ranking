import { MatchsService } from './../matchs/matchs.service';
import { AttributeMatchChallengeDto } from './dtos/attribute-match-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { CategoriesService } from './../categories/categories.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { PlayersService } from './../players/players.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    private readonly matchsService: MatchsService,
  ) {}

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    await this.playersService.getPlayerById(createChallengeDto.players[0]);
    await this.playersService.getPlayerById(createChallengeDto.players[1]);

    const { category } = await this.categoriesService.getCategoryOfPlayer(
      createChallengeDto.requester,
    );

    const challengeCreated = new this.challengeModel({
      ...createChallengeDto,
      dateHourInvite: new Date(),
      category,
      status: ChallengeStatus.PENDING,
    });
    return await challengeCreated.save();
  }

  async getChallenges(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate(['players', 'match'])
      .exec();
  }

  async getChallengesByUser(idPlayer: string): Promise<Challenge[]> {
    return await this.challengeModel
      .find({})
      .where('players')
      .in([idPlayer])
      .populate(['players', 'match'])
      .exec();
  }

  async getChallengeById(_id: string): Promise<Challenge> {
    return await this.challengeModel
      .findOne({ _id })
      .populate(['players', 'match'])
      .exec();
  }

  async updateChallenge(
    idChallenge: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const challengeExists = await this.challengeModel
      .findOne({ _id: idChallenge })
      .exec();

    if (!challengeExists) {
      throw new NotFoundException(
        `cannot find challenge with id: ${idChallenge}`,
      );
    }

    return await this.challengeModel
      .findOneAndUpdate({ _id: idChallenge }, { $set: updateChallengeDto })
      .exec();
  }

  async deleteChallenge(_id: string): Promise<void> {
    await this.challengeModel
      .findOneAndUpdate(
        { _id },
        { $set: { status: ChallengeStatus.CANCELLED } },
      )
      .exec();
  }

  async addMatchChallenge(
    _id: string,
    attributeMatchChallengeDto: AttributeMatchChallengeDto,
  ) {
    const challengeExists = await this.challengeModel
      .findOne({ _id })
      .populate('players')
      .exec();

    if (!challengeExists) {
      throw new NotFoundException(`cannot find challenge with id: ${_id}`);
    }

    const existsPlayer = challengeExists.players.find(
      (player) => player.id === attributeMatchChallengeDto.def,
    );

    if (!existsPlayer) {
      throw new NotFoundException(
        `this player is not registered in this challenge`,
      );
    }

    const { category } = await this.categoriesService.getCategoryOfPlayer(
      existsPlayer.id,
    );

    const match = {
      ...attributeMatchChallengeDto,
      category,
      players: challengeExists.players.map((player) => player._id),
    };

    const matchCreated = await this.matchsService.createMatch(match);

    await this.challengeModel
      .findByIdAndUpdate(
        { _id },
        {
          $set: { status: ChallengeStatus.COMPLETED, match: matchCreated._id },
        },
      )
      .exec();
  }
}
