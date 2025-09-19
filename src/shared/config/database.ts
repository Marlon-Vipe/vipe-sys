import { DataSource } from 'typeorm';
import { config } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  ssl: config.database.ssl,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [__dirname + '/../../domain/entities/*.ts'],
  migrations: [__dirname + '/../../infrastructure/database/migrations/*.ts'],
  subscribers: [__dirname + '/../../infrastructure/database/subscribers/*.ts'],
});

export default AppDataSource;
