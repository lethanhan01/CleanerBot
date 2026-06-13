import fs from "node:fs";
import path from "node:path";

const STORAGE_VERSION = 1;
const MAX_MAP_NAME_LENGTH = 60;

export class MapRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.ensureFile();
  }

  list() {
    return this.readCollection().maps
      .map(({ name, savedAt }) => ({ name, savedAt }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  save(name, state) {
    const normalizedName = normalizeMapName(name);
    validateState(state);

    const collection = this.readCollection();
    const existingIndex = collection.maps.findIndex((entry) =>
      sameMapName(entry.name, normalizedName)
    );
    const entry = {
      name: normalizedName,
      savedAt: new Date().toISOString(),
      state: cloneJson(state),
    };

    if (existingIndex === -1) {
      collection.maps.push(entry);
    } else {
      collection.maps[existingIndex] = entry;
    }

    this.writeCollection(collection);
    return { name: normalizedName, overwritten: existingIndex !== -1 };
  }

  load(name) {
    const normalizedName = normalizeMapName(name);
    const entry = this.readCollection().maps.find((candidate) =>
      sameMapName(candidate.name, normalizedName)
    );

    if (!entry) {
      return null;
    }

    return cloneJson(entry.state);
  }

  remove(name) {
    const normalizedName = normalizeMapName(name);
    const collection = this.readCollection();
    const nextMaps = collection.maps.filter((entry) =>
      !sameMapName(entry.name, normalizedName)
    );

    if (nextMaps.length === collection.maps.length) {
      return false;
    }

    collection.maps = nextMaps;
    this.writeCollection(collection);
    return true;
  }

  ensureFile() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });

    if (!fs.existsSync(this.filePath)) {
      this.writeCollection(createEmptyCollection());
    }
  }

  readCollection() {
    try {
      const value = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

      if (value?.version !== STORAGE_VERSION || !Array.isArray(value.maps)) {
        throw new Error("Invalid saved map file format.");
      }

      return {
        version: STORAGE_VERSION,
        maps: value.maps.filter(isValidStoredMap).map((entry) => cloneJson(entry)),
      };
    } catch (error) {
      throw new Error(`Cannot read saved maps: ${error.message}`);
    }
  }

  writeCollection(collection) {
    const temporaryPath = `${this.filePath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(collection, null, 2)}\n`, "utf8");
    fs.renameSync(temporaryPath, this.filePath);
  }
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

function validateState(state) {
  if (!state?.robot || !state?.map || !state?.config) {
    throw new Error("Map state is invalid.");
  }
}

function createEmptyCollection() {
  return { version: STORAGE_VERSION, maps: [] };
}

function isValidStoredMap(entry) {
  return Boolean(
    entry &&
    typeof entry.name === "string" &&
    entry.name.trim() &&
    entry.state?.robot &&
    entry.state?.map
  );
}

function sameMapName(first, second) {
  return first.localeCompare(second, undefined, { sensitivity: "accent" }) === 0;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}
