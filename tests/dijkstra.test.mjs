import assert from "node:assert/strict";
import test from "node:test";

import { DijkstraAlgorithm } from "../js/algorithms/dijkstra.js";

function createState({
  robot = { x: 0, y: 0, battery: 100, capacity: 0, maxCapacity: 5 },
  trashPositions = [{ x: 2, y: 0 }],
  obstaclePositions = [{ x: 1, y: 0 }],
  chargingStation = { x: 0, y: 0 },
  trashCan = { x: 4, y: 4 },
  config = { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
} = {}) {
  return {
    robot: { ...robot },
    map: {
      grid_size_x: 5,
      grid_size_y: 5,
      start_x: robot.x,
      start_y: robot.y,
      trashPositions: trashPositions.map((position) => ({ ...position })),
      obstaclePositions: obstaclePositions.map((position) => ({ ...position })),
      chargingStation: { ...chargingStation },
      trashCan: { ...trashCan },
      done: false,
    },
    config: { ...config },
    steps: 0,
    latestAction: null,
    latestLog: "Test state.",
  };
}

test("Dijkstra finds a valid shortest path around an obstacle", () => {
  const algorithm = new DijkstraAlgorithm();
  const state = createState();
  const path = algorithm.findPath(state, { x: 0, y: 0 }, { x: 2, y: 0 });

  assert.deepEqual(path[0], { x: 0, y: 0 });
  assert.deepEqual(path.at(-1), { x: 2, y: 0 });
  assert.equal(path.length, 5);

  for (let index = 1; index < path.length; index += 1) {
    const distance =
      Math.abs(path[index].x - path[index - 1].x) +
      Math.abs(path[index].y - path[index - 1].y);
    assert.equal(distance, 1);
  }
});
