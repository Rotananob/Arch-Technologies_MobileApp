import { Controller, Get, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../auth/decorators/auth.decorators';

@ApiTags('Seller')
@Controller('api/seller')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('listings')
  @ApiOperation({ summary: 'Get current user active product listings' })
  async getMyListings(@CurrentUser() user: any) {
    return this.sellerService.getMyListings(user.id);
  }

  @Delete('listings/:id')
  @ApiOperation({ summary: 'Delete product listing owned by current seller' })
  async deleteListing(@CurrentUser() user: any, @Param('id') id: string) {
    return this.sellerService.deleteListing(user.id, id);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get customer orders containing products sold by current user' })
  async getSellerSalesOrders(@CurrentUser() user: any) {
    return this.sellerService.getSellerSalesOrders(user.id);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update customer order fulfillment status' })
  async updateOrderStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.sellerService.updateOrderStatus(user.id, id, status);
  }
}
