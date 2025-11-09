import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { createResponse } from "../utils/response";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    return res
      .status(201)
      .json(createResponse({ message: "User registered successfully", object: user }));
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(
      createResponse({
        message: "Login successful",
        object: result,
      })
    );
  } catch (error) {
    return next(error);
  }
};

