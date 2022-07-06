import { ChallengeStatus } from './challenge-status.enum';
import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourInvite: Date;
  dateHourResponse: Date;
  requester: Player;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export interface Result {
  set: string;
}
