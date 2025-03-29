import { Config, saveConfig } from "./Config";
import { Monitor } from "./Monitor";
import { Reactor } from "./Reactor";
import { Turbine } from "./Turbine";
import { getTextPage, getTurbineAutounePage } from "./Page";
import { Page } from "./Components";
import {
  findMonitorPeripherals,
  findReactorPeripheral,
  findTurbinePeripherals,
} from "./Peripheral";
import { getMonitorTouchEvent } from "./Event";

export function runSetupWizard(): Config {
  const reactorPeripheral = findReactorPeripheral();
  const turbinePeripherals = findTurbinePeripherals();
  const monitorPeripherals = findMonitorPeripherals();

  if (!reactorPeripheral) {
    throw new Error(
      "No reactor found, please connect a reactor to the computer and try again."
    );
  }

  if (turbinePeripherals.length === 0) {
    throw new Error(
      "No turbines found, please connect at least one turbine to the computer and try again."
    );
  }

  if (monitorPeripherals.length !== turbinePeripherals.length + 1) {
    throw new Error(
      "No monitors found, please connect a monitor for each turbine and the reactor and try again."
    );
  }

  const reactor = new Reactor(reactorPeripheral);
  const turbines = turbinePeripherals.map(
    (turbinePeripheral) => new Turbine(turbinePeripheral)
  );
  const monitors = monitorPeripherals.map(
    (monitorPeripheral) => new Monitor(peripheral.getName(monitorPeripheral))
  );

  renderPageOnAllMonitors(
    getTextPage(
      "Setup Wizard",
      "Welcome to the setup wizard. This wizard will help you configure your reactor and turbines."
    ),
    monitors
  );
  reactor.setAllControlRods(0);

  const targetFlowRate = turbines.reduce(
    (acc, turbine) => acc + autotuneTurbine(monitors, turbine),
    0
  );
  const controlRodLevel = autotuneReactor(monitors, reactor, targetFlowRate);

  const config = {
    autoOnPercentage: 75,
    autoOffPercentage: 25,
    monitorUpdateInterval: 1,
    reactor: {
      name: reactor.getName(),
      monitor: getMonitorSelection(
        "Please select the monitor to use for the reactor.",
        monitors
      ),
      controlRodLevel: controlRodLevel,
    },
    turbines: turbines.map((turbine) => ({
      name: turbine.getName(),
      monitor: getMonitorSelection(
        `Please select the monitor to use for turbine ${turbine.getName()}.`,
        monitors
      ),
      targetFlowRate: turbine.getTargetFlowRate(),
    })),
  };

  saveConfig(config);
  return config;
}

function renderPageOnAllMonitors(page: Page, monitors: Monitor[]) {
  monitors.forEach((monitor) => {
    monitor.clear();
    page.render(monitor);
  });
}

function getMonitorSelection(text: string, monitors: Monitor[]) {
  const page = getTextPage("Setup Wizard", text);

  monitors.forEach((monitor, index) => {
    monitor.clear();
    page.render(monitor);
  });

  return getMonitorTouchEvent().monitor;
}

function autotuneTurbine(
  monitors: Monitor[],
  turbine: Turbine,
  targetRPM = 1800
): number {
  const startTime = os.epoch("utc");

  const maxFlowRate = 120000;
  const minStep = 1;
  const maxStep = 10000;
  const stableThresholdPercentage = 0.001;
  const requiredStableSamples = 20; // Increased buffer size
  const dampingFactor = 0.5;

  let Kp = 1;
  let stabilityBuffer: number[] = [];
  let hasBegun = false;

  turbine.setIsActive(true);
  turbine.setIsCoilEngaged(true);
  turbine.setTargetFlowRate(0);

  while (true) {
    sleep(1);

    const targetFlowRate = turbine.getTargetFlowRate();
    const actualRPM = turbine.getRotorSpeed();
    const error = targetRPM - actualRPM;

    // Skip waiting phase if already near target RPM
    if (!hasBegun) {
      if (actualRPM < targetRPM * 0.1) {
        hasBegun = true;
      } else {
        renderPageOnAllMonitors(
          getTextPage(
            "Setup Wizard",
            `Auto-tuning turbine ${turbine.getName()}. Waiting for turbine to slow down...`
          ),
          monitors
        );
        continue;
      }
    }

    stabilityBuffer.push(actualRPM);
    if (stabilityBuffer.length > requiredStableSamples) {
      stabilityBuffer.shift();
    }

    const isStable =
      stabilityBuffer.length === requiredStableSamples &&
      stabilityBuffer.every(
        (rpm) =>
          Math.abs(rpm - targetRPM) < targetRPM * stableThresholdPercentage
      );

    if (isStable) {
      return targetFlowRate;
    }

    Kp = Math.max(0.5, Math.min(2, Math.abs(error) / 500));

    let stepSize = Kp * Math.abs(error) * dampingFactor;
    stepSize = Math.min(Math.max(stepSize, minStep), maxStep);

    if (actualRPM >= targetRPM) {
      turbine.setTargetFlowRate(Math.max(targetFlowRate - stepSize, 0));
    } else {
      turbine.setTargetFlowRate(
        Math.min(targetFlowRate + stepSize, maxFlowRate)
      );
    }

    renderPageOnAllMonitors(
      getTurbineAutounePage(turbine, targetRPM, startTime),
      monitors
    );
  }
}

function autotuneReactor(
  monitors: Monitor[],
  reactor: Reactor,
  targetFlowRate: number
): number {
  const maxControlRodLevel = 100;
  const minStep = 1; // Minimum step must be an integer
  const maxStep = 10; // Maximum step must be an integer
  const stableThresholdPercentage = 0.01;
  const requiredStableIterations = 10;

  const Kp = 0.0001;

  reactor.setAllControlRods(100);

  let stableIterationCount = 0;

  while (true) {
    const controlRodLevel = reactor.getControlRodLevel(0);
    const actualFlowRate = reactor.getCoolantTransitioned();

    if (
      Math.abs(actualFlowRate - targetFlowRate) <
      targetFlowRate * stableThresholdPercentage
    ) {
      stableIterationCount++;

      if (stableIterationCount >= requiredStableIterations) {
        return controlRodLevel;
      }
    } else {
      stableIterationCount = 0;
    }

    const error = targetFlowRate - actualFlowRate;
    const step = Math.min(
      Math.max(Math.round(Kp * Math.abs(error)), minStep),
      maxStep
    );

    if (actualFlowRate >= targetFlowRate) {
      reactor.setAllControlRods(
        Math.min(controlRodLevel + step, maxControlRodLevel)
      );
    } else {
      reactor.setAllControlRods(Math.max(controlRodLevel - step, 0));
    }

    renderPageOnAllMonitors(
      getTextPage(
        "Setup Wizard",
        `Auto-tuning reactor. Step: ${step}, Target Flow Rate: ${targetFlowRate}, Actual Flow Rate: ${actualFlowRate}, Control Rod Level: ${controlRodLevel}`
      ),
      monitors
    );

    sleep(5);
  }
}
