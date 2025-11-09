"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCache = void 0;
class InMemoryCache {
    constructor(defaultTtlMs) {
        this.defaultTtlMs = defaultTtlMs;
        this.store = new Map();
    }
    set(key, value, ttlMs) {
        const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
        this.store.set(key, { value, expiresAt });
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry) {
            return undefined;
        }
        if (entry.expiresAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }
        return entry.value;
    }
    delete(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
    clearByPrefix(prefix) {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }
}
exports.InMemoryCache = InMemoryCache;
//# sourceMappingURL=cache.js.map