import { TurbinePeripheral } from "./Peripheral";

export class Turbine {
    private turbinePeripheral: TurbinePeripheral;

    constructor(private name: string) {
        this.turbinePeripheral = peripheral.wrap(name) as TurbinePeripheral;
    }

    getName() {
        return this.name;
    }

    getApiVersion() {
        return this.turbinePeripheral.apiVersion();
    }

    getIsConnected() {
        return this.turbinePeripheral.connected();
    }

    getIsActive() {
        return this.turbinePeripheral.active();
    }

    setIsActive(active: boolean) {
        this.turbinePeripheral.setActive(active);
    }

    getEnergyStored() {
        return this.turbinePeripheral.battery().stored();
    }

    getEnergyCapacity() {
        return this.turbinePeripheral.battery().capacity();
    }

    getEnergyProduced() {
        return this.turbinePeripheral.battery().producedLastTick();
    }

    getRotorSpeed() {
        return this.turbinePeripheral.rotor().RPM();
    }

    getRotorEfficiency() {
        return this.turbinePeripheral.rotor().efficiencyLastTick();
    }

    getSteamStored() {
        return this.turbinePeripheral.fluidTank().input().amount();
    }

    getSteamCapacity() {
        return this.turbinePeripheral.fluidTank().input().maxAmount();
    }

    getWaterStored() {
        return this.turbinePeripheral.fluidTank().output().amount();
    }

    getWaterCapacity() {
        return this.turbinePeripheral.fluidTank().output().maxAmount();
    }

    getFlowRate() {
        return this.turbinePeripheral.fluidTank().flowLastTick();
    }

    getTargetFlowRate() {
        return this.turbinePeripheral.fluidTank().nominalFlowRate();
    }

    setTargetFlowRate(rate: number) {
        this.turbinePeripheral.fluidTank().setNominalFlowRate(rate);
    }

    getFlowRateLimit() {
        return this.turbinePeripheral.fluidTank().flowRateLimit();
    }

    getIsCoilEngaged() {
        return this.turbinePeripheral.coilEngaged();
    }

    setIsCoilEngaged(engaged: boolean) {
        this.turbinePeripheral.setCoilEngaged(engaged);
    }
}
