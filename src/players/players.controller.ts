import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getPlayers();
  }

  @Get(':email')
  async getPlayersByEmail(@Param('email') email: string): Promise<Player> {
    return await this.playersService.getPlayerByEmail(email);
  }

  @Delete(':email')
  @HttpCode(204)
  async deletePlayerByEmail(@Param('email') email: string): Promise<void> {
    await this.playersService.deletePlayerByEmail(email);
    return;
  }
}
