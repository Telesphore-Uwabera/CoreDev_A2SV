import { UserRole } from "@generated/prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: User;
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};

