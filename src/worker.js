export default {
  async fetch(request, env) {
    try {
      // 1. Path + Type Detection
      const url = new URL(request.url);
      const requestedPath = url.pathname.slice(1); // remove leading slash

      let folder = "cards_1080p"; // default folder
      let cleanedPath = requestedPath;
      let isThumbnail = false;

      if (requestedPath.startsWith("thumbs/")) {
        folder = "cards_157";
        cleanedPath = requestedPath.slice("thumbs/".length);
        isThumbnail = true;
      } else if (requestedPath.startsWith("full/")) {
        cleanedPath = requestedPath.slice("full/".length);
      }

      const imagePath = `${folder}/${cleanedPath}`;

      // 2. Rate Limiting
      const ip =
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For") ||
        request.headers.get("X-Real-IP") ||
        "unknown-ip";

      const rateLimitKey = `rate_limit:${ip}:${isThumbnail ? "thumb" : "full"}`;
      const limit = isThumbnail ? 100 : 50;
      const window = 60;
      const currentTime = Math.floor(Date.now() / 1000);

      let rateLimitData;
      try {
        rateLimitData = (await env.RATE_LIMITER.get(rateLimitKey, {
          type: "json",
        })) || {
          count: 0,
          windowStart: currentTime,
          lastRequest: 0,
        };
      } catch (e) {
        rateLimitData = { count: 0, windowStart: currentTime, lastRequest: 0 };
      }

      if (currentTime - rateLimitData.windowStart >= window) {
        rateLimitData.count = 0;
        rateLimitData.windowStart = currentTime;
      }

      const timeRemaining = window - (currentTime - rateLimitData.windowStart);
      const resetTime = rateLimitData.windowStart + window;

      if (rateLimitData.count >= limit) {
        return new Response(
          `Rate limit exceeded (${limit} requests per minute)`,
          {
            status: 429,
            headers: {
              "Content-Type": "text/plain",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Retry-After": timeRemaining.toString(),
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": resetTime.toString(),
              "X-RateLimit-Window": window.toString(),
            },
          }
        );
      }

      // 3. Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
          },
        });
      }

      // 4. Only allow GET
      if (request.method !== "GET") {
        return new Response("Method not allowed", {
          status: 405,
          headers: {
            Allow: "GET, OPTIONS",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // 5. Path Validation
      if (
        !cleanedPath ||
        cleanedPath.includes("..") ||
        cleanedPath.includes("//")
      ) {
        return new Response("Invalid path", {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }

      // 6. Caching + Fetch
      const cache = caches.default;
      const cacheKey = new Request(`${url.origin}${url.pathname}`, {
        method: "GET",
        headers: { Accept: request.headers.get("Accept") || "image/*" },
      });

      let response = await cache.match(cacheKey);

      if (!response) {
        const object = await env.card_assets.get(imagePath);

        if (!object) {
          return new Response("Image not found", {
            status: 404,
            headers: {
              "Content-Type": "text/plain",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=300",
            },
          });
        }

        const contentType =
          object.httpMetadata?.contentType ||
          getContentTypeFromPath(cleanedPath) ||
          "application/octet-stream";

        response = new Response(object.body, {
          headers: {
            "Cache-Control": "public, max-age=86400, immutable",
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            ETag: object.etag || `"${object.key}-${object.size}"`,
            "Last-Modified":
              object.uploaded?.toUTCString() || new Date().toUTCString(),
            "Content-Length": object.size?.toString() || "",
            "X-Served-By": "cloudflare-worker",
          },
        });

        await cache.put(cacheKey, response.clone());
      }

      // 7. Increment rate counter
      const newCount = rateLimitData.count + 1;
      await env.RATE_LIMITER.put(
        rateLimitKey,
        JSON.stringify({
          count: newCount,
          windowStart: rateLimitData.windowStart,
          lastRequest: currentTime,
        }),
        { expirationTtl: window * 2 }
      );

      // Add rate limit headers
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("X-RateLimit-Limit", limit.toString());
      responseHeaders.set(
        "X-RateLimit-Remaining",
        Math.max(0, limit - newCount).toString()
      );
      responseHeaders.set("X-RateLimit-Reset", resetTime.toString());
      responseHeaders.set("X-RateLimit-Window", window.toString());

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response("Internal server error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};

// Helper for content type
function getContentTypeFromPath(path) {
  const ext = path.split(".").pop()?.toLowerCase();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
  };
  return mimeTypes[ext] || null;
}
