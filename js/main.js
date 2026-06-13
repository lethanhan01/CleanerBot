import { Environment } from "./environment.js";
import { Simulator } from "./simulator.js";
import { Renderer } from "./render.js";
import { algorithmRegistry, createAlgorithm } from "./algorithms/registry.js";
import { createAlgorithmComparisonMap10x10 } from "./sampleMaps.js";
import { MapStorage } from "./mapStorage.js?v=3";

document.body.classList.add("js-ready");

const elements = {
  gridMap: document.getElementById("gridMap"),
  gridColumnLabels: document.getElementById("gridColumnLabels"),
  gridRowLabels: document.getElementById("gridRowLabels"),
  algorithmSelect: document.getElementById("algorithmSelect"),
  editToolSelect: document.getElementById("editToolSelect"),
  mapWidthInput: document.getElementById("mapWidthInput"),
  mapHeightInput: document.getElementById("mapHeightInput"),
  trashCountInput: document.getElementById("trashCountInput"),
  obstacleCountInput: document.getElementById("obstacleCountInput"),
  maxCapacityInput: document.getElementById("maxCapacityInput"),
  maxBatteryInput: document.getElementById("maxBatteryInput"),
  batteryLossInput: document.getElementById("batteryLossInput"),
  mapNameInput: document.getElementById("mapNameInput"),
  savedMapSelect: document.getElementById("savedMapSelect"),
  saveMapButton: document.getElementById("saveMapButton"),
  loadSavedMapButton: document.getElementById("loadSavedMapButton"),
  deleteSavedMapButton: document.getElementById("deleteSavedMapButton"),
  generateButton: document.getElementById("generateButton"),
  loadDemoMapButton: document.getElementById("loadDemoMapButton"),
  resetButton: document.getElementById("resetButton"),
  previousStepButton: document.getElementById("previousStepButton"),
  nextStepButton: document.getElementById("nextStepButton"),
  runButton: document.getElementById("runButton"),
  stopButton: document.getElementById("stopButton"),
  spawnTrashButton: document.getElementById("spawnTrashButton"),
  speedButtons: document.querySelectorAll(".speed-button"),
  batteryValue: document.getElementById("batteryValue"),
  capacityValue: document.getElementById("capacityValue"),
  positionValue: document.getElementById("positionValue"),
  doneValue: document.getElementById("doneValue"),
  stepsValue: document.getElementById("stepsValue"),
  latestLog: document.getElementById("latestLog"),
  latestActionValue: document.getElementById("latestActionValue"),
  nextActionValue: document.getElementById("nextActionValue"),
  statusBadge: document.getElementById("statusBadge"),
};

const environment = new Environment();
const mapStorage = new MapStorage();
const renderer = new Renderer({
  gridElement: elements.gridMap,
  columnLabelsElement: elements.gridColumnLabels,
  rowLabelsElement: elements.gridRowLabels,
  batteryElement: elements.batteryValue,
  capacityElement: elements.capacityValue,
  positionElement: elements.positionValue,
  doneElement: elements.doneValue,
  stepsElement: elements.stepsValue,
  latestLogElement: elements.latestLog,
  latestActionElement: elements.latestActionValue,
  nextActionElement: elements.nextActionValue,
  statusBadgeElement: elements.statusBadge,
});

let simulator = null;

function getMapConfigFromInputs() {
  updateCountLimitsFromInputs();

  return {
    gridSizeX: elements.mapWidthInput.value,
    gridSizeY: elements.mapHeightInput.value,
    trashCount: elements.trashCountInput.value,
    obstacleCount: elements.obstacleCountInput.value,
    maxCapacity: elements.maxCapacityInput.value,
    maxBattery: elements.maxBatteryInput.value,
    batteryLoss: elements.batteryLossInput.value,
  };
}

function renderAlgorithmOptions() {
  elements.algorithmSelect.innerHTML = "";

  algorithmRegistry.forEach((algorithm) => {
    const option = document.createElement("option");
    option.value = algorithm.id;
    option.textContent = algorithm.label;
    elements.algorithmSelect.appendChild(option);
  });
}

async function createSelectedAlgorithm() {
  return createAlgorithm(elements.algorithmSelect.value);
}

function updateButtonState() {
  const isReady = simulator !== null;
  const isRunning = isReady && simulator.isRunning();

  elements.runButton.disabled = !isReady || isRunning;
  elements.previousStepButton.disabled = !isReady || isRunning || !simulator.canStepBack();
  elements.nextStepButton.disabled = !isReady || isRunning;
  elements.generateButton.disabled = !isReady || isRunning;
  elements.loadDemoMapButton.disabled = !isReady || isRunning;
  elements.resetButton.disabled = !isReady;
  elements.algorithmSelect.disabled = !isReady || isRunning;
  elements.editToolSelect.disabled = !isReady || isRunning;
  elements.mapWidthInput.disabled = !isReady || isRunning;
  elements.mapHeightInput.disabled = !isReady || isRunning;
  elements.trashCountInput.disabled = !isReady || isRunning;
  elements.obstacleCountInput.disabled = !isReady || isRunning;
  elements.maxCapacityInput.disabled = !isReady || isRunning;
  elements.maxBatteryInput.disabled = !isReady || isRunning;
  elements.batteryLossInput.disabled = !isReady || isRunning;
  elements.mapNameInput.disabled = !isReady || isRunning;
  elements.savedMapSelect.disabled = !isReady || isRunning || elements.savedMapSelect.options.length <= 1;
  elements.saveMapButton.disabled = !isReady || isRunning || !elements.mapNameInput.value.trim();
  elements.loadSavedMapButton.disabled = !isReady || isRunning || !elements.savedMapSelect.value;
  elements.deleteSavedMapButton.disabled = !isReady || isRunning || !elements.savedMapSelect.value;
  elements.spawnTrashButton.disabled = !isReady || isRunning;
  elements.stopButton.disabled = !isRunning;
}

function commitPausedMapChange(nextState, positionHistoryAction = nextState.latestAction) {
  environment.saveCurrentAsInitialState();
  simulator.algorithm.reset();
  simulator.clearNextActionCache();
  simulator.clearHistory();
  simulator.resetPositionHistory(nextState, positionHistoryAction);
  updateCountInputs(nextState);
  handleStateChange(nextState);
}

function syncConfigFromInputs() {
  if (!simulator || simulator.isRunning()) {
    return;
  }

  updateCountLimitsFromInputs();
  simulator.updateConfig(getMapConfigFromInputs());
  updateInputsFromState(environment.getInitialState());
}

function handleStateChange(state) {
  const nextAction = simulator && !state.map.done ? simulator.peekNextAction() : null;
  renderer.render(state, nextAction, simulator?.getCurrentTarget());
  updateButtonState();
}

async function bindEvents() {
  elements.algorithmSelect.addEventListener("change", async () => {
    simulator.setAlgorithm(await createSelectedAlgorithm());
    handleStateChange(environment.getState());
    updateButtonState();
  });

  elements.generateButton.addEventListener("click", () => {
    simulator.generate(getMapConfigFromInputs());
    updateInputsFromState(environment.getInitialState());
    updateButtonState();
  });

  elements.loadDemoMapButton.addEventListener("click", () => {
    simulator.loadState(createAlgorithmComparisonMap10x10());
    updateInputsFromState(environment.getInitialState());
    updateButtonState();
  });

  elements.saveMapButton.addEventListener("click", async () => {
    try {
      const result = await mapStorage.save(
        elements.mapNameInput.value,
        environment.getInitialState()
      );
      await renderSavedMapOptions(result.name);
      elements.mapNameInput.value = result.name;
      showStorageMessage(
        result.overwritten
          ? `Updated saved map "${result.name}".`
          : `Saved map "${result.name}".`
      );
    } catch (error) {
      showStorageMessage(error.message);
    }

    updateButtonState();
  });

  elements.loadSavedMapButton.addEventListener("click", async () => {
    try {
      const selectedName = elements.savedMapSelect.value;
      simulator.loadState(await mapStorage.load(selectedName));
      updateInputsFromState(environment.getInitialState());
      elements.mapNameInput.value = selectedName;
      showStorageMessage(`Loaded saved map "${selectedName}".`);
    } catch (error) {
      await renderSavedMapOptions();
      showStorageMessage(error.message);
    }

    updateButtonState();
  });

  elements.deleteSavedMapButton.addEventListener("click", async () => {
    try {
      const selectedName = elements.savedMapSelect.value;

      if (await mapStorage.remove(selectedName)) {
        await renderSavedMapOptions();
        elements.mapNameInput.value = "";
        showStorageMessage(`Deleted saved map "${selectedName}".`);
      }
    } catch (error) {
      showStorageMessage(error.message);
    }

    updateButtonState();
  });

  elements.savedMapSelect.addEventListener("change", () => {
    if (elements.savedMapSelect.value) {
      elements.mapNameInput.value = elements.savedMapSelect.value;
    }

    updateButtonState();
  });

  elements.mapNameInput.addEventListener("input", updateButtonState);

  elements.resetButton.addEventListener("click", () => {
    simulator.reset();
    updateInputsFromState(environment.getInitialState());
    updateButtonState();
  });

  elements.previousStepButton.addEventListener("click", () => {
    simulator.previousStep();
    updateButtonState();
  });

  elements.nextStepButton.addEventListener("click", () => {
    simulator.step();
    updateButtonState();
  });

  elements.runButton.addEventListener("click", () => {
    syncConfigFromInputs();
    simulator.run();
    updateButtonState();
  });

  elements.stopButton.addEventListener("click", () => {
    simulator.stop();
    updateButtonState();
  });

  elements.speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const speed = Number.parseInt(button.dataset.speed, 10);
      simulator.setSpeedMultiplier(speed);
      setActiveSpeedButton(button);
      updateButtonState();
    });
  });

  elements.gridMap.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");

    if (!cell || simulator.isRunning()) {
      return;
    }

    const x = Number.parseInt(cell.dataset.x, 10);
    const y = Number.parseInt(cell.dataset.y, 10);
    const nextState = environment.applyMapEdit(elements.editToolSelect.value, x, y);
    commitPausedMapChange(nextState);
  });

  elements.spawnTrashButton.addEventListener("click", () => {
    if (simulator.isRunning()) {
      return;
    }

    const nextState = environment.spawnRandomTrash();
    commitPausedMapChange(nextState, nextState.latestAction);
  });

  elements.gridMap.addEventListener("mouseover", (event) => {
    const cell = event.target.closest(".cell");

    if (!cell || elements.editToolSelect.value !== "inspect" || simulator.isRunning()) {
      return;
    }

    renderCellInspection(cell);
  });

  elements.gridMap.addEventListener("mouseleave", () => {
    if (elements.editToolSelect.value !== "inspect" || simulator.isRunning()) {
      return;
    }

    elements.latestLog.textContent = environment.getState().latestLog;
  });

  [
    elements.mapWidthInput,
    elements.mapHeightInput,
    elements.trashCountInput,
    elements.obstacleCountInput,
    elements.maxCapacityInput,
    elements.maxBatteryInput,
    elements.batteryLossInput,
  ].forEach((input) => {
    input.addEventListener("change", syncConfigFromInputs);
  });
}

async function renderSavedMapOptions(selectedName = "") {
  elements.savedMapSelect.innerHTML = "";

  let savedMaps;

  try {
    savedMaps = await mapStorage.list();
  } catch (error) {
    const unavailableOption = document.createElement("option");
    unavailableOption.value = "";
    unavailableOption.textContent = "Storage server unavailable";
    elements.savedMapSelect.appendChild(unavailableOption);
    elements.savedMapSelect.title = error.message;
    return false;
  }

  elements.savedMapSelect.title = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = savedMaps.length > 0 ? "Select a saved map" : "No saved maps";
  elements.savedMapSelect.appendChild(placeholder);

  savedMaps.forEach(({ name }) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    elements.savedMapSelect.appendChild(option);
  });

  if (savedMaps.some(({ name }) => name === selectedName)) {
    elements.savedMapSelect.value = selectedName;
  }

  return true;
}

function showStorageMessage(message) {
  elements.latestLog.textContent = message;
}

function renderCellInspection(cell) {
  const x = Number.parseInt(cell.dataset.x, 10);
  const y = Number.parseInt(cell.dataset.y, 10);
  elements.latestLog.textContent = environment.getCellInfo(x, y);
}

function setActiveSpeedButton(activeButton) {
  elements.speedButtons.forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function updateCountInputs(state) {
  elements.trashCountInput.value = `${state.map.trashPositions.length}`;
  elements.obstacleCountInput.value = `${state.map.obstaclePositions.length}`;
  updateCountLimitsFromInputs();
}

function updateInputsFromState(state) {
  elements.mapWidthInput.value = `${state.map.grid_size_x}`;
  elements.mapHeightInput.value = `${state.map.grid_size_y}`;
  elements.trashCountInput.value = `${state.map.trashPositions.length}`;
  elements.obstacleCountInput.value = `${state.map.obstaclePositions.length}`;
  elements.maxCapacityInput.value = `${state.robot.maxCapacity}`;
  elements.maxBatteryInput.value = `${state.config.maxBattery}`;
  elements.batteryLossInput.value = `${state.config.batteryLoss}`;
  updateCountLimitsFromInputs();
}

function updateCountLimitsFromInputs() {
  const gridSizeX = clampInteger(
    elements.mapWidthInput.value,
    Number.parseInt(elements.mapWidthInput.min, 10),
    Number.parseInt(elements.mapWidthInput.max, 10)
  );
  const gridSizeY = clampInteger(
    elements.mapHeightInput.value,
    Number.parseInt(elements.mapHeightInput.min, 10),
    Number.parseInt(elements.mapHeightInput.max, 10)
  );
  const usableCellCount = Math.max(0, gridSizeX * gridSizeY - 2);
  const obstacleCount = clampInteger(
    elements.obstacleCountInput.value,
    0,
    usableCellCount
  );
  const maxTrashCount = Math.max(0, usableCellCount - obstacleCount);
  const trashCount = clampInteger(
    elements.trashCountInput.value,
    0,
    maxTrashCount
  );

  elements.mapWidthInput.value = `${gridSizeX}`;
  elements.mapHeightInput.value = `${gridSizeY}`;
  elements.obstacleCountInput.max = `${usableCellCount}`;
  elements.obstacleCountInput.value = `${obstacleCount}`;
  elements.trashCountInput.max = `${maxTrashCount}`;
  elements.trashCountInput.value = `${trashCount}`;
}

function clampInteger(value, min, max) {
  const numberValue = Number.parseInt(value, 10);

  if (Number.isNaN(numberValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numberValue));
}

async function init() {
  renderAlgorithmOptions();
  const storageAvailable = await renderSavedMapOptions();
  updateButtonState();

  simulator = new Simulator({
    environment,
    algorithm: await createSelectedAlgorithm(),
    onStateChange: handleStateChange,
  });

  bindEvents();
  handleStateChange(environment.getState());
  updateInputsFromState(environment.getInitialState());
  if (!storageAvailable) {
    showStorageMessage("Save/Load maps requires the project server. Run npm start and open http://localhost:3000.");
  }
  updateButtonState();
}

init().catch((error) => {
  console.error(error);
  if (elements.statusBadge) {
    elements.statusBadge.textContent = "Error";
  }
  elements.latestLog.textContent = "Cannot start simulator. Check Console for module import errors.";
  updateButtonState();
});
