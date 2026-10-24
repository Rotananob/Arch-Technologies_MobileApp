import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../auth/decorators/auth.decorators';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter marketplace products' })
  async findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.productsService.findAll({
      search,
      categoryId,
      sortBy,
      isFeatured: isFeatured === 'true' ? true : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific product' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a new product listing (Seller/C2C)' })
  async create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product listing' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.delete(id, user.id, user.role);
  }
}
