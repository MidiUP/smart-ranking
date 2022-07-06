import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/challenge.interface';

export class AttributeMatchChallengeDto {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  restult: Result[];
}
