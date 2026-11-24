import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { QueryPublicCategoryProductDto, QueryPublicProductDto, QueryRelatedProductDto } from './dto/query-public-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadsService } from '../uploads/uploads.service';
export declare class ProductsService {
    private readonly prisma;
    private readonly uploadsService;
    constructor(prisma: PrismaService, uploadsService: UploadsService);
    findAll(query: QueryProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findPublished(query: QueryPublicProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findPublishedByCategory(categorySlug: string, query: QueryPublicCategoryProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findPublishedBySlug(categorySlug: string, productSlug: string): Promise<ProductResponseDto>;
    findRelated(categorySlug: string, productSlug: string, query: QueryRelatedProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findRelatedOtherCategories(categorySlug: string): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<ProductResponseDto>;
    create(dto: CreateProductDto): Promise<ProductResponseDto>;
    update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto>;
    remove(id: string): Promise<{
        id: string;
    }>;
    private getActive;
    private assertCategory;
    private resolvePublicCategoryId;
    private getPublishedProductRef;
    private findRelatedSameCategory;
    private toMoney;
    private assertSalePrice;
    private resolveSlug;
    private toResponse;
    private rethrowUnique;
}
