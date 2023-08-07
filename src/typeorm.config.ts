import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./user/entities/user.entity";
import { UserProgression } from "./user/entities/user.progression.entity";
import { DatabaseInit1690998860947 } from "./migrations/1690998860947-DatabaseInit";
import { AddTimecode1691000220668 } from "./migrations/1691000220668-AddTimecode";

config({ path: '.env.development' });
config({ path: '.env', override: true });

export const options: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_USERNAME) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    UserProgression
  ],
  migrations: [
    DatabaseInit1690998860947,
    AddTimecode1691000220668
  ],
  synchronize: false,
};

export default new DataSource(options);
