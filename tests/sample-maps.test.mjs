import assert from "node:assert/strict";
import test from "node:test";

import { Environment, samePosition } from "../js/environment.js";
import {
  listBuiltInSavedMaps,
  loadBuiltInSavedMap,
} from "../js/sampleMaps.js";

test("built-in saved maps expose ten valid comparison maps", () => {
  const maps = listBuiltInSavedMaps();

  assert.equal(maps.length, 10);
  assert.deepEqual(
    maps.map(({ name }) => name),
    Array.from({ length: 10 }, (_, index) => `Test ${index + 1}`)
  );

  for (const { name } of maps) {
    assertValidMapState(name, loadBuiltInSavedMap(name));
  }
});

test("loading a built-in saved map returns a fresh copy", () => {
  const firstLoad = loadBuiltInSavedMap("Test 1");
  firstLoad.map.trashPositions.length = 0;

  assert.equal(loadBuiltInSavedMap("Test 1").map.trashPositions.length, 4);
});

function assertValidMapState(name, state) {
  const { map } = state;
  const environment = new Environment();
  const positionKey = (position) => `${position.x},${position.y}`;
  const obstacles = new Set(map.obstaclePositions.map(positionKey));
  const reachablePositions = new Set(
    environment
      .getReachablePositions(
        { x: map.start_x, y: map.start_y },
        map.obstaclePositions,
        map.grid_size_x,
        map.grid_size_y
      )
      .map(positionKey)
  );

  assertInsideMap(name, map, map.chargingStation);
  assertInsideMap(name, map, map.trashCan);
  assert.equal(obstacles.has(positionKey(map.chargingStation)), false);
  assert.equal(obstacles.has(positionKey(map.trashCan)), false);

  for (const trash of map.trashPositions) {
    assertInsideMap(name, map, trash);
    assert.equal(obstacles.has(positionKey(trash)), false);
    assert.equal(samePosition(trash, map.chargingStation), false);
    assert.equal(samePosition(trash, map.trashCan), false);
  }

  for (const obstacle of map.obstaclePositions) {
    assertInsideMap(name, map, obstacle);
  }

  for (const target of [map.trashCan, ...map.trashPositions]) {
    assert.equal(
      reachablePositions.has(positionKey(target)),
      true,
      `${name} has unreachable target ${positionKey(target)}`
    );
  }
}

function assertInsideMap(name, map, position) {
  assert.equal(
    position.x >= 0 &&
      position.y >= 0 &&
      position.x < map.grid_size_x &&
      position.y < map.grid_size_y,
    true,
    `${name} has out-of-bounds position ${position.x},${position.y}`
  );
}
