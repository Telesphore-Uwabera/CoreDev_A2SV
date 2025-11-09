import { Prisma } from "@generated/prisma/client";
import { prisma } from "../config/prisma";

export const userRepository = {
  create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  findByUsername: (username: string) =>
    prisma.user.findUnique({
      where: { username },
    }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
    }),
};

