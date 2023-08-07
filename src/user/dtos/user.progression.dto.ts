import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MediaType } from "../../enum/media.type.enum";

export class UserProgressionDto {
  @IsNotEmpty()
  tmdbId: string;

  @IsNotEmpty()
  @IsEnum(MediaType)
  mediaType: MediaType;

  miscData: string;

  @IsNotEmpty()
  timecode: number;
}
