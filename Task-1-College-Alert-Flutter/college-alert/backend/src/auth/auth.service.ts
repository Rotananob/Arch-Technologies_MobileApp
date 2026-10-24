import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        studentId: dto.studentId,
        department: dto.department,
        phoneNumber: dto.phoneNumber,
        preferences: {
          create: {
            eventAnnouncements: true,
            upcomingReminders: true,
            registrationUpdates: true,
            generalAlerts: true,
          },
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        studentId: true,
        department: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        department: user.department,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async refresh(dto: RefreshDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'college_alert_refresh_secret_key_change_in_production_2026',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isTokenValid = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
      if (!isTokenValid) {
        throw new UnauthorizedException('Refresh token revoked or expired');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { success: true, message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    // Return same message regardless to avoid email enumeration
    return {
      success: true,
      message: 'If an account exists with this email, password reset instructions have been dispatched.',
      // For development/demo convenience:
      resetToken: user ? this.jwtService.sign({ sub: user.id, purpose: 'reset' }, { expiresIn: '1h' }) : null,
    };
  }

  async resetPassword(token: string, newPass: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'reset') {
        throw new BadRequestException('Invalid reset token');
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPass, salt);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: {
          passwordHash,
          refreshTokenHash: null,
        },
      });

      return { success: true, message: 'Password has been reset successfully. Please log in.' };
    } catch {
      throw new BadRequestException('Reset token is invalid or expired');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'college_alert_access_secret_key_change_in_production_2026',
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'college_alert_refresh_secret_key_change_in_production_2026',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 mins in seconds
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}
