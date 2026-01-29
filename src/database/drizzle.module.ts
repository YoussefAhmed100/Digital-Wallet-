import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema, DbSchema } from './schema';
import { DrizzleService } from './drizzle.service';

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService): NodePgDatabase<DbSchema> => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
          ssl: {
            rejectUnauthorized: false,
          },
        });
        return drizzle(pool, { schema });
      },
      inject: [ConfigService],
    },
    {
      provide: DrizzleService,
      useFactory: (db: NodePgDatabase<DbSchema>) => {
        return new DrizzleService(db);
      },
      inject: [DATABASE_CONNECTION],
    },
  ],
  exports: [DATABASE_CONNECTION, DrizzleService],
})
export class DrizzleModule {}
