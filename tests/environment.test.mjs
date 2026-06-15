import assert from "node:assert/strict";
import test from "node:test";

import { Environment, samePosition } from "../js/environment.js";
import { ACTIONS } from "../js/models.js";

test("Environment defaults match the initial UI configuration", () => {
  const state = new Environment().getState();

  assert.equal(state.map.grid_size_x, 8);
  assert.equal(state.map.grid_size_y, 8);
  assert.equal(state.map.trashPositions.length, 4);
  assert.equal(state.map.obstaclePositions.length, 5);
});

test("Environment can spawn random trash on an available cell", () => {
  const environment = new Environment({
    gridSizeX: 4,
    gridSizeY: 4,
    trashCount: 0,
    obstacleCount: 0,
  });

  environment.loadState({
    robot: { x: 0, y: 0, battery: 100, capacity: 0, maxCapacity: 5 },
    map: {
      grid_size_x: 4,
      grid_size_y: 4,
      start_x: 0,
      start_y: 0,
      trashPositions: [],
      obstaclePositions: [],
      chargingStation: { x: 1, y: 0 },
      trashCan: { x: 3, y: 3 },
      done: false,
    },
    config: { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
  });

  const state = environment.spawnRandomTrash();

  assert.equal(state.map.trashPositions.length, 1);
  assert.equal(samePosition(state.map.trashPositions[0], state.robot), false);
  assert.equal(samePosition(state.map.trashPositions[0], state.map.chargingStation), false);
  assert.equal(samePosition(state.map.trashPositions[0], state.map.trashCan), false);
  assert.match(state.latestLog, /Spawned random trash/);
});

test("Environment allows paused map edits for charger, obstacle, and trash can", () => {
  const environment = new Environment({
    gridSizeX: 5,
    gridSizeY: 5,
    trashCount: 0,
    obstacleCount: 0,
  });

  environment.loadState({
    robot: { x: 0, y: 0, battery: 100, capacity: 0, maxCapacity: 5 },
    map: {
      grid_size_x: 5,
      grid_size_y: 5,
      start_x: 0,
      start_y: 0,
      trashPositions: [],
      obstaclePositions: [],
      chargingStation: { x: 0, y: 0 },
      trashCan: { x: 4, y: 4 },
      done: false,
    },
    config: { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
  });

  let state = environment.applyMapEdit("charger", 1, 1);
  assert.deepEqual(state.map.chargingStation, { x: 1, y: 1 });

  state = environment.applyMapEdit("obstacle", 2, 2);
  assert.equal(state.map.obstaclePositions.some((position) => samePosition(position, { x: 2, y: 2 })), true);

  state = environment.applyMapEdit("trash_can", 3, 3);
  assert.deepEqual(state.map.trashCan, { x: 3, y: 3 });
});

test("generated maps keep every walkable cell connected and reserve station cells", () => {
  for (let sample = 0; sample < 25; sample += 1) {
    const environment = new Environment({
      gridSizeX: 12,
      gridSizeY: 12,
      trashCount: 10,
      obstacleCount: 30,
    });
    const state = environment.getState();
    const reachable = environment.getReachablePositions(
      state.map.chargingStation,
      state.map.obstaclePositions,
      state.map.grid_size_x,
      state.map.grid_size_y
    );

    assert.equal(
      reachable.length,
      state.map.grid_size_x * state.map.grid_size_y -
        state.map.obstaclePositions.length
    );
    assert.equal(
      state.map.obstaclePositions.some((position) =>
        samePosition(position, state.map.chargingStation)
      ),
      false
    );
    assert.equal(
      state.map.obstaclePositions.some((position) =>
        samePosition(position, state.map.trashCan)
      ),
      false
    );
  }
});

test("Environment rejects invalid movement without consuming battery or steps", () => {
  const environment = new Environment({
    gridSizeX: 4,
    gridSizeY: 4,
    trashCount: 0,
    obstacleCount: 0,
  });

  const before = environment.getState();
  const after = environment.applyAction(ACTIONS.LEFT);

  assert.equal(after.robot.x, before.robot.x);
  assert.equal(after.robot.y, before.robot.y);
  assert.equal(after.robot.battery, before.robot.battery);
  assert.equal(after.steps, before.steps);
  assert.match(after.latestLog, /outside map/);
});

test("Environment applies the collect, empty, and charge rules", () => {
  const environment = new Environment();
  environment.loadState({
    robot: { x: 1, y: 0, battery: 3, capacity: 0, maxCapacity: 1 },
    map: {
      grid_size_x: 4,
      grid_size_y: 4,
      start_x: 0,
      start_y: 0,
      trashPositions: [{ x: 1, y: 0 }],
      obstaclePositions: [],
      chargingStation: { x: 0, y: 0 },
      trashCan: { x: 2, y: 0 },
      done: false,
    },
    config: { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
  });

  let state = environment.applyAction(ACTIONS.SUCK_TRASH);
  assert.equal(state.robot.capacity, 1);
  assert.equal(state.map.trashPositions.length, 0);
  assert.equal(state.robot.battery, 2);

  state = environment.applyAction(ACTIONS.RIGHT);
  state = environment.applyAction(ACTIONS.LET_TRASH_OUT);
  assert.equal(state.robot.capacity, 0);
  assert.equal(state.robot.battery, 0);

  environment.applyAction(ACTIONS.LEFT);
  assert.equal(environment.getState().robot.x, 2);

  environment.loadState({
    robot: { x: 0, y: 0, battery: 0, capacity: 0, maxCapacity: 1 },
    map: {
      grid_size_x: 4,
      grid_size_y: 4,
      start_x: 0,
      start_y: 0,
      trashPositions: [{ x: 3, y: 3 }],
      obstaclePositions: [],
      chargingStation: { x: 0, y: 0 },
      trashCan: { x: 2, y: 0 },
      done: false,
    },
    config: { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
  });
  state = environment.applyAction(ACTIONS.CHARGE);
  assert.equal(state.robot.battery, 100);
});
