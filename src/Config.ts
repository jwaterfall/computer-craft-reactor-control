export interface ReactorConfig {
    name: string;
    monitor: string;
    controlRodLevel: number;
}

export interface TurbineConfig {
    name: string;
    monitor: string;
    targetFlowRate: number;
}

export interface Config {
    autoOnPercentage: number;
    autoOffPercentage: number;
    monitorUpdateInterval: number;
    reactor: ReactorConfig;
    turbines: TurbineConfig[];
}

export function loadConfig() {
    const file = fs.open("config.json", "r")[0]!;
    const data = file.readAll();
    file.close();

    return textutils.unserializeJSON(data) as Config;
}

export function saveConfig(config: Config) {
    const file = fs.open("config.json", "w")[0]!;
    file.write(textutils.serialiseJSON(config));
    file.close();
}
