import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { createResponse } from "./utils/response";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) =>
  res.status(200).json(createResponse({ message: "OK", object: { status: "healthy" } }))
);

app.use("/api", routes);

app.use((_req, res) =>
  res
    .status(404)
    .json(createResponse({ success: false, message: "Resource not found", errors: ["Not Found"] }))
);

app.use(errorHandler);

export default app;

