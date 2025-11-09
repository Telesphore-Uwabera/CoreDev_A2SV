"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = exports.getProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const product_service_1 = require("../services/product.service");
const response_1 = require("../utils/response");
const createProduct = async (req, res, next) => {
    try {
        const product = await product_service_1.productService.create({
            ...req.body,
            createdById: req.user?.id,
        });
        return res
            .status(201)
            .json((0, response_1.createResponse)({ message: "Product created successfully", object: product }));
    }
    catch (error) {
        return next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const product = await product_service_1.productService.update(req.params.id, req.body);
        return res
            .status(200)
            .json((0, response_1.createResponse)({ message: "Product updated successfully", object: product }));
    }
    catch (error) {
        return next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        await product_service_1.productService.remove(req.params.id);
        return res
            .status(200)
            .json((0, response_1.createResponse)({ message: "Product deleted successfully", object: null }));
    }
    catch (error) {
        return next(error);
    }
};
exports.deleteProduct = deleteProduct;
const getProduct = async (req, res, next) => {
    try {
        const product = await product_service_1.productService.findById(req.params.id);
        return res.status(200).json((0, response_1.createResponse)({ object: product }));
    }
    catch (error) {
        return next(error);
    }
};
exports.getProduct = getProduct;
const listProducts = async (req, res, next) => {
    try {
        const validatedQuery = req.validated?.query ?? {};
        const page = validatedQuery.page ?? 1;
        const pageSize = validatedQuery.pageSize ?? 10;
        const search = validatedQuery.search;
        const { items, pageNumber, pageSize: size, totalSize } = await product_service_1.productService.list({
            page,
            pageSize,
            search,
        });
        return res.status(200).json((0, response_1.createPaginatedResponse)({
            message: "Products retrieved successfully",
            items,
            pageNumber,
            pageSize: size,
            totalSize,
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.listProducts = listProducts;
//# sourceMappingURL=product.controller.js.map