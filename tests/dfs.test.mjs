import assert from "node:assert/strict";
import test from "node:test";

import { DFSAlgorithm } from "../js/algorithms/dfs.js";
import { Environment } from "../js/environment.js";

function createState({
  gridSizeX = 12,
  gridSizeY = 12,
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

test("DFS keeps its committed route and completes a simple cleaning task", () => {
  const environment = new Environment();
  environment.loadState(createState({ trashPositions: [{ x: 1, y: 0 }] }));
  const algorithm = new DFSAlgorithm();

  for (let tick = 0; tick < 150 && !environment.getState().map.done; tick += 1) {
    environment.applyAction(algorithm.nextAction(environment.getState()));
  }

  const finalState = environment.getState();
  assert.equal(finalState.map.done, true);
  assert.deepEqual(
    { x: finalState.robot.x, y: finalState.robot.y },
    finalState.map.chargingStation
  );
  assert.equal(finalState.robot.capacity, 0);
  assert.equal(finalState.map.trashPositions.length, 0);
});

test("DFS returns a valid path but does not guarantee the shortest path", () => {
  const algorithm = new DFSAlgorithm();
  const state = createState({ gridSizeX: 5, gridSizeY: 5 });
  const path = algorithm.findPath(state, { x: 0, y: 0 }, { x: 0, y: 2 });

  assert.deepEqual(path[0], { x: 0, y: 0 });
  assert.deepEqual(path.at(-1), { x: 0, y: 2 });
  assert.ok(path.length > 3);

  for (let index = 1; index < path.length; index += 1) {
    const distance =
      Math.abs(path[index].x - path[index - 1].x) +
      Math.abs(path[index].y - path[index - 1].y);
    assert.equal(distance, 1);
  }
});

test("DFS battery checks use the same directed route that the robot follows", () => {
  const algorithm = new DFSAlgorithm();
  const state = createState({
    gridSizeX: 5,
    gridSizeY: 5,
    robot: { x: 0, y: 0, battery: 10, capacity: 0, maxCapacity: 5 },
    trashPositions: [{ x: 0, y: 2 }],
  });

  const reversePath = algorithm.findPath(
    state,
    { x: 0, y: 2 },
    { x: 0, y: 0 }
  );
  assert.equal(reversePath.length, 3);

  const target = algorithm.findNearestSafeTrashTarget(state);
  assert.equal(target, null);
});
