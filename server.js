import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MapRepository } from "./server/mapRepository.js";

const ROOT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const MAX_REQUEST_SIZE = 2 * 1024 * 1024;
const mapRepository = new MapRepository(
  path.join(ROOT_DIRECTORY, "data", "saved-maps.json")
);

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const server = http.createServer(async (request, response) => {
  try {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    const requestUrl = new URL(request.url, `http://${request.headers.host}`);

    if (requestUrl.pathname === "/api/maps") {
      await handleMapCollection(request, response);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/maps/")) {
      await handleMapEntry(request, response, requestUrl.pathname);
      return;
    }

    serveStaticFile(requestUrl.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Internal server error." });
  }
});

server.listen(PORT, () => {
  console.log(`CleanerBot is running at http://localhost:${PORT}`);
  console.log("Saved maps are stored in data/saved-maps.json");
});

async function handleMapCollection(request, response) {
  if (request.method === "GET") {
    sendJson(response, 200, { maps: mapRepository.list() });
    return;
  }

  if (request.method === "POST") {
    const body = await readJsonBody(request);
    const result = mapRepository.save(body.name, body.state);
    sendJson(response, result.overwritten ? 200 : 201, result);
    return;
  }

  sendMethodNotAllowed(response, ["GET", "POST"]);
}

async function handleMapEntry(request, response, pathname) {
  const encodedName = pathname.slice("/api/maps/".length);
  const name = decodeURIComponent(encodedName);

  if (request.method === "GET") {
    const state = mapRepository.load(name);

    if (!state) {
      sendJson(response, 404, { error: `Saved map "${name}" was not found.` });
      return;
    }

    sendJson(response, 200, { state });
    return;
  }

  if (request.method === "DELETE") {
    const removed = mapRepository.remove(name);

    if (!removed) {
      sendJson(response, 404, { error: `Saved map "${name}" was not found.` });
      return;
    }

    sendJson(response, 200, { removed: true });
    return;
  }

  sendMethodNotAllowed(response, ["GET", "DELETE"]);
}

function serveStaticFile(urlPathname, response) {
  const relativePath = urlPathname === "/" ? "index.html" : urlPathname.slice(1);
  const filePath = path.resolve(ROOT_DIRECTORY, relativePath);
  const relativeToRoot = path.relative(ROOT_DIRECTORY, filePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    sendJson(response, 403, { error: "Forbidden." });
    return;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendJson(response, 404, { error: "File not found." });
    return;
  }

  response.writeHead(200, {
    "Content-Type": MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(filePath).pipe(response);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;

      if (size > MAX_REQUEST_SIZE) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    request.on("error", reject);
  });
}

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

function sendMethodNotAllowed(response, methods) {
  response.setHeader("Allow", methods.join(", "));
  sendJson(response, 405, { error: "Method not allowed." });
}

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
}
