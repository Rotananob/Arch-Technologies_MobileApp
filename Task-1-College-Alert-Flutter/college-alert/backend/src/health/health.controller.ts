import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Backend system health check' })
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'college-alert-backend',
        database: 'connected',
      };
    } catch (e) {
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        service: 'college-alert-backend',
        database: 'disconnected',
        error: e.message,
      };
    }
  }
}
