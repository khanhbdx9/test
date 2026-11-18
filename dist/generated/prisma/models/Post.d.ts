import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PostModel = runtime.Types.Result.DefaultSelection<Prisma.$PostPayload>;
export type AggregatePost = {
    _count: PostCountAggregateOutputType | null;
    _min: PostMinAggregateOutputType | null;
    _max: PostMaxAggregateOutputType | null;
};
export type PostMinAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    title: string | null;
    slug: string | null;
    thumbnailUrl: string | null;
    content: string | null;
    excerpt: string | null;
    status: $Enums.PostStatus | null;
    showOnLanding: boolean | null;
    publishedAt: Date | null;
    seoTitle: string | null;
    seoDescription: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type PostMaxAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    title: string | null;
    slug: string | null;
    thumbnailUrl: string | null;
    content: string | null;
    excerpt: string | null;
    status: $Enums.PostStatus | null;
    showOnLanding: boolean | null;
    publishedAt: Date | null;
    seoTitle: string | null;
    seoDescription: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type PostCountAggregateOutputType = {
    id: number;
    authorId: number;
    title: number;
    slug: number;
    thumbnailUrl: number;
    content: number;
    excerpt: number;
    status: number;
    showOnLanding: number;
    publishedAt: number;
    seoTitle: number;
    seoDescription: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type PostMinAggregateInputType = {
    id?: true;
    authorId?: true;
    title?: true;
    slug?: true;
    thumbnailUrl?: true;
    content?: true;
    excerpt?: true;
    status?: true;
    showOnLanding?: true;
    publishedAt?: true;
    seoTitle?: true;
    seoDescription?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type PostMaxAggregateInputType = {
    id?: true;
    authorId?: true;
    title?: true;
    slug?: true;
    thumbnailUrl?: true;
    content?: true;
    excerpt?: true;
    status?: true;
    showOnLanding?: true;
    publishedAt?: true;
    seoTitle?: true;
    seoDescription?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type PostCountAggregateInputType = {
    id?: true;
    authorId?: true;
    title?: true;
    slug?: true;
    thumbnailUrl?: true;
    content?: true;
    excerpt?: true;
    status?: true;
    showOnLanding?: true;
    publishedAt?: true;
    seoTitle?: true;
    seoDescription?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type PostAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    cursor?: Prisma.PostWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PostCountAggregateInputType;
    _min?: PostMinAggregateInputType;
    _max?: PostMaxAggregateInputType;
};
export type GetPostAggregateType<T extends PostAggregateArgs> = {
    [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePost[P]> : Prisma.GetScalarType<T[P], AggregatePost[P]>;
};
export type PostGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithAggregationInput | Prisma.PostOrderByWithAggregationInput[];
    by: Prisma.PostScalarFieldEnum[] | Prisma.PostScalarFieldEnum;
    having?: Prisma.PostScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PostCountAggregateInputType | true;
    _min?: PostMinAggregateInputType;
    _max?: PostMaxAggregateInputType;
};
export type PostGroupByOutputType = {
    id: string;
    authorId: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    content: string;
    excerpt: string | null;
    status: $Enums.PostStatus;
    showOnLanding: boolean;
    publishedAt: Date | null;
    seoTitle: string | null;
    seoDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: PostCountAggregateOutputType | null;
    _min: PostMinAggregateOutputType | null;
    _max: PostMaxAggregateOutputType | null;
};
export type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PostGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PostGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PostGroupByOutputType[P]>;
}>>;
export type PostWhereInput = {
    AND?: Prisma.PostWhereInput | Prisma.PostWhereInput[];
    OR?: Prisma.PostWhereInput[];
    NOT?: Prisma.PostWhereInput | Prisma.PostWhereInput[];
    id?: Prisma.UuidFilter<"Post"> | string;
    authorId?: Prisma.UuidFilter<"Post"> | string;
    title?: Prisma.StringFilter<"Post"> | string;
    slug?: Prisma.StringFilter<"Post"> | string;
    thumbnailUrl?: Prisma.StringNullableFilter<"Post"> | string | null;
    content?: Prisma.StringFilter<"Post"> | string;
    excerpt?: Prisma.StringNullableFilter<"Post"> | string | null;
    status?: Prisma.EnumPostStatusFilter<"Post"> | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFilter<"Post"> | boolean;
    publishedAt?: Prisma.DateTimeNullableFilter<"Post"> | Date | string | null;
    seoTitle?: Prisma.StringNullableFilter<"Post"> | string | null;
    seoDescription?: Prisma.StringNullableFilter<"Post"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Post"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Post"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Post"> | Date | string | null;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PostOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrder;
    excerpt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    showOnLanding?: Prisma.SortOrder;
    publishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoDescription?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    author?: Prisma.UserOrderByWithRelationInput;
};
export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.PostWhereInput | Prisma.PostWhereInput[];
    OR?: Prisma.PostWhereInput[];
    NOT?: Prisma.PostWhereInput | Prisma.PostWhereInput[];
    authorId?: Prisma.UuidFilter<"Post"> | string;
    title?: Prisma.StringFilter<"Post"> | string;
    thumbnailUrl?: Prisma.StringNullableFilter<"Post"> | string | null;
    content?: Prisma.StringFilter<"Post"> | string;
    excerpt?: Prisma.StringNullableFilter<"Post"> | string | null;
    status?: Prisma.EnumPostStatusFilter<"Post"> | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFilter<"Post"> | boolean;
    publishedAt?: Prisma.DateTimeNullableFilter<"Post"> | Date | string | null;
    seoTitle?: Prisma.StringNullableFilter<"Post"> | string | null;
    seoDescription?: Prisma.StringNullableFilter<"Post"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Post"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Post"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Post"> | Date | string | null;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "slug">;
export type PostOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrder;
    excerpt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    showOnLanding?: Prisma.SortOrder;
    publishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    seoDescription?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PostCountOrderByAggregateInput;
    _max?: Prisma.PostMaxOrderByAggregateInput;
    _min?: Prisma.PostMinOrderByAggregateInput;
};
export type PostScalarWhereWithAggregatesInput = {
    AND?: Prisma.PostScalarWhereWithAggregatesInput | Prisma.PostScalarWhereWithAggregatesInput[];
    OR?: Prisma.PostScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PostScalarWhereWithAggregatesInput | Prisma.PostScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Post"> | string;
    authorId?: Prisma.UuidWithAggregatesFilter<"Post"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Post"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Post"> | string;
    thumbnailUrl?: Prisma.StringNullableWithAggregatesFilter<"Post"> | string | null;
    content?: Prisma.StringWithAggregatesFilter<"Post"> | string;
    excerpt?: Prisma.StringNullableWithAggregatesFilter<"Post"> | string | null;
    status?: Prisma.EnumPostStatusWithAggregatesFilter<"Post"> | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolWithAggregatesFilter<"Post"> | boolean;
    publishedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null;
    seoTitle?: Prisma.StringNullableWithAggregatesFilter<"Post"> | string | null;
    seoDescription?: Prisma.StringNullableWithAggregatesFilter<"Post"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Post"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Post"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null;
};
export type PostCreateInput = {
    id?: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string | null;
    status?: $Enums.PostStatus;
    showOnLanding?: boolean;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutPostsInput;
};
export type PostUncheckedCreateInput = {
    id?: string;
    authorId: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string | null;
    status?: $Enums.PostStatus;
    showOnLanding?: boolean;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutPostsNestedInput;
};
export type PostUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostCreateManyInput = {
    id?: string;
    authorId: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string | null;
    status?: $Enums.PostStatus;
    showOnLanding?: boolean;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostListRelationFilter = {
    every?: Prisma.PostWhereInput;
    some?: Prisma.PostWhereInput;
    none?: Prisma.PostWhereInput;
};
export type PostOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PostCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    excerpt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    showOnLanding?: Prisma.SortOrder;
    publishedAt?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDescription?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type PostMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    excerpt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    showOnLanding?: Prisma.SortOrder;
    publishedAt?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDescription?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type PostMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    thumbnailUrl?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    excerpt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    showOnLanding?: Prisma.SortOrder;
    publishedAt?: Prisma.SortOrder;
    seoTitle?: Prisma.SortOrder;
    seoDescription?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type PostCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.PostCreateWithoutAuthorInput, Prisma.PostUncheckedCreateWithoutAuthorInput> | Prisma.PostCreateWithoutAuthorInput[] | Prisma.PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCreateOrConnectWithoutAuthorInput | Prisma.PostCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.PostCreateManyAuthorInputEnvelope;
    connect?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
};
export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.PostCreateWithoutAuthorInput, Prisma.PostUncheckedCreateWithoutAuthorInput> | Prisma.PostCreateWithoutAuthorInput[] | Prisma.PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCreateOrConnectWithoutAuthorInput | Prisma.PostCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.PostCreateManyAuthorInputEnvelope;
    connect?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
};
export type PostUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.PostCreateWithoutAuthorInput, Prisma.PostUncheckedCreateWithoutAuthorInput> | Prisma.PostCreateWithoutAuthorInput[] | Prisma.PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCreateOrConnectWithoutAuthorInput | Prisma.PostCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.PostUpsertWithWhereUniqueWithoutAuthorInput | Prisma.PostUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.PostCreateManyAuthorInputEnvelope;
    set?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    disconnect?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    delete?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    connect?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    update?: Prisma.PostUpdateWithWhereUniqueWithoutAuthorInput | Prisma.PostUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.PostUpdateManyWithWhereWithoutAuthorInput | Prisma.PostUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.PostScalarWhereInput | Prisma.PostScalarWhereInput[];
};
export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.PostCreateWithoutAuthorInput, Prisma.PostUncheckedCreateWithoutAuthorInput> | Prisma.PostCreateWithoutAuthorInput[] | Prisma.PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.PostCreateOrConnectWithoutAuthorInput | Prisma.PostCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.PostUpsertWithWhereUniqueWithoutAuthorInput | Prisma.PostUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.PostCreateManyAuthorInputEnvelope;
    set?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    disconnect?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    delete?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    connect?: Prisma.PostWhereUniqueInput | Prisma.PostWhereUniqueInput[];
    update?: Prisma.PostUpdateWithWhereUniqueWithoutAuthorInput | Prisma.PostUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.PostUpdateManyWithWhereWithoutAuthorInput | Prisma.PostUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.PostScalarWhereInput | Prisma.PostScalarWhereInput[];
};
export type EnumPostStatusFieldUpdateOperationsInput = {
    set?: $Enums.PostStatus;
};
export type PostCreateWithoutAuthorInput = {
    id?: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string | null;
    status?: $Enums.PostStatus;
    showOnLanding?: boolean;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostUncheckedCreateWithoutAuthorInput = {
    id?: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string | null;
    status?: $Enums.PostStatus;
    showOnLanding?: boolean;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostCreateOrConnectWithoutAuthorInput = {
    where: Prisma.PostWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostCreateWithoutAuthorInput, Prisma.PostUncheckedCreateWithoutAuthorInput>;
};
export type PostCreateManyAuthorInputEnvelope = {
    data: Prisma.PostCreateManyAuthorInput | Prisma.PostCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.PostWhereUniqueInput;
    update: Prisma.XOR<Prisma.PostUpdateWithoutAuthorInput, Prisma.PostUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.PostCreateWithoutAuthorInput, Prisma.PostUncheckedCreateWithoutAuthorInput>;
};
export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.XOR<Prisma.PostUpdateWithoutAuthorInput, Prisma.PostUncheckedUpdateWithoutAuthorInput>;
};
export type PostUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.PostScalarWhereInput;
    data: Prisma.XOR<Prisma.PostUpdateManyMutationInput, Prisma.PostUncheckedUpdateManyWithoutAuthorInput>;
};
export type PostScalarWhereInput = {
    AND?: Prisma.PostScalarWhereInput | Prisma.PostScalarWhereInput[];
    OR?: Prisma.PostScalarWhereInput[];
    NOT?: Prisma.PostScalarWhereInput | Prisma.PostScalarWhereInput[];
    id?: Prisma.UuidFilter<"Post"> | string;
    authorId?: Prisma.UuidFilter<"Post"> | string;
    title?: Prisma.StringFilter<"Post"> | string;
    slug?: Prisma.StringFilter<"Post"> | string;
    thumbnailUrl?: Prisma.StringNullableFilter<"Post"> | string | null;
    content?: Prisma.StringFilter<"Post"> | string;
    excerpt?: Prisma.StringNullableFilter<"Post"> | string | null;
    status?: Prisma.EnumPostStatusFilter<"Post"> | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFilter<"Post"> | boolean;
    publishedAt?: Prisma.DateTimeNullableFilter<"Post"> | Date | string | null;
    seoTitle?: Prisma.StringNullableFilter<"Post"> | string | null;
    seoDescription?: Prisma.StringNullableFilter<"Post"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Post"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Post"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Post"> | Date | string | null;
};
export type PostCreateManyAuthorInput = {
    id?: string;
    title: string;
    slug: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string | null;
    status?: $Enums.PostStatus;
    showOnLanding?: boolean;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type PostUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    thumbnailUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    excerpt?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumPostStatusFieldUpdateOperationsInput | $Enums.PostStatus;
    showOnLanding?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    publishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seoTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    seoDescription?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PostSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    authorId?: boolean;
    title?: boolean;
    slug?: boolean;
    thumbnailUrl?: boolean;
    content?: boolean;
    excerpt?: boolean;
    status?: boolean;
    showOnLanding?: boolean;
    publishedAt?: boolean;
    seoTitle?: boolean;
    seoDescription?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["post"]>;
export type PostSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    authorId?: boolean;
    title?: boolean;
    slug?: boolean;
    thumbnailUrl?: boolean;
    content?: boolean;
    excerpt?: boolean;
    status?: boolean;
    showOnLanding?: boolean;
    publishedAt?: boolean;
    seoTitle?: boolean;
    seoDescription?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["post"]>;
export type PostSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    authorId?: boolean;
    title?: boolean;
    slug?: boolean;
    thumbnailUrl?: boolean;
    content?: boolean;
    excerpt?: boolean;
    status?: boolean;
    showOnLanding?: boolean;
    publishedAt?: boolean;
    seoTitle?: boolean;
    seoDescription?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["post"]>;
export type PostSelectScalar = {
    id?: boolean;
    authorId?: boolean;
    title?: boolean;
    slug?: boolean;
    thumbnailUrl?: boolean;
    content?: boolean;
    excerpt?: boolean;
    status?: boolean;
    showOnLanding?: boolean;
    publishedAt?: boolean;
    seoTitle?: boolean;
    seoDescription?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type PostOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "authorId" | "title" | "slug" | "thumbnailUrl" | "content" | "excerpt" | "status" | "showOnLanding" | "publishedAt" | "seoTitle" | "seoDescription" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["post"]>;
export type PostInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PostIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PostIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PostPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Post";
    objects: {
        author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        authorId: string;
        title: string;
        slug: string;
        thumbnailUrl: string | null;
        content: string;
        excerpt: string | null;
        status: $Enums.PostStatus;
        showOnLanding: boolean;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["post"]>;
    composites: {};
};
export type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PostPayload, S>;
export type PostCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PostCountAggregateInputType | true;
};
export interface PostDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Post'];
        meta: {
            name: 'Post';
        };
    };
    findUnique<T extends PostFindUniqueArgs>(args: Prisma.SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PostFindFirstArgs>(args?: Prisma.SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PostFindManyArgs>(args?: Prisma.SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PostCreateArgs>(args: Prisma.SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PostCreateManyArgs>(args?: Prisma.SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PostDeleteArgs>(args: Prisma.SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PostUpdateArgs>(args: Prisma.SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PostDeleteManyArgs>(args?: Prisma.SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PostUpdateManyArgs>(args: Prisma.SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PostUpsertArgs>(args: Prisma.SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PostCountArgs>(args?: Prisma.Subset<T, PostCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PostCountAggregateOutputType> : number>;
    aggregate<T extends PostAggregateArgs>(args: Prisma.Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>;
    groupBy<T extends PostGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PostGroupByArgs['orderBy'];
    } : {
        orderBy?: PostGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PostFieldRefs;
}
export interface Prisma__PostClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PostFieldRefs {
    readonly id: Prisma.FieldRef<"Post", 'String'>;
    readonly authorId: Prisma.FieldRef<"Post", 'String'>;
    readonly title: Prisma.FieldRef<"Post", 'String'>;
    readonly slug: Prisma.FieldRef<"Post", 'String'>;
    readonly thumbnailUrl: Prisma.FieldRef<"Post", 'String'>;
    readonly content: Prisma.FieldRef<"Post", 'String'>;
    readonly excerpt: Prisma.FieldRef<"Post", 'String'>;
    readonly status: Prisma.FieldRef<"Post", 'PostStatus'>;
    readonly showOnLanding: Prisma.FieldRef<"Post", 'Boolean'>;
    readonly publishedAt: Prisma.FieldRef<"Post", 'DateTime'>;
    readonly seoTitle: Prisma.FieldRef<"Post", 'String'>;
    readonly seoDescription: Prisma.FieldRef<"Post", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Post", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Post", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Post", 'DateTime'>;
}
export type PostFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where: Prisma.PostWhereUniqueInput;
};
export type PostFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where: Prisma.PostWhereUniqueInput;
};
export type PostFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    cursor?: Prisma.PostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostScalarFieldEnum | Prisma.PostScalarFieldEnum[];
};
export type PostFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    cursor?: Prisma.PostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostScalarFieldEnum | Prisma.PostScalarFieldEnum[];
};
export type PostFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    cursor?: Prisma.PostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PostScalarFieldEnum | Prisma.PostScalarFieldEnum[];
};
export type PostCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostCreateInput, Prisma.PostUncheckedCreateInput>;
};
export type PostCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PostCreateManyInput | Prisma.PostCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PostCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    data: Prisma.PostCreateManyInput | Prisma.PostCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PostIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PostUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostUpdateInput, Prisma.PostUncheckedUpdateInput>;
    where: Prisma.PostWhereUniqueInput;
};
export type PostUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PostUpdateManyMutationInput, Prisma.PostUncheckedUpdateManyInput>;
    where?: Prisma.PostWhereInput;
    limit?: number;
};
export type PostUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PostUpdateManyMutationInput, Prisma.PostUncheckedUpdateManyInput>;
    where?: Prisma.PostWhereInput;
    limit?: number;
    include?: Prisma.PostIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PostUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where: Prisma.PostWhereUniqueInput;
    create: Prisma.XOR<Prisma.PostCreateInput, Prisma.PostUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PostUpdateInput, Prisma.PostUncheckedUpdateInput>;
};
export type PostDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
    where: Prisma.PostWhereUniqueInput;
};
export type PostDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PostWhereInput;
    limit?: number;
};
export type PostDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PostSelect<ExtArgs> | null;
    omit?: Prisma.PostOmit<ExtArgs> | null;
    include?: Prisma.PostInclude<ExtArgs> | null;
};
