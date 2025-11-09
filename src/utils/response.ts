export interface BaseResponse<T = unknown> {
  Success: boolean;
  Message: string;
  Object: T | null;
  Errors: string[] | null;
}

export interface PaginatedResponse<T = unknown> extends BaseResponse<T[]> {
  PageNumber: number;
  PageSize: number;
  TotalSize: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalProducts: number;
  products: T[];
}

export const createResponse = <T>(
  params: {
    success?: boolean;
    message?: string;
    object?: T | null;
    errors?: string[] | null;
  } = {}
): BaseResponse<T> => ({
  Success: params.success ?? true,
  Message: params.message ?? "",
  Object: params.object ?? null,
  Errors: params.errors ?? null,
});

export const createPaginatedResponse = <T>(
  data: {
    message?: string;
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalSize: number;
  }
): PaginatedResponse<T> => ({
  Success: true,
  Message: data.message ?? "",
  Object: data.items,
  PageNumber: data.pageNumber,
  PageSize: data.pageSize,
  TotalSize: data.totalSize,
  Errors: null,
  currentPage: data.pageNumber,
  pageSize: data.pageSize,
  totalPages:
    data.totalSize === 0
      ? 0
      : Math.ceil(data.totalSize / data.pageSize),
  totalProducts: data.totalSize,
  products: data.items,
});

