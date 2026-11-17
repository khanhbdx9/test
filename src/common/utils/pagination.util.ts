export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function buildPagination(
  page: number,
  limit: number,
  total: number,
): PaginationResult {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}
