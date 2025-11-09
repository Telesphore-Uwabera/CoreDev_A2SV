import { Prisma } from "@generated/prisma/client";
import { prisma } from "../config/prisma";

export const productRepository = {
  create: (data: Prisma.ProductCreateInput) =>
    prisma.product.create({
      data,
    }),

  update: (id: string, data: Prisma.ProductUpdateInput) =>
    prisma.product.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.product.delete({
      where: { id },
    }),

  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
    }),

  list: ({
    skip,
    take,
    search,
  }: {
    skip: number;
    take: number;
    search?: string;
  }) =>
    prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      where: search
        ? {
            name: {
              contains: search,
            },
          }
        : undefined,
    }),

  count: (search?: string) =>
    prisma.product.count({
      where: search
        ? {
            name: {
              contains: search,
            },
          }
        : undefined,
    }),
};

