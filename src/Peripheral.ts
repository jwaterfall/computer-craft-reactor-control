/** @noSelf **/
export interface Battery {
    stored(): number;
    capacity(): number;
    producedLastTick(): number;
}

/** @noSelf **/
export interface CoolantTank {
    coldFluidAmount(): number;
    hotFluidAmount(): number;
    capacity(): number;
    transitionedLastTick(): number;
    maxTransitionedLastTick(): number;
    dump(): void;
}

/** @noSelf **/
export interface FuelTank {
    capacity(): number;
    totalReactant(): number;
    fuel(): number;
    waste(): number;
    ejectWaste(): void;
    fuelReactivity(): number;
    burnedLastTick(): number;
}

/** @noSelf **/
export interface ControlRod {
    valid(): boolean;
    index(): number;
    level(): number;
    setLevel(level: number): void;
    name(): string;
    setName(name: string): void;
}

/** @noSelf **/
export interface ReactorPeripheral extends IPeripheral {
    apiVersion(): string;
    connected(): boolean;
    active(): boolean;
    setActive(active: boolean): void;
    battery(): Battery;
    coolantTank(): CoolantTank;
    fuelTank(): FuelTank;
    controlRodCount(): number;
    getControlRod(index: number): ControlRod;
    setAllControlRodLevels(level: number): void;
    fuelTemperature(): number;
    casingTemperature(): number;
    stackTemperature(): number;
    ambientTemperature(): number;
}

/** @noSelf **/
export interface Rotar {
    RPM(): number;
    efficiencyLastTick(): number;
}

/** @noSelf **/
export interface TankFluid {
    name(): string;
    amount(): number;
    maxAmount(): number;
}

/** @noSelf **/
export interface FluidTank {
    input(): TankFluid;
    output(): TankFluid;
    flowLastTick(): number;
    nominalFlowRate(): number;
    setNominalFlowRate(rate: number): void;
    flowRateLimit(): number;
}

/** @noSelf **/
export interface TurbinePeripheral extends IPeripheral {
    apiVersion(): string;
    connected(): boolean;
    active(): boolean;
    setActive(active: boolean): void;
    battery(): Battery;
    rotor(): Rotar;
    fluidTank(): FluidTank;
    coilEngaged(): boolean;
    setCoilEngaged(engaged: boolean): void;
}

export function findReactorPeripheral() {
    const reactors = peripheral.find("BiggerReactors_Reactor");
    return reactors.length === 0 ? undefined : (reactors[0] as ReactorPeripheral);
}

export function findTurbinePeripherals() {
    const turbines = peripheral.find("BiggerReactors_Turbine");
    return turbines as unknown as TurbinePeripheral[];
}

export function findMonitorPeripherals() {
    const monitors = peripheral.find("monitor");
    return monitors as unknown as MonitorPeripheral[];
}
