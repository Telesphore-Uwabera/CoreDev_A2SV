"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/* eslint-disable no-console */
exports.logger = {
    info: (message, meta) => {
        if (meta) {
            console.log(`[INFO] ${message}`, meta);
        }
        else {
            console.log(`[INFO] ${message}`);
        }
    },
    warn: (message, meta) => {
        if (meta) {
            console.warn(`[WARN] ${message}`, meta);
        }
        else {
            console.warn(`[WARN] ${message}`);
        }
    },
    error: (message, meta) => {
        if (meta) {
            console.error(`[ERROR] ${message}`, meta);
        }
        else {
            console.error(`[ERROR] ${message}`);
        }
    },
};
//# sourceMappingURL=logger.js.map