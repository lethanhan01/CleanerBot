export function listBuiltInSavedMaps() {
  return BUILT_IN_TEST_MAPS.map(({ name }) => ({
    name,
    savedAt: "built-in",
  }));
}

export function loadBuiltInSavedMap(name) {
  const entry = BUILT_IN_TEST_MAPS.find((map) => map.name === name);

  if (!entry) {
    throw new Error(`Built-in test map "${name}" was not found.`);
  }

  return cloneState(entry.state);
}

export function createAlgorithmComparisonMap10x10() {
  return loadBuiltInSavedMap("Test 10");
}

const BUILT_IN_TEST_MAPS = Object.freeze([
  createBuiltInMap("Test 1", {
    width: 8,
    height: 8,
    maxCapacity: 3,
    trash: ["B2", "F3", "C5", "H7"],
    obstacles: [],
    log: "Loaded Test 1: open 8x8 map.",
  }),
  createBuiltInMap("Test 2", {
    width: 8,
    height: 8,
    maxCapacity: 3,
    trash: ["H1", "G3", "A6", "D7"],
    obstacles: ["C2", "C3", "C4", "E5", "F5", "G5", "B7"],
    log: "Loaded Test 2: sparse obstacles.",
  }),
  createBuiltInMap("Test 3", {
    width: 10,
    height: 10,
    maxCapacity: 3,
    trash: ["B10", "E1", "J1", "D6", "E8", "H10"],
    obstacles: [
      "C1", "C2", "C3", "C5", "C6", "C7", "C8", "C9",
      "F2", "F3", "F4", "F5", "F7", "F8", "F9",
      "H1", "H2", "H4", "H5", "H6", "H8", "H9",
    ],
    log: "Loaded Test 3: corridor maze.",
  }),
  createBuiltInMap("Test 4", {
    width: 10,
    height: 10,
    maxCapacity: 4,
    trash: ["A8", "C10", "F1", "G7", "J3", "J9"],
    obstacles: [
      "B3", "C3", "D3", "F3", "G3", "H3", "I3",
      "B6", "C6", "D6", "E6", "G6", "H6", "I6",
      "D1", "D2", "D4", "D5", "D7", "D8", "D9",
      "H4", "H5", "H7", "H8", "H10",
    ],
    log: "Loaded Test 4: room-like barriers.",
  }),
  createBuiltInMap("Test 5", {
    width: 12,
    height: 8,
    maxCapacity: 4,
    trash: ["L1", "F4", "K4", "D6", "A8", "I8"],
    obstacles: [
      "C2", "D2", "E2", "G2", "H2", "I2", "J2",
      "C5", "D5", "E5", "F5", "G5", "I5", "J5",
      "B7", "C7", "D7", "E7", "G7", "H7", "J7", "K7",
    ],
    log: "Loaded Test 5: wide 12x8 map.",
  }),
  createBuiltInMap("Test 6", {
    width: 8,
    height: 12,
    maxCapacity: 4,
    trash: ["H1", "D4", "A5", "G8", "B11", "H11"],
    obstacles: [
      "B3", "C3", "E3", "F3", "G3",
      "B6", "C6", "D6", "E6", "G6",
      "C9", "D9", "E9", "F9", "G9",
      "F4", "F5", "F7", "F8",
    ],
    log: "Loaded Test 6: tall 8x12 map.",
  }),
  createBuiltInMap("Test 7", {
    width: 12,
    height: 12,
    maxCapacity: 5,
    trash: ["L2", "C4", "J5", "A9", "F10", "K12", "D12"],
    obstacles: [
      "B2", "C2", "D2", "E2", "G2", "H2", "I2", "J2",
      "B5", "C5", "D5", "F5", "G5", "H5", "I5",
      "D7", "E7", "F7", "G7", "I7", "J7", "K7",
      "B10", "C10", "E10", "G10", "H10", "I10", "J10",
      "K3", "K4", "K6", "K8", "K9",
    ],
    log: "Loaded Test 7: large dense map.",
  }),
  createBuiltInMap("Test 8", {
    width: 6,
    height: 6,
    maxCapacity: 2,
    trash: ["F1", "C3", "A5", "E6"],
    obstacles: ["B2", "B3", "D3", "E3", "D4", "B6"],
    log: "Loaded Test 8: compact low-capacity map.",
  }),
  createBuiltInMap("Test 9", {
    width: 10,
    height: 8,
    maxCapacity: 3,
    trash: ["J1", "E2", "B4", "H4", "A8", "G8"],
    obstacles: [
      "C1", "C2", "C3", "C5", "C6", "C7",
      "F2", "G2", "H2", "I2",
      "F5", "G5", "H5", "I5",
      "E6", "E7", "E8",
    ],
    log: "Loaded Test 9: split-route map.",
  }),
  createBuiltInMap("Test 10", {
    width: 10,
    height: 10,
    maxCapacity: 3,
    trash: ["A5", "E1", "J1", "J5", "E10", "H10"],
    obstacles: [
      "B2", "C2", "D2", "F2", "G2", "H2", "I2",
      "D3", "F3", "I3",
      "B4", "D4", "F4", "G4", "I4",
      "B5", "D5", "G5", "I5",
      "B6", "D6", "F6", "G6", "I6",
      "B7", "F7", "I7",
      "B8", "C8", "D8", "F8", "H8", "I8",
      "D9", "F9",
    ],
    log: "Loaded Test 10: algorithm comparison map.",
  }),
]);

function createBuiltInMap(name, {
  width,
  height,
  maxCapacity,
  trash,
  obstacles,
  log,
}) {
  return {
    name,
    state: {
      robot: { x: 0, y: 0, battery: 100, capacity: 0, maxCapacity },
      map: {
        grid_size_x: width,
        grid_size_y: height,
        start_x: 0,
        start_y: 0,
        trashPositions: labels(trash),
        obstaclePositions: labels(obstacles),
        chargingStation: position("A1"),
        trashCan: { x: width - 1, y: height - 1 },
        done: false,
      },
      config: { maxBattery: 100, batteryLoss: 1, actionCost: 1 },
      steps: 0,
      latestAction: null,
      latestLog: log,
    },
  };
}

function labels(values) {
  return values.map(position);
}

function position(value) {
  return {
    x: value.charCodeAt(0) - 65,
    y: Number.parseInt(value.slice(1), 10) - 1,
  };
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}
