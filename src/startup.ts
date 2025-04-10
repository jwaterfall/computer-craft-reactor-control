import { loadConfig } from "./Config";
import { getMonitorTouchEvent, MonitorTouchEvent } from "./Event";
import { Monitor } from "./Monitor";
import { getReactorPage, getTurbinePage } from "./Page";
import { ReactorPeripheral, TurbinePeripheral } from "./Peripheral";
import { Reactor } from "./Reactor";
import { Turbine } from "./Turbine";
import { runSetupWizard } from "./Wizard";

const config = fs.exists("config.json") ? loadConfig() : runSetupWizard();

const reactor = new Reactor(peripheral.wrap(config.reactor.name) as ReactorPeripheral);
reactor.setAllControlRods(config.reactor.controlRodLevel);

const turbines = config.turbines.map((turbineConfig) => {
  const turbine = new Turbine(peripheral.wrap(turbineConfig.name) as TurbinePeripheral);
  turbine.setTargetFlowRate(turbineConfig.targetFlowRate);
  return turbine;
});

function updateMonitors(event?: MonitorTouchEvent) {
  const reactorMonitor = new Monitor(config.reactor.monitor);
  reactorMonitor.clear();
  getReactorPage(reactor, event).render(reactorMonitor);

  turbines.forEach((turbine) => {
    const turbineConfig = config.turbines.find(
      (turbineConfig) => turbineConfig.name === turbine.getName()
    )!;
    const turbineMonitor = new Monitor(turbineConfig.monitor);
    turbineMonitor.clear();
    getTurbinePage(turbine, event).render(turbineMonitor);
  });
}

while (true) {
  parallel.waitForAny(
    () => {
      const event = getMonitorTouchEvent();
      updateMonitors(event);
    },
    () => {
      sleep(config.monitorUpdateInterval);
      updateMonitors();
    }
  );
}
