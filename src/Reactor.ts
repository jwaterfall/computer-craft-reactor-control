import { ReactorPeripheral } from "./Peripheral";

export class Reactor {
    constructor(private reactorPeripheral: ReactorPeripheral) {}

    getName() {
        return peripheral.getName(this.reactorPeripheral);
    }

    getIsActive() {
        return this.reactorPeripheral.getActive();
    }

    setIsActive(active: boolean) {
        this.reactorPeripheral.setActive(active);
    }

    getEnergyStored() {
        return this.reactorPeripheral.getEnergyStored();
    }

    getEnergyCapacity() {
        return this.reactorPeripheral.getEnergyCapacity();
    }

    getEnergyProduced() {
        return this.reactorPeripheral.getEnergyProducedLastTick();
    }

    getWaterStored() {
        return this.reactorPeripheral.getCoolantAmount();
    }

    getSteamStored() {
        return this.reactorPeripheral.getHotFluidAmount();
    }

    getCoolantCapacity() {
        return this.reactorPeripheral.getCoolantAmountMax();
    }

    getCoolantTransitioned() {
        return this.reactorPeripheral.getHotFluidProducedLastTick();
    }

    getFuelCapacity() {
        return this.reactorPeripheral.getFuelAmountMax();
    }

    getFuelStored() {
        return this.reactorPeripheral.getFuelAmount();
    }

    getWasteStored() {
        return this.reactorPeripheral.getWasteAmount();
    }

    ejectWaste() {
        this.reactorPeripheral.doEjectWaste();
    }

    getFuelReactivity() {
        return this.reactorPeripheral.getFuelReactivity();
    }

    getFuelConsumed() {
        return this.reactorPeripheral.getFuelConsumedLastTick();
    }

    getControlRodCount() {
        return this.reactorPeripheral.getNumberOfControlRods();
    }

    setAllControlRods(level: number) {
        print("Setting all control rods to level: " + level);
        this.reactorPeripheral.setAllControlRodLevels(level);
    }

    getControlRodLevel(index: number) {
        return this.reactorPeripheral.getControlRodLevel(index);
    }

    setControlRodLevel(index: number, level: number) {
        this.reactorPeripheral.setControlRodLevel(index, level);
    }

    getControlRodName(index: number) {
        return this.reactorPeripheral.getControlRodName(index);
    }

    setControlRodName(index: number, name: string) {
        this.reactorPeripheral.setControlRodName(index, name);
    }

    getFuelTemperature() {
        return this.reactorPeripheral.getFuelTemperature();
    }

    getCasingTemperature() {
        return this.reactorPeripheral.getCasingTemperature();
    }
}
