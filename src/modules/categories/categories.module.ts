import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PublicCategoriesController } from './public-categories.controller';

@Module({
  controllers: [PublicCategoriesController, CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
