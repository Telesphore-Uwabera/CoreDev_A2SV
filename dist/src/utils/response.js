"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = exports.createResponse = void 0;
const createResponse = (params = {}) => ({
    Success: params.success ?? true,
    Message: params.message ?? "",
    Object: params.object ?? null,
    Errors: params.errors ?? null,
});
exports.createResponse = createResponse;
const createPaginatedResponse = (data) => ({
    Success: true,
    Message: data.message ?? "",
    Object: data.items,
    PageNumber: data.pageNumber,
    PageSize: data.pageSize,
    TotalSize: data.totalSize,
    Errors: null,
    currentPage: data.pageNumber,
    pageSize: data.pageSize,
    totalPages: data.totalSize === 0
        ? 0
        : Math.ceil(data.totalSize / data.pageSize),
    totalProducts: data.totalSize,
    products: data.items,
});
exports.createPaginatedResponse = createPaginatedResponse;
//# sourceMappingURL=response.js.map