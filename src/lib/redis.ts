// lib/redis.ts
import { createClient } from "redis";

export const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (err) => console.error("❌ Redis error:", err));
redis.on("connect", () => console.log("✅ Redis connected"));

await redis.connect(); // top-level await 가능하거나 init 함수로 호출
