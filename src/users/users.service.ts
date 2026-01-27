import { Inject, Injectable, Type } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as userSchema from '../users/schema/user.schema';
import { DATABASE_CONNECTION } from '../database/database-connection'

@Injectable()
export class UsersService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database:NodePgDatabase<typeof userSchema> ,
    ) {}

    async findAllUsers() {
        return this.database.query.users.findMany();
    }

    
async createUser(user: typeof userSchema.users.$inferInsert) {
  const [createdUser] = await this.database
    .insert(userSchema.users)
    .values(user)
    .returning();

  return createdUser;
}

 
}
