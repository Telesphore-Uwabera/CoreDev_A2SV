import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { createResponse } from "../utils/response";

interface JwtPayload {
  userId: string;
  username: string;
  role: "USER" | "ADMIN";
  email?: string;
  iat: number;
  exp: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(
          createResponse({
            success: false,
            message: "Authentication required",
            errors: ["Missing or invalid Authorization header"],
          })
        );
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (env.NODE_ENV === "test") {
      req.user = {
        id: payload.userId,
        username: payload.username,
        email: payload.email ?? `${payload.userId}@test.local`,
        role: payload.role,
      };
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) {
      return res
        .status(401)
        .json(
          createResponse({
            success: false,
            message: "Invalid token",
            errors: ["User no longer exists"],
          })
        );
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json(
        createResponse({
          success: false,
          message: "Authentication failed",
          errors: ["Invalid or expired token"],
        })
      );
  }
};

export const authorizeRoles =
  (...roles: Array<"USER" | "ADMIN">) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          createResponse({
            success: false,
            message: "Forbidden",
            errors: ["You do not have permission to perform this action"],
          })
        );
    }
    return next();
  };

