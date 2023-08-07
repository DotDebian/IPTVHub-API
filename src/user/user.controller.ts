import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from "@nestjs/common";
import * as process from 'process';
import { UserService } from './user.service';
import { AuthGuard } from "../auth/auth.guard";
import { Payload } from "../auth/payload.interface";
import { User } from "./entities/user.entity";
import { UserProgressionDto } from "./dtos/user.progression.dto";

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retourne l'entité de l'utilisateur connecté
   */
  @Get('me')
  getCurrentUser(@Req() req) {
    const payload: Payload = req['payload'];
    return this.userService.findOneById(payload.id);
  }

  @Post('watchlist')
  @HttpCode(200)
  async toggleWatchList(@Req() req, @Body() body: {tmdbId: string}) {
    const payload: Payload = req['payload'];
    let user = await this.userService.findOneById(payload.id);

    const index = user.watchlist.indexOf(body.tmdbId);
    if (index === -1) {
      user.watchlist.push(body.tmdbId);
    } else {
      user.watchlist.splice(index, 1);
    }

    return (await this.userService.update(user)).watchlist;
  }

  @Get('watchlist')
  async getWatchlist(@Req() req) {
    const payload: Payload = req['payload'];
    let user = await this.userService.findOneById(payload.id);
    return user.watchlist;
  }

  @Post('progressions')
  async updateProgressions(@Req() req, @Body() userProgressionDto : UserProgressionDto) {
    const payload: Payload = req['payload'];
    let user = await this.userService.findOneById(payload.id);

    return await this.userService.saveProgression(user, userProgressionDto);
  }

  @Get('progressions')
  async getProgressions(@Req() req) {
    const payload: Payload = req['payload'];
    let user = await this.userService.findOneById(payload.id);

    return user.progressions;
  }
}
