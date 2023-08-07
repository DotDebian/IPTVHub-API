import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { MediaType } from "../../enum/media.type.enum";

@Entity()
export class UserProgression {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tmdbId: string;

  @Column({
    type: "enum",
    enum: MediaType
  })
  mediaType: MediaType;

  @Column({ nullable: true })
  miscData: string;

  @Column()
  timecode: number;

  @ManyToOne(() => User, (user) => user.progressions)
  user: User;

  constructor(tmdbId: string, mediaType: MediaType, miscData: string, timecode: number) {
    this.tmdbId = tmdbId;
    this.mediaType = mediaType;
    this.miscData = miscData;
    this.timecode = timecode;
  }
}