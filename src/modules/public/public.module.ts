import { Module } from '@nestjs/common';
import { BannersModule } from '../banners/banners.module';
import { CategoriesModule } from '../categories/categories.module';
import { OrdersModule } from '../orders/orders.module';
import { PostsModule } from '../posts/posts.module';
import { ProductsModule } from '../products/products.module';
import { SystemConfigsModule } from '../system-configs/system-configs.module';
import { ThemesModule } from '../themes/themes.module';
import { UploadsModule } from '../uploads/uploads.module';
import { PublicFilterService } from './public-filter.service';
import { PublicStorefrontController } from './public-storefront.controller';

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    ThemesModule,
    BannersModule,
    PostsModule,
    SystemConfigsModule,
    UploadsModule,
  ],
  controllers: [PublicStorefrontController],
  providers: [PublicFilterService],
})
export class PublicModule {}
