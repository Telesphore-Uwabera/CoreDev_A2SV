"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.userRepository = {
    create: (data) => prisma_1.prisma.user.create({ data }),
    findByEmail: (email) => prisma_1.prisma.user.findUnique({
        where: { email },
    }),
    findByUsername: (username) => prisma_1.prisma.user.findUnique({
        where: { username },
    }),
    findById: (id) => prisma_1.prisma.user.findUnique({
        where: { id },
    }),
};
//# sourceMappingURL=user.repository.js.map