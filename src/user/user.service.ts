import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from "typeorm";
import { User } from './entities/user.entity';
import { Payload } from "../auth/payload.interface";
import { CreateUserDto } from "./dtos/create-user.dto";
import { hash } from "typeorm/util/StringUtils";
import { UserProgression } from "./entities/user.progression.entity";
import { UserProgressionDto } from "./dtos/user.progression.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProgression)
    private userProgressionRepository: Repository<UserProgression>,
  ) {}

  async getUserPayload(email: string): Promise<Payload> {
    const user = await this.userRepository.findOneByOrFail({ email: email });
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
    };
  }

  findOneById(id: number) {
    return this.userRepository.findOne({
      where: {id: id},
      relations: {
        progressions: true
      }
    });
  }

  async getEncryptedPasswordFromEmail(email: string) {
    return (
      await this.userRepository.findOne({
        where: { email: email },
        select: { password: true },
      })
    )?.password;
  }

  async save(
    createUserDto: CreateUserDto
  ): Promise<Array<ObjectLiteral>> {
    const exists = await this.userRepository.exist({
      where: { email: createUserDto.email },
    });

    if (exists) {
      throw new ConflictException();
    }
    const hashedPassword = hash(createUserDto.password);

    const result = await this.userRepository.insert(new User(
      createUserDto.email,
      hashedPassword,
      []
    ));

    return result.identifiers;
  }

  async update(
    user: User
  ): Promise<User> {
    return this.userRepository.save(user);
  }

  // @ts-ignore
  async saveProgression(
    user: User,
    userProgression: UserProgressionDto
  ): Promise<User> {
    let savedProgression = user.progressions.find(prog => prog.tmdbId == userProgression.tmdbId);

    if (savedProgression == undefined) {
      savedProgression = new UserProgression(
        userProgression.tmdbId,
        userProgression.mediaType,
        userProgression.miscData,
        userProgression.timecode
      );

      let progression = await this.userProgressionRepository.save(savedProgression);
      user.progressions.push(progression);

      return await this.userRepository.save(user);
    } else {
      savedProgression.mediaType = userProgression.mediaType;
      savedProgression.miscData = userProgression.miscData;
      savedProgression.timecode = userProgression.timecode;

      await this.userProgressionRepository.save(savedProgression);

      return user;
    }
  }
}
