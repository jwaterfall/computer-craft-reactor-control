import { TurbinePeripheral } from "./Peripheral";

export class Turbine {
  constructor(private turbinePeripheral: TurbinePeripheral) {}

  getName() {
    return peripheral.getName(this.turbinePeripheral);
  }

  getIsActive() {
    return this.turbinePeripheral.getActive();
  }

  setIsActive(active: boolean) {
    this.turbinePeripheral.setActive(active);
  }

  getEnergyStored() {
    return this.turbinePeripheral.getEnergyStored();
  }

  getEnergyCapacity() {
    return this.turbinePeripheral.getEnergyCapacity();
  }

  getEnergyProduced() {
    return this.turbinePeripheral.getEnergyProducedLastTick();
  }

  getRotorSpeed() {
    return this.turbinePeripheral.getRotorSpeed();
  }

  getRotorEfficiency() {
    return this.turbinePeripheral.getBladeEfficiency();
  }

  getSteamStored() {
    return this.turbinePeripheral.getInputAmount();
  }

  getSteamCapacity() {
    return this.turbinePeripheral.getFluidAmountMax();
  }

  getWaterStored() {
    return this.turbinePeripheral.getOutputAmount();
  }

  getWaterCapacity() {
    return this.turbinePeripheral.getFluidAmountMax();
  }

  getFlowRate() {
    return this.turbinePeripheral.getFluidFlowRate();
  }

  getTargetFlowRate() {
    return this.turbinePeripheral.getFluidFlowRateMax();
  }

  setTargetFlowRate(rate: number) {
    this.turbinePeripheral.setFluidFlowRateMax(rate);
  }

  getFlowRateLimit() {
    return this.turbinePeripheral.getFluidFlowRateMaxMax();
  }

  getIsCoilEngaged() {
    return this.turbinePeripheral.getInductorEngaged();
  }

  setIsCoilEngaged(engaged: boolean) {
    this.turbinePeripheral.setInductorEngaged(engaged);
  }
}
