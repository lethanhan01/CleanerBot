import { simulationStateToPlain } from "./models.js";

const MAX_MAP_NAME_LENGTH = 60;

export class MapStorage {
  constructor({ fetchImpl = getDefaultFetch(), baseUrl = getDefaultBaseUrl() } = {}) {
    this.fetchImpl = fetchImpl;
    this.baseUrl = baseUrl;
  }

  async list() {
    const result = await this.request(this.baseUrl);
    return Array.isArray(result.maps) ? result.maps : [];
  }

  async save(name, state) {
    const normalizedName = normalizeMapName(name);
    return this.request(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: normalizedName,
        state: simulationStateToPlain(state),
      }),
    });
  }

  async load(name) {
    const normalizedName = normalizeMapName(name);
    const result = await this.request(
      `${this.baseUrl}/${encodeURIComponent(normalizedName)}`
    );
    return result.state;
  }

  async remove(name) {
    const normalizedName = normalizeMapName(name);
    const result = await this.request(
      `${this.baseUrl}/${encodeURIComponent(normalizedName)}`,
      { method: "DELETE" }
    );
    return result.removed === true;
  }

  async request(url, options = {}) {
    if (typeof this.fetchImpl !== "function") {
      throw new Error("Map storage API is unavailable.");
    }

    let response;

    try {
      response = await this.fetchImpl(url, options);
    } catch (error) {
      const detail = error?.message ? ` (${error.message})` : "";
      throw new Error(`Cannot connect to the map storage server${detail}.`);
    }

    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error("Map storage server returned an invalid response. Run the project with npm start.");
    }

    if (!response.ok) {
      throw new Error(result.error || "Map storage request failed.");
    }

    return result;
  }
}

function getDefaultFetch() {
  return typeof globalThis.fetch === "function"
    ? globalThis.fetch.bind(globalThis)
    : undefined;
}

function getDefaultBaseUrl() {
  const location = globalThis.location;

  if (!location || location.port === "3000") {
    return "/api/maps";
  }

  return `${location.protocol}//${location.hostname}:3000/api/maps`;
}

export function normalizeMapName(name) {
  const normalizedName = `${name ?? ""}`.trim().replace(/\s+/g, " ");

  if (!normalizedName) {
    throw new Error("Enter a name for the map.");
  }

  if (normalizedName.length > MAX_MAP_NAME_LENGTH) {
    throw new Error(`Map name must be at most ${MAX_MAP_NAME_LENGTH} characters.`);
  }

  return normalizedName;
}
