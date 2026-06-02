// Simple in-memory per-IP daily rate limiter.
// NOTE: state is per-process — on serverless it resets per cold start / instance.
// Swap for Upstash/Redis or Vercel KV before relying on this at scale.

type Bucket = { day: string; count: number };

const buckets = new Map<string, Bucket>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  limit: number;
}

export function checkRateLimit(key: string, limit = 3): RateLimitResult {
  const day = today();
  const bucket = buckets.get(key);

  if (!bucket || bucket.day !== day) {
    buckets.set(key, { day, count: 1 });
    return { ok: true, remaining: limit - 1, limit };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, limit };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, limit };
}
