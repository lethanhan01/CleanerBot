import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { Environment } from "../js/environment.js";
import { simulationStateToPlain } from "../js/models.js";
import { MapRepository } from "../server/mapRepository.js";

test("MapRepository persists named maps in a JSON file", (context) => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "cleanerbot-maps-"));
  context.after(() => fs.rmSync(temporaryDirectory, { recursive: true, force: true }));

  const filePath = path.join(temporaryDirectory, "saved-maps.json");
  const repository = new MapRepository(filePath);
  const firstState = simulationStateToPlain(
    new Environment({ gridSizeX: 5, gridSizeY: 6 }).getInitialState()
  );
  const secondState = simulationStateToPlain(
    new Environment({ gridSizeX: 9, gridSizeY: 7 }).getInitialState()
  );

  assert.deepEqual(repository.list(), []);
  assert.deepEqual(repository.save("  Room   map  ", firstState), {
    name: "Room map",
    overwritten: false,
  });
  assert.equal(repository.load("ROOM MAP").map.grid_size_x, 5);

  assert.deepEqual(repository.save("room map", secondState), {
    name: "room map",
    overwritten: true,
  });
  assert.equal(repository.list().length, 1);
  assert.equal(repository.load("Room map").map.grid_size_x, 9);

  const fileContents = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert.equal(fileContents.maps.length, 1);
  assert.equal(fileContents.maps[0].state.map.grid_size_x, 9);

  assert.equal(repository.remove("Room map"), true);
  assert.deepEqual(repository.list(), []);
  assert.equal(repository.remove("Room map"), false);
});
