import { serverError } from './../helpers/http/http-helpers';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Put(':_id')
  async updatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param('_id') _id: string,
  ): Promise<Player> {
    try {
      return await this.playersService.updatePlayer(createPlayerDto, _id);
    } catch (err) {
      serverError(err);
    }
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getPlayers();
  }

  @Get(':_id')
  async getPlayersById(@Param('_id') _id: string): Promise<Player> {
    return await this.playersService.getPlayerById(_id);
  }

  @Delete(':_id')
  @HttpCode(204)
  async deletePlayerById(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayerById(_id);
    return;
  }
}
