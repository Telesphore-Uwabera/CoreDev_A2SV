"use strict";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.DATABASE_URL = "file:./test.db";
process.env.BCRYPT_SALT_ROUNDS = "4";
process.env.CACHE_TTL_SECONDS = "1";
//# sourceMappingURL=setup.js.map