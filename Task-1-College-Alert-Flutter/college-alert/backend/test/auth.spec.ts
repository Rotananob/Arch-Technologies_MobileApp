import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService (Unit Tests)', () => {
  let authService: AuthService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const mockJwt = {
      signAsync: jest.fn().mockResolvedValue('mock_jwt_token'),
      verify: jest.fn(),
    };

    const mockConfig = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'test_secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw ConflictException if registering existing email', async () => {
    prismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@college.edu' });

    await expect(
      authService.register({
        email: 'test@college.edu',
        password: 'Password123!',
        fullName: 'Test User',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException for non-existent user on login', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'nonexistent@college.edu',
        password: 'Password123!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
