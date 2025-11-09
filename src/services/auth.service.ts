import bcrypt from "bcryptjs";
import type { StringValue } from "ms";
import { Secret, sign } from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/errors";

export const authService = {
  register: async (params: {
    username: string;
    email: string;
    password: string;
  }) => {
    const existingByEmail = await userRepository.findByEmail(params.email);
    if (existingByEmail) {
      throw new AppError("Email already registered", 400);
    }

    const existingByUsername = await userRepository.findByUsername(params.username);
    if (existingByUsername) {
      throw new AppError("Username already taken", 400);
    }

    const hashedPassword = await bcrypt.hash(params.password, env.BCRYPT_SALT_ROUNDS);

    const user = await userRepository.create({
      username: params.username,
      email: params.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  },

  login: async (params: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(params.email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(params.password, user.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      env.JWT_SECRET as Secret,
      { expiresIn: env.JWT_EXPIRES_IN as StringValue }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  },
};

