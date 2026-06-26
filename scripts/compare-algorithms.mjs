import { Environment } from "../js/environment.js";
import { ACTIONS } from "../js/models.js";
import { algorithmRegistry, createAlgorithm } from "../js/algorithms/registry.js";
import {
  listBuiltInSavedMaps,
  loadBuiltInSavedMap,
} from "../js/sampleMaps.js";

const MAX_ACTIONS = 2000;
const DEFAULT_REPEATS = 5;

const repeatCount = Number.parseInt(
  process.argv.find((argument) => argument.startsWith("--repeats="))?.split("=")[1],
  10
) || DEFAULT_REPEATS;

const results = [];

for (const mapEntry of listBuiltInSavedMaps()) {
  for (const algorithmDefinition of algorithmRegistry) {
    const runs = [];

    for (let repeat = 0; repeat < repeatCount; repeat += 1) {
      runs.push(await runAlgorithmOnMap(mapEntry.name, algorithmDefinition));
    }

    const firstRun = runs[0];
    const runtimeMs = average(runs.map((run) => run.runtimeMs));

    results.push({
      mapName: mapEntry.name,
      algorithm: algorithmDefinition.label,
      status: firstRun.done ? "Done" : "Stopped",
      stateSteps: firstRun.stateSteps,
      actions: firstRun.actions,
      visitedNodes: firstRun.visitedNodes,
      runtimeMs,
      batteryUsed: firstRun.batteryUsed,
      peakMemory: firstRun.peakMemory,
      remainingTrash: firstRun.remainingTrash,
      finalBattery: firstRun.finalBattery,
      finalCapacity: firstRun.finalCapacity,
    });
  }
}

printMarkdown(results);

async function runAlgorithmOnMap(mapName, algorithmDefinition) {
  const environment = new Environment();
  const algorithm = await createAlgorithm(algorithmDefinition.id);

  environment.loadState(loadBuiltInSavedMap(mapName));
  algorithm.reset();

  let state = environment.getState();
  let actions = 0;

  while (!state.map.done && actions < MAX_ACTIONS) {
    const previousBattery = state.robot.battery;
    const action = algorithm.nextAction(state) ?? ACTIONS.STAY;
    state = environment.applyAction(action);
    algorithm.addBatteryConsumed(Math.max(0, previousBattery - state.robot.battery));
    actions += 1;
  }

  const metrics = algorithm.getMetricSummary();

  return {
    done: state.map.done,
    stateSteps: state.steps,
    actions,
    visitedNodes: metrics.visitedNodes,
    runtimeMs: metrics.runtimeMs,
    batteryUsed: metrics.batteryConsumed,
    peakMemory: metrics.peakMemory,
    remainingTrash: state.map.trashPositions.length,
    finalBattery: state.robot.battery,
    finalCapacity: state.robot.capacity,
  };
}

function printMarkdown(rows) {
  console.log(`# CleanerBot algorithm comparison`);
  console.log(``);
  console.log(`Repeats per algorithm/map: ${repeatCount}`);
  console.log(`Action limit per run: ${MAX_ACTIONS}`);
  console.log(``);

  for (const mapEntry of listBuiltInSavedMaps()) {
    const mapRows = rows.filter((row) => row.mapName === mapEntry.name);
    const state = loadBuiltInSavedMap(mapEntry.name);

    console.log(`## ${mapEntry.name}`);
    console.log(``);
    console.log(
      `Map: ${state.map.grid_size_x}x${state.map.grid_size_y}, trash ${state.map.trashPositions.length}, obstacles ${state.map.obstaclePositions.length}, capacity ${state.robot.maxCapacity}.`
    );
    console.log(``);
    console.log(`| Algorithm | Status | Steps | Actions | Visited nodes | Runtime ms avg | Battery used | Memory | Remaining trash | Final battery |`);
    console.log(`| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |`);

    for (const row of mapRows) {
      console.log(
        `| ${escapePipes(row.algorithm)} | ${row.status} | ${row.stateSteps} | ${row.actions} | ${row.visitedNodes} | ${formatDecimal(row.runtimeMs, 2)} | ${formatDecimal(row.batteryUsed, 1)} | ${row.peakMemory} | ${row.remainingTrash} | ${formatDecimal(row.finalBattery, 1)} |`
      );
    }

    console.log(``);
  }

  console.log(`## Summary`);
  console.log(``);
  console.log(`| Map | Best steps | Best step algorithms | Lowest visited nodes | Lowest runtime avg | Lowest memory |`);
  console.log(`| --- | ---: | --- | --- | --- | --- |`);

  for (const mapEntry of listBuiltInSavedMaps()) {
    const doneRows = rows.filter((row) => row.mapName === mapEntry.name && row.status === "Done");
    const bestSteps = minBy(doneRows, (row) => row.stateSteps)?.stateSteps ?? "-";
    const bestStepAlgorithms = doneRows
      .filter((row) => row.stateSteps === bestSteps)
      .map((row) => row.algorithm)
      .join(", ");
    const lowestVisited = minBy(doneRows, (row) => row.visitedNodes);
    const lowestRuntime = minBy(doneRows, (row) => row.runtimeMs);
    const lowestMemory = minBy(doneRows, (row) => row.peakMemory);

    console.log(
      `| ${mapEntry.name} | ${bestSteps} | ${escapePipes(bestStepAlgorithms)} | ${formatWinner(lowestVisited, "visitedNodes")} | ${formatWinner(lowestRuntime, "runtimeMs", 2)} | ${formatWinner(lowestMemory, "peakMemory")} |`
    );
  }
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function minBy(items, selector) {
  return items.reduce((best, item) => {
    if (!best || selector(item) < selector(best)) {
      return item;
    }

    return best;
  }, null);
}

function formatWinner(row, key, decimals = 0) {
  if (!row) {
    return "-";
  }

  const value = decimals > 0 ? formatDecimal(row[key], decimals) : row[key];
  return `${row.algorithm} (${value})`;
}

function formatDecimal(value, decimals) {
  return Number(value).toFixed(decimals);
}

function escapePipes(value) {
  return `${value}`.replaceAll("|", "\\|");
}
