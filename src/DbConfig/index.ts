import { DataSource } from "typeorm";
import { envConfig } from "../config/env.config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envConfig.db.host,
  port: envConfig.db.port,
  username: envConfig.db.username,
  // password: envConfig.db.password,
  password: "123",
  database: envConfig.db.database,
  synchronize: false,
  logging: envConfig.server.env === 'development',
  entities: ['src/Entities/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
});