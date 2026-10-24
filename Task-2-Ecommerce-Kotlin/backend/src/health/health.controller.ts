import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Backend service health check' })
  check() {
    return {
      status: 'ok',
      service: 'ShopSphere E-Commerce API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
