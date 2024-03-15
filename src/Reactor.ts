import { ReactorPeripheral } from "./Peripheral";

export class Reactor {
    private reactorPeripheral: ReactorPeripheral;

    constructor(private name: string) {
        this.reactorPeripheral = peripheral.wrap(name) as ReactorPeripheral;
    }

    getName() {
        return this.name;
    }

    getApiVersion() {
        return this.reactorPeripheral.apiVersion();
    }

    getIsConnected() {
        return this.reactorPeripheral.connected();
    }

    getIsActive() {
        return this.reactorPeripheral.active();
    }

    setIsActive(active: boolean) {
        this.reactorPeripheral.setActive(active);
    }

    getEnergyStored() {
        return this.reactorPeripheral.battery().stored();
    }

    getEnergyCapacity() {
        return this.reactorPeripheral.battery().capacity();
    }

    getEnergyProduced() {
        return this.reactorPeripheral.battery().producedLastTick();
    }

    getWaterStored() {
        return this.reactorPeripheral.coolantTank().coldFluidAmount();
    }

    getSteamStored() {
        return this.reactorPeripheral.coolantTank().hotFluidAmount();
    }

    getCoolantCapacity() {
        return this.reactorPeripheral.coolantTank().capacity();
    }

    getCoolantTransitioned() {
        return this.reactorPeripheral.coolantTank().transitionedLastTick();
    }

    getCoolantMaxTransitioned() {
        return this.reactorPeripheral.coolantTank().maxTransitionedLastTick();
    }

    dumpCoolant() {
        this.reactorPeripheral.coolantTank().dump();
    }

    getFuelCapacity() {
        return this.reactorPeripheral.fuelTank().capacity();
    }

    getReactantStored() {
        return this.reactorPeripheral.fuelTank().totalReactant();
    }

    getFuelStored() {
        return this.reactorPeripheral.fuelTank().fuel();
    }

    getWasteStored() {
        return this.reactorPeripheral.fuelTank().waste();
    }

    ejectWaste() {
        this.reactorPeripheral.fuelTank().ejectWaste();
    }

    getFuelReactivity() {
        return this.reactorPeripheral.fuelTank().fuelReactivity();
    }

    getFuelConsumed() {
        return this.reactorPeripheral.fuelTank().burnedLastTick();
    }

    getControlRodCount() {
        return this.reactorPeripheral.controlRodCount();
    }

    setAllControlRods(level: number) {
        this.reactorPeripheral.setAllControlRodLevels(level);
    }

    getControlRodIsValid(index: number) {
        return this.reactorPeripheral.getControlRod(0).valid();
    }

    getControlRodLevel(index: number) {
        return this.reactorPeripheral.getControlRod(index).level();
    }

    setControlRodLevel(index: number, level: number) {
        this.reactorPeripheral.getControlRod(index).setLevel(level);
    }

    getControlRodName(index: number) {
        return this.reactorPeripheral.getControlRod(index).name();
    }

    setControlRodName(index: number, name: string) {
        this.reactorPeripheral.getControlRod(index).setName(name);
    }

    getFuelTemperature() {
        return this.reactorPeripheral.fuelTemperature();
    }

    getCasingTemperature() {
        return this.reactorPeripheral.casingTemperature();
    }

    getStackTemperature() {
        return this.reactorPeripheral.stackTemperature();
    }

    getAmbientTemperature() {
        return this.reactorPeripheral.ambientTemperature();
    }
}
