import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import { createPaginatedResponse, createResponse } from "../utils/response";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create({
      ...req.body,
      createdById: req.user?.id,
    });

    return res
      .status(201)
      .json(createResponse({ message: "Product created successfully", object: product }));
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    return res
      .status(200)
      .json(createResponse({ message: "Product updated successfully", object: product }));
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.remove(req.params.id);
    return res
      .status(200)
      .json(createResponse({ message: "Product deleted successfully", object: null }));
  } catch (error) {
    return next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.findById(req.params.id);
    return res.status(200).json(createResponse({ object: product }));
  } catch (error) {
    return next(error);
  }
};

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery =
      (req.validated?.query as { page?: number; pageSize?: number; search?: string }) ?? {};
    const page = validatedQuery.page ?? 1;
    const pageSize = validatedQuery.pageSize ?? 10;
    const search = validatedQuery.search;

    const { items, pageNumber, pageSize: size, totalSize } = await productService.list({
      page,
      pageSize,
      search,
    });

    return res.status(200).json(
      createPaginatedResponse({
        message: "Products retrieved successfully",
        items,
        pageNumber,
        pageSize: size,
        totalSize,
      })
    );
  } catch (error) {
    return next(error);
  }
};

