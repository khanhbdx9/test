import { Module } from '@nestjs/common';
import { UploadsModule } from '../uploads/uploads.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PublicProductsController } from './public-products.controller';

@Module({
  imports: [UploadsModule],
  controllers: [PublicProductsController, ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
