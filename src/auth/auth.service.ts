import {
  Injectable,
  UnauthorizedException,
  ConflictException,

} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import { DrizzleService } from '../database/drizzle.service';
import * as userSchema from '../users/schema/user.schema';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { PasswordService } from './utils/password.service';
import { TokenService } from './utils/token.service';

@Injectable()
export class AuthService {
  constructor(
    
    private readonly drizzle: DrizzleService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  /* ===================== REGISTER ===================== */
  async register(dto: RegisterDto) {
    const exists = await this.drizzle.connection.query.users.findFirst({
      where: eq(userSchema.users.email, dto.email),
    });

    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword =
      await this.passwordService.hash(dto.password);

    const [user] = await this.drizzle.connection
      .insert(userSchema.users)
      .values({
        email: dto.email,
        userName: dto.userName,
        password: hashedPassword,
      })
      .returning();

    return this.issueTokens(user);
  }

  /* ===================== LOGIN ===================== */
  async login(dto: LoginDto) {
    const user = await this.drizzle.connection.query.users.findFirst({
      where: eq(userSchema.users.email, dto.email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordService.compare(
      dto.password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  /* ===================== LOGOUT ===================== */
  async logout(userId: string) {
    await this.drizzle.connection
      .update(userSchema.users)
      .set({ refreshTokenHash: null })
      .where(eq(userSchema.users.id, userId));
  }

  /* ===================== REFRESH ===================== */
  async refresh(userId: string, refreshToken: string) {
    const user = await this.drizzle.connection.query.users.findFirst({
      where: eq(userSchema.users.id, userId),
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const isValid =
      await this.tokenService.compareRefreshToken(
        refreshToken,
        user.refreshTokenHash,
      );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return this.issueTokens(user);
  }

  /* ===================== TOKEN ISSUER ===================== */
  private async issueTokens(user: {
    id: string;
    userName: string;
    email: string;
    role: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      this.tokenService.generateAccessToken(payload);

    const refreshToken =
      this.tokenService.generateRefreshToken(payload);

    const refreshTokenHash =
      await this.tokenService.hashRefreshToken(refreshToken);

    await this.drizzle.connection
      .update(userSchema.users)
      .set({ refreshTokenHash })
      .where(eq(userSchema.users.id, user.id));

    return {
      accessToken,
      refreshToken,
    };
  }
}
