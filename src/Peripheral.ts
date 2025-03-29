export interface EnergyStats {
  energyStored: number;
  energyCapacity: number;
  energyProducedLastTick: number;
  energySystem: string;
}

export interface FuelStats {
  fuelAmount: number;
  fuelCapacity: number;
  fuelTemperature: number;
  fuelConsumedLastTick: number;
  fuelReactivity: number;
  wasteAmount: number;
}

export interface FluidStats {
  fluidType: string;
  fluidAmount: number;
  fluidCapacity: number;
}

export interface HotFluidStats extends FluidStats {
  fluidProducedLastTick: number;
}

/** @noSelf **/
export interface MultiblockPeripheral extends IPeripheral {
  mbIsConnected(): boolean;
  mbIsAssembled(): boolean;
  mbIsDisassembled(): boolean;
  mbIsPaused(): boolean;
  mbGetMultiblockControllerTypeName(): string;
  mbGetMinimumCoordinate(): [number, number, number];
  mbGetMaximumCoordinate(): [number, number, number];
}

/** @noSelf **/
export interface ReactorPeripheral extends MultiblockPeripheral {
  getVariant(): string;
  getEnergyStored(): number;
  getEnergyStoredAsText(): string;
  getNumberOfControlRods(): number;
  getActive(): boolean;
  getFuelTemperature(): number;
  getCasingTemperature(): number;
  getFuelAmount(): number;
  getWasteAmount(): number;
  getFuelAmountMax(): number;
  getControlRodName(index: number): string;
  getControlRodLevel(index: number): number;
  getEnergyProducedLastTick(): number;
  getHotFluidProducedLastTick(): number;
  isActivelyCooled(): boolean;
  getCoolantAmount(): number;
  getCoolantAmountMax(): number;
  getCoolantType(): string;
  getHotFluidAmount(): number;
  getHotFluidAmountMax(): number;
  getHotFluidType(): string;
  getFuelReactivity(): number;
  getFuelConsumedLastTick(): number;
  getControlRodLocation(index: number): { x: number; y: number; z: number } | null;
  getEnergyCapacity(): number;
  getControlRodsLevels(): Record<number, number>;
  setControlRodsLevels(levels: Record<number, number>): void;
  getEnergyStats(): EnergyStats;
  getFuelStats(): FuelStats;
  getHotFluidStats(): HotFluidStats;
  getCoolantFluidStats(): FluidStats;
  setActive(active: boolean): void;
  setControlRodLevel(index: number, level: number): void;
  setAllControlRodLevels(level: number): void;
  setControlRodName(index: number, name: string): void;
  doEjectWaste(): void;
  doEjectFuel(): void;
}

/** @noSelf **/
export interface TurbinePeripheral extends MultiblockPeripheral {
  getVariant(): string;
  getActive(): boolean;
  getEnergyProducedLastTick(): number;
  getEnergyStored(): number;
  getEnergyStoredAsText(): string;
  getFluidAmountMax(): number;
  getFluidFlowRate(): number;
  getFluidFlowRateMax(): number;
  getFluidFlowRateMaxMax(): number;
  getInputAmount(): number;
  getInputType(): string;
  getOutputAmount(): number;
  getOutputType(): string;
  getRotorSpeed(): number;
  getNumberOfBlades(): number;
  getBladeEfficiency(): number;
  getRotorMass(): number;
  getInductorEngaged(): boolean;
  getEnergyCapacity(): number;
  getEnergyStats(): EnergyStats;
  setActive(active: boolean): void;
  setFluidFlowRateMax(rate: number): void;
  setVentNone(): void;
  setVentOverflow(): void;
  setVentAll(): void;
  setInductorEngaged(engaged: boolean): void;
}

export function findReactorPeripheral() {
  const reactors = peripheral.find("BigReactors-Reactor");
  return reactors.length === 0 ? undefined : (reactors[0] as ReactorPeripheral);
}

export function findTurbinePeripherals() {
  const turbines = peripheral.find("BigReactors-Turbine");
  return turbines as unknown as TurbinePeripheral[];
}

export function findMonitorPeripherals() {
  const monitors = peripheral.find("monitor");
  return monitors as unknown as MonitorPeripheral[];
}
