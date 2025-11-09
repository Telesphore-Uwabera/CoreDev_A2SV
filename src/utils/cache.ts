type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class InMemoryCache<TValue = unknown> {
  private store = new Map<string, CacheEntry<TValue>>();

  constructor(private readonly defaultTtlMs: number) {}

  set(key: string, value: TValue, ttlMs?: number) {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
  }

  get(key: string): TValue | undefined {
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

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  clearByPrefix(prefix: string) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }
}

