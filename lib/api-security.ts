import { env } from "cloudflare:workers";

type SecurityEnv = { PUBLIC_APP_ORIGIN?: string };

function allowedOrigins() {
  const origins = new Set(["http://localhost:3000", "http://127.0.0.1:3000"]);
  const configured = (env as unknown as SecurityEnv).PUBLIC_APP_ORIGIN;
  if (configured) {
    try {
      origins.add(new URL(configured).origin);
    } catch {
      console.error("PUBLIC_APP_ORIGIN is not a valid URL");
    }
  }
  return origins;
}

export function requestOriginAllowed(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || allowedOrigins().has(origin);
}

export function apiHeaders(request: Request, methods = "GET, POST, OPTIONS") {
  const origin = request.headers.get("origin");
  const headers = new Headers({
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    vary: "Origin",
  });
  if (origin && allowedOrigins().has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-methods", methods);
    headers.set("access-control-allow-headers", "content-type, x-scriptorium-key");
    headers.set("access-control-max-age", "86400");
  }
  return headers;
}

export function apiJson(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: apiHeaders(request) });
}

export async function readLimitedJson<T>(request: Request, limit = 16_384): Promise<T> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new Error("JSON_REQUIRED");
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > limit) throw new Error("BODY_TOO_LARGE");
  const text = await request.text();
  if (text.length > limit) throw new Error("BODY_TOO_LARGE");
  return JSON.parse(text) as T;
}

export async function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  let difference = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return difference === 0;
}

export function preflight(request: Request) {
  if (!requestOriginAllowed(request)) return apiJson(request, { error: "Origin not allowed" }, 403);
  return new Response(null, { status: 204, headers: apiHeaders(request) });
}
