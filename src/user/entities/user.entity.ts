import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserProgression } from "./user.progression.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserProgression, (progressions) => progressions.user)
  progressions: UserProgression[];

  @Column("simple-array")
  watchlist: string[];

  constructor(email: string, password: string, watchlist: string[]) {
    this.email = email;
    this.password = password;
    this.watchlist = watchlist;
  }
}
