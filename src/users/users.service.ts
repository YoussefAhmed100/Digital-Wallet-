import {  Injectable } from '@nestjs/common';
import * as userSchema from '../users/schema/user.schema';
import { DrizzleService } from '../database/drizzle.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzle: DrizzleService) {}

  async findAllUsers() {
    return this.drizzle.connection.query.users.findMany();
  }

  async createUser(user: typeof userSchema.users.$inferInsert) {
    const [createdUser] = await this.drizzle.connection
      .insert(userSchema.users)
      .values(user)
      .returning();

    return createdUser;
  }
}
