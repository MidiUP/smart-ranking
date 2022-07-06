import { AttributeMatchChallengeDto } from './dtos/attribute-match-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengesService } from './challenges.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ValidationParamsPipe } from 'src/common/pipes/players-validation-params.pipe';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return await this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(
    @Query('idPlayer', ValidationParamsPipe) idPlayer: string,
  ): Promise<Challenge[]> {
    if (idPlayer) {
      return await this.challengeService.getChallengesByUser(idPlayer);
    }
    return await this.challengeService.getChallenges();
  }

  @Get(':_id')
  async getChallengeById(@Param('_id') _id: string): Promise<Challenge> {
    return await this.challengeService.getChallengeById(_id);
  }

  @Put(':idChallenge')
  @UsePipes(ValidationPipe)
  async updateChallenges(
    @Param('idChallenge') idChallenge: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengeService.updateChallenge(
      idChallenge,
      updateChallengeDto,
    );
  }

  @Delete(':idChallenge')
  @HttpCode(204)
  async deleteChallenge(
    @Param('idChallenge') idChallenge: string,
  ): Promise<void> {
    await this.challengeService.deleteChallenge(idChallenge);
  }

  @Post('addMatchChallenge/:idChallenge')
  async addMatchChallenge(
    @Param('idChallenge') idChallenge: string,
    @Body() attributeMatchChallengeDto: AttributeMatchChallengeDto,
  ): Promise<void> {
    await this.challengeService.addMatchChallenge(
      idChallenge,
      attributeMatchChallengeDto,
    );
  }
}
