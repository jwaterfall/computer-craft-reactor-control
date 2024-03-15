export interface MonitorTouchEvent {
    monitor: string;
    x: number;
    y: number;
}

export function getMonitorTouchEvent(): MonitorTouchEvent {
    const event = os.pullEvent("monitor_touch");

    return {
        monitor: event[1],
        x: event[2],
        y: event[3]
    };
}