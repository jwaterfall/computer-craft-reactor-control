import { MonitorTouchEvent } from "./Event";
import { floor } from "./Formatter";
import { Reactor } from "./Reactor";
import { Turbine } from "./Turbine";
import {
  Button,
  HorizontalLayout,
  Page,
  ProgressBar,
  Section,
  Text,
  VerticalLayout,
} from "./Components";

export function getReactorPage(reactor: Reactor, event?: MonitorTouchEvent) {
  return new Page(
    "Reactor",
    new HorizontalLayout([
      new Section(
        "Overview",
        new VerticalLayout([
          new ProgressBar(
            reactor.getFuelStored(),
            reactor.getFuelCapacity(),
            "Fuel stored",
            colors.green
          ),
          new ProgressBar(
            reactor.getCasingTemperature(),
            2000,
            "Casing temperature",
            colors.orange
          ),
          new ProgressBar(
            reactor.getFuelTemperature(),
            2000,
            "Fuel temperature",
            colors.orange
          ),
          new ProgressBar(
            reactor.getSteamStored(),
            reactor.getCoolantCapacity(),
            "Steam stored",
            colors.red
          ),
          new ProgressBar(
            reactor.getWaterStored(),
            reactor.getCoolantCapacity(),
            "Water stored",
            colors.blue
          ),
        ])
      ),
      new VerticalLayout([
        new Section(
          "Controls",
          new VerticalLayout([
            new Button(
              reactor.getIsActive() ? "Deactivate" : "Activate",
              () => reactor.setIsActive(!reactor.getIsActive()),
              event,
              reactor.getIsActive() ? colors.red : colors.green
            ),
            new HorizontalLayout([
              new Button("Eject waste", reactor.ejectWaste, event),
              // new Button("Dump coolant", reactor.dumpCoolant, event),
            ]),
          ])
        ),
        new Section(
          "Statistics",
          new VerticalLayout([
            new Text(`Control rod level: ${reactor.getControlRodLevel(0)}%`),
            new Text(
              `Casing temperature: ${floor(reactor.getCasingTemperature())}K`
            ),
            // new Text(
            //   `Stack temperature: ${floor(reactor.getStackTemperature())}K`
            // ),
            new Text(
              `Fuel temperature: ${floor(reactor.getFuelTemperature())}K`
            ),
            new Text(`Fuel consumed: ${floor(reactor.getFuelConsumed())}mB/t`),
            new Text(`Fuel reactivity: ${floor(reactor.getFuelReactivity())}%`),
            new Text(
              `Steam produced: ${floor(
                reactor.getCoolantTransitioned() / 1000
              )}mB/t`
            ),
          ])
        ),
      ]),
    ])
  );
}

export function getTurbinePage(turbine: Turbine, event?: MonitorTouchEvent) {
  return new Page(
    "Turbine",
    new HorizontalLayout([
      new Section(
        "Overview",
        new VerticalLayout([
          new ProgressBar(
            turbine.getEnergyStored(),
            turbine.getEnergyCapacity(),
            "Energy stored",
            colors.green
          ),
          new ProgressBar(
            turbine.getRotorSpeed(),
            2200,
            "Rotor speed",
            colors.orange
          ),
          new ProgressBar(
            turbine.getRotorEfficiency(),
            1,
            "Rotor efficiency",
            colors.orange
          ),
          new ProgressBar(
            turbine.getSteamStored(),
            turbine.getSteamCapacity(),
            "Steam stored",
            colors.red
          ),
          new ProgressBar(
            turbine.getWaterStored(),
            turbine.getWaterCapacity(),
            "Water stored",
            colors.blue
          ),
        ])
      ),
      new VerticalLayout([
        new Section(
          "Controls",
          new VerticalLayout([
            new Button(
              turbine.getIsActive() ? "Deactivate" : "Activate",
              () => turbine.setIsActive(!turbine.getIsActive()),
              event,
              turbine.getIsActive() ? colors.red : colors.green
            ),
            new Button(
              turbine.getIsCoilEngaged() ? "Disengage coil" : "Engage coil",
              () => turbine.setIsCoilEngaged(!turbine.getIsCoilEngaged()),
              event,
              turbine.getIsCoilEngaged() ? colors.red : colors.green
            ),
          ])
        ),
        new Section(
          "Statistics",
          new VerticalLayout([
            new Text(
              `Energy produced: ${floor(turbine.getEnergyProduced())} RF/t`
            ),
            new Text(`Flow rate: ${floor(turbine.getFlowRate())} mB/t`),
            new Text(
              `Target flow rate: ${floor(turbine.getTargetFlowRate())} mB/t`
            ),
            new Text(
              `Flow rate limit: ${floor(turbine.getFlowRateLimit())} mB/t`
            ),
          ])
        ),
      ]),
    ])
  );
}

export function getTurbineAutounePage(
  turbine: Turbine,
  targetRPM: number,
  startTime: number
) {
  const actualRPM = turbine.getRotorSpeed();
  const maxFlowRate = turbine.getTargetFlowRate();
  const error = actualRPM - targetRPM;

  const elapsedTimeInSeconds = Math.floor((os.epoch("utc") - startTime) / 1000);

  const hours = Math.floor(elapsedTimeInSeconds / 3600);
  const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const seconds = elapsedTimeInSeconds % 60;
  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  let rpmColor = colors.red;
  if (Math.abs(error) < targetRPM * 0.001) {
    rpmColor = colors.green; // Within 0.1% of target
  } else if (Math.abs(error) < targetRPM * 0.05) {
    rpmColor = colors.orange; // Within 5% of target
  }

  return new Page(
    "Turbine Tuning",
    new VerticalLayout([
      new ProgressBar(
        actualRPM,
        targetRPM,
        "Target RPM vs Actual RPM",
        rpmColor,
        0.75,
        1.25
      ),
      new ProgressBar(
        maxFlowRate,
        turbine.getFlowRateLimit(),
        "Max flow rate",
        colors.blue
      ),
      new Section(
        "Statistics",
        new VerticalLayout([
          new Text(`Target RPM: ${floor(targetRPM)}`),
          new Text(`Actual RPM: ${floor(actualRPM)}`),
          new Text(`RPM Error: ${floor(error)}`),
          new Text(`Max flow rate: ${floor(maxFlowRate)} mB/t`),
          new Text(`Elapsed Time: ${formattedTime}`),
        ])
      ),
    ])
  );
}

export function getTextPage(title: string, text: string) {
  return new Page(title, new Text(text));
}
