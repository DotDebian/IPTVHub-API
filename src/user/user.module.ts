import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from "../auth/auth.module";
import { UserProgression } from "./entities/user.progression.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProgression]),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
