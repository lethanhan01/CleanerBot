import assert from "node:assert/strict";
import test from "node:test";

import { IDSAlgorithm } from "../js/algorithms/ids.js";
import { Environment } from "../js/environment.js";

function createState({
  gridSizeX = 6,
  gridSizeY = 6,
  robot = { x: 0, y: 0, battery: 100, capacity: 0, maxCapacity: 5 },
  trashPositions = [],
  obstaclePositions = [],
  chargingStation = { x: 0, y: 0 },
  trashCan = { x: gridSizeX - 1, y: gridSizeY - 1 },
} = {}) {
  return {
    robot: { ...robot },
    map: {
      grid_size_x: gridSizeX,
      grid_size_y: gridSizeY,
      start_x: robot.x,
      start_y: robot.y,
      trashPositions: trashPositions.map((position) => ({ ...position })),
      obstaclePositions: obstaclePositions.map((position) => ({ ...position })),
      chargingStation: { ...chargingStation },
      trashCan: { ...trashCan },
      done: false,
    },
    config: { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
    steps: 0,
    latestAction: null,
    latestLog: "Test state.",
  };
}

test("IDS finds a shortest path by increasing the depth limit", () => {
  const algorithm = new IDSAlgorithm();
  const state = createState({
    obstaclePositions: [{ x: 1, y: 0 }],
  });

  const path = algorithm.findPath(state, { x: 0, y: 0 }, { x: 2, y: 0 });

  assert.deepEqual(path, [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 0 },
  ]);
});

test("IDS chooses the nearest battery-safe trash by path depth", () => {
  const algorithm = new IDSAlgorithm();
  const state = createState({
    trashPositions: [
      { x: 4, y: 0 },
      { x: 0, y: 2 },
    ],
  });

  const result = algorithm.findNearestSafeTrashTarget(state);

  assert.deepEqual(result.target, { x: 0, y: 2 });
  assert.equal(result.route.length - 1, 2);
});

test("IDS completes a simple cleaning task and returns to charging", () => {
  const environment = new Environment();
  environment.loadState(
    createState({
      trashPositions: [{ x: 1, y: 0 }],
    })
  );
  const algorithm = new IDSAlgorithm();

  for (let tick = 0; tick < 100 && !environment.getState().map.done; tick += 1) {
    environment.applyAction(algorithm.nextAction(environment.getState()));
  }

  const finalState = environment.getState();
  assert.equal(finalState.map.done, true);
  assert.equal(finalState.map.trashPositions.length, 0);
  assert.equal(finalState.robot.capacity, 0);
  assert.deepEqual(
    { x: finalState.robot.x, y: finalState.robot.y },
    finalState.map.chargingStation
  );
});
