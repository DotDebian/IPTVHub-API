import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Permet de se connecter au service
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  /**
   * Permet de se déconnecter (suppression du cookie httpOnly)
   */
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.payload;
  }

  /**
   * Retourne un token actualisé si celui fourni est toujours valable
   */
  @UseGuards(AuthGuard)
  @Get('refresh')
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.refresh(req.payload);
    res.cookie('access_token', result['access_token'], {
      signed: true,
      httpOnly: true,
      sameSite: 'strict',
    });
    return result;
  }
}