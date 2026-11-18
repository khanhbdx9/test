import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ThemeModel = runtime.Types.Result.DefaultSelection<Prisma.$ThemePayload>;
export type AggregateTheme = {
    _count: ThemeCountAggregateOutputType | null;
    _min: ThemeMinAggregateOutputType | null;
    _max: ThemeMaxAggregateOutputType | null;
};
export type ThemeMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    code: string | null;
    description: string | null;
    previewUrl: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ThemeMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    code: string | null;
    description: string | null;
    previewUrl: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ThemeCountAggregateOutputType = {
    id: number;
    name: number;
    code: number;
    description: number;
    config: number;
    previewUrl: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ThemeMinAggregateInputType = {
    id?: true;
    name?: true;
    code?: true;
    description?: true;
    previewUrl?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ThemeMaxAggregateInputType = {
    id?: true;
    name?: true;
    code?: true;
    description?: true;
    previewUrl?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ThemeCountAggregateInputType = {
    id?: true;
    name?: true;
    code?: true;
    description?: true;
    config?: true;
    previewUrl?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ThemeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ThemeWhereInput;
    orderBy?: Prisma.ThemeOrderByWithRelationInput | Prisma.ThemeOrderByWithRelationInput[];
    cursor?: Prisma.ThemeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ThemeCountAggregateInputType;
    _min?: ThemeMinAggregateInputType;
    _max?: ThemeMaxAggregateInputType;
};
export type GetThemeAggregateType<T extends ThemeAggregateArgs> = {
    [P in keyof T & keyof AggregateTheme]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTheme[P]> : Prisma.GetScalarType<T[P], AggregateTheme[P]>;
};
export type ThemeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ThemeWhereInput;
    orderBy?: Prisma.ThemeOrderByWithAggregationInput | Prisma.ThemeOrderByWithAggregationInput[];
    by: Prisma.ThemeScalarFieldEnum[] | Prisma.ThemeScalarFieldEnum;
    having?: Prisma.ThemeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ThemeCountAggregateInputType | true;
    _min?: ThemeMinAggregateInputType;
    _max?: ThemeMaxAggregateInputType;
};
export type ThemeGroupByOutputType = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    config: runtime.JsonValue;
    previewUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: ThemeCountAggregateOutputType | null;
    _min: ThemeMinAggregateOutputType | null;
    _max: ThemeMaxAggregateOutputType | null;
};
export type GetThemeGroupByPayload<T extends ThemeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ThemeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ThemeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ThemeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ThemeGroupByOutputType[P]>;
}>>;
export type ThemeWhereInput = {
    AND?: Prisma.ThemeWhereInput | Prisma.ThemeWhereInput[];
    OR?: Prisma.ThemeWhereInput[];
    NOT?: Prisma.ThemeWhereInput | Prisma.ThemeWhereInput[];
    id?: Prisma.UuidFilter<"Theme"> | string;
    name?: Prisma.StringFilter<"Theme"> | string;
    code?: Prisma.StringFilter<"Theme"> | string;
    description?: Prisma.StringNullableFilter<"Theme"> | string | null;
    config?: Prisma.JsonFilter<"Theme">;
    previewUrl?: Prisma.StringNullableFilter<"Theme"> | string | null;
    isActive?: Prisma.BoolFilter<"Theme"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Theme"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Theme"> | Date | string;
};
export type ThemeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    config?: Prisma.SortOrder;
    previewUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ThemeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.ThemeWhereInput | Prisma.ThemeWhereInput[];
    OR?: Prisma.ThemeWhereInput[];
    NOT?: Prisma.ThemeWhereInput | Prisma.ThemeWhereInput[];
    name?: Prisma.StringFilter<"Theme"> | string;
    description?: Prisma.StringNullableFilter<"Theme"> | string | null;
    config?: Prisma.JsonFilter<"Theme">;
    previewUrl?: Prisma.StringNullableFilter<"Theme"> | string | null;
    isActive?: Prisma.BoolFilter<"Theme"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Theme"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Theme"> | Date | string;
}, "id" | "code">;
export type ThemeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    config?: Prisma.SortOrder;
    previewUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ThemeCountOrderByAggregateInput;
    _max?: Prisma.ThemeMaxOrderByAggregateInput;
    _min?: Prisma.ThemeMinOrderByAggregateInput;
};
export type ThemeScalarWhereWithAggregatesInput = {
    AND?: Prisma.ThemeScalarWhereWithAggregatesInput | Prisma.ThemeScalarWhereWithAggregatesInput[];
    OR?: Prisma.ThemeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ThemeScalarWhereWithAggregatesInput | Prisma.ThemeScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Theme"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Theme"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Theme"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Theme"> | string | null;
    config?: Prisma.JsonWithAggregatesFilter<"Theme">;
    previewUrl?: Prisma.StringNullableWithAggregatesFilter<"Theme"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"Theme"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Theme"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Theme"> | Date | string;
};
export type ThemeCreateInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    config: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ThemeUncheckedCreateInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    config: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ThemeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ThemeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ThemeCreateManyInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    config: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ThemeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ThemeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    config?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    previewUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ThemeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    config?: Prisma.SortOrder;
    previewUrl?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ThemeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    previewUrl?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ThemeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    previewUrl?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ThemeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    config?: boolean;
    previewUrl?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["theme"]>;
export type ThemeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    config?: boolean;
    previewUrl?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["theme"]>;
export type ThemeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    config?: boolean;
    previewUrl?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["theme"]>;
export type ThemeSelectScalar = {
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    config?: boolean;
    previewUrl?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ThemeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "code" | "description" | "config" | "previewUrl" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["theme"]>;
export type $ThemePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Theme";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        config: runtime.JsonValue;
        previewUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["theme"]>;
    composites: {};
};
export type ThemeGetPayload<S extends boolean | null | undefined | ThemeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ThemePayload, S>;
export type ThemeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ThemeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ThemeCountAggregateInputType | true;
};
export interface ThemeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Theme'];
        meta: {
            name: 'Theme';
        };
    };
    findUnique<T extends ThemeFindUniqueArgs>(args: Prisma.SelectSubset<T, ThemeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ThemeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ThemeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ThemeFindFirstArgs>(args?: Prisma.SelectSubset<T, ThemeFindFirstArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ThemeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ThemeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ThemeFindManyArgs>(args?: Prisma.SelectSubset<T, ThemeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ThemeCreateArgs>(args: Prisma.SelectSubset<T, ThemeCreateArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ThemeCreateManyArgs>(args?: Prisma.SelectSubset<T, ThemeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ThemeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ThemeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ThemeDeleteArgs>(args: Prisma.SelectSubset<T, ThemeDeleteArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ThemeUpdateArgs>(args: Prisma.SelectSubset<T, ThemeUpdateArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ThemeDeleteManyArgs>(args?: Prisma.SelectSubset<T, ThemeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ThemeUpdateManyArgs>(args: Prisma.SelectSubset<T, ThemeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ThemeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ThemeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ThemeUpsertArgs>(args: Prisma.SelectSubset<T, ThemeUpsertArgs<ExtArgs>>): Prisma.Prisma__ThemeClient<runtime.Types.Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ThemeCountArgs>(args?: Prisma.Subset<T, ThemeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ThemeCountAggregateOutputType> : number>;
    aggregate<T extends ThemeAggregateArgs>(args: Prisma.Subset<T, ThemeAggregateArgs>): Prisma.PrismaPromise<GetThemeAggregateType<T>>;
    groupBy<T extends ThemeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ThemeGroupByArgs['orderBy'];
    } : {
        orderBy?: ThemeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ThemeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThemeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ThemeFieldRefs;
}
export interface Prisma__ThemeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ThemeFieldRefs {
    readonly id: Prisma.FieldRef<"Theme", 'String'>;
    readonly name: Prisma.FieldRef<"Theme", 'String'>;
    readonly code: Prisma.FieldRef<"Theme", 'String'>;
    readonly description: Prisma.FieldRef<"Theme", 'String'>;
    readonly config: Prisma.FieldRef<"Theme", 'Json'>;
    readonly previewUrl: Prisma.FieldRef<"Theme", 'String'>;
    readonly isActive: Prisma.FieldRef<"Theme", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Theme", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Theme", 'DateTime'>;
}
export type ThemeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where: Prisma.ThemeWhereUniqueInput;
};
export type ThemeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where: Prisma.ThemeWhereUniqueInput;
};
export type ThemeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where?: Prisma.ThemeWhereInput;
    orderBy?: Prisma.ThemeOrderByWithRelationInput | Prisma.ThemeOrderByWithRelationInput[];
    cursor?: Prisma.ThemeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ThemeScalarFieldEnum | Prisma.ThemeScalarFieldEnum[];
};
export type ThemeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where?: Prisma.ThemeWhereInput;
    orderBy?: Prisma.ThemeOrderByWithRelationInput | Prisma.ThemeOrderByWithRelationInput[];
    cursor?: Prisma.ThemeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ThemeScalarFieldEnum | Prisma.ThemeScalarFieldEnum[];
};
export type ThemeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where?: Prisma.ThemeWhereInput;
    orderBy?: Prisma.ThemeOrderByWithRelationInput | Prisma.ThemeOrderByWithRelationInput[];
    cursor?: Prisma.ThemeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ThemeScalarFieldEnum | Prisma.ThemeScalarFieldEnum[];
};
export type ThemeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ThemeCreateInput, Prisma.ThemeUncheckedCreateInput>;
};
export type ThemeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ThemeCreateManyInput | Prisma.ThemeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ThemeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    data: Prisma.ThemeCreateManyInput | Prisma.ThemeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ThemeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ThemeUpdateInput, Prisma.ThemeUncheckedUpdateInput>;
    where: Prisma.ThemeWhereUniqueInput;
};
export type ThemeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ThemeUpdateManyMutationInput, Prisma.ThemeUncheckedUpdateManyInput>;
    where?: Prisma.ThemeWhereInput;
    limit?: number;
};
export type ThemeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ThemeUpdateManyMutationInput, Prisma.ThemeUncheckedUpdateManyInput>;
    where?: Prisma.ThemeWhereInput;
    limit?: number;
};
export type ThemeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where: Prisma.ThemeWhereUniqueInput;
    create: Prisma.XOR<Prisma.ThemeCreateInput, Prisma.ThemeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ThemeUpdateInput, Prisma.ThemeUncheckedUpdateInput>;
};
export type ThemeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
    where: Prisma.ThemeWhereUniqueInput;
};
export type ThemeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ThemeWhereInput;
    limit?: number;
};
export type ThemeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ThemeSelect<ExtArgs> | null;
    omit?: Prisma.ThemeOmit<ExtArgs> | null;
};
