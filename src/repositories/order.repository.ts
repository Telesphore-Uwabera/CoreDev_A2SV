import { Prisma } from "@generated/prisma/client";
import { prisma } from "../config/prisma";

type TxClient = Prisma.TransactionClient;

const getClient = (tx?: TxClient) => tx ?? prisma;

export const orderRepository = {
  create: (
    data: Prisma.OrderCreateInput,
    tx?: TxClient
  ) =>
    getClient(tx).order.create({
      data,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),

  findById: (id: string, tx?: TxClient) =>
    getClient(tx).order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),

  listByUser: (userId: string) =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
};

