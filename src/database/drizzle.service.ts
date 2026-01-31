import {  Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DbSchema } from './schema';

@Injectable()
export class DrizzleService {
  constructor(
   
    private readonly db: NodePgDatabase<DbSchema>,
  ) {}

  get connection() {
    return this.db;
  }
}
