import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from './payload.interface';
import { UserService } from "../user/user.service";
import { hash } from "typeorm/util/StringUtils";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async signIn(email: string, pass: string): Promise<any> {
    this.logger.log(`Tentative de connexion au compte ${email}`);
    const userEncryptedPassword =
      await this.userService.getEncryptedPasswordFromEmail(email);
    if (userEncryptedPassword == null) {
      await this.userService.save(
        {
          email: email,
          password: pass
        }
      );

      const payload = await this.userService.getUserPayload(email);

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    const correctPassword: boolean = hash(pass) === userEncryptedPassword;
    if (!correctPassword) {
      this.logger.error('Mot de passe incorrect');
      throw new UnauthorizedException();
    }
    const payload = await this.userService.getUserPayload(email);
    this.logger.log(`Connexion réussie au compte ${email}`);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async refresh(payload: Payload) {
    const newPayload: Payload = {
      email: payload.email,
      id: payload.id,
      isActive: payload.isActive,
    };
    this.logger.log(
      `Rafraîchissment du token user ID:${payload.id} ${payload.email}`,
    );
    const signedPayload = await this.jwtService.signAsync(newPayload);
    return {
      access_token: signedPayload,
    };
  }
}
