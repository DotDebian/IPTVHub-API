import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      status: 'ok',
      message: `API up and running for ${process.uptime().toFixed(0)} seconds.`,
    };
  }
}
