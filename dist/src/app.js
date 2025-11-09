"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const response_1 = require("./utils/response");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => res.status(200).json((0, response_1.createResponse)({ message: "OK", object: { status: "healthy" } })));
app.use("/api", routes_1.default);
app.use((_req, res) => res
    .status(404)
    .json((0, response_1.createResponse)({ success: false, message: "Resource not found", errors: ["Not Found"] })));
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map