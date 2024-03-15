export class Monitor {
    private monitorPeripheral: MonitorPeripheral;

    constructor(private name: string) {
        this.monitorPeripheral = peripheral.wrap(name) as MonitorPeripheral;
        this.monitorPeripheral.setTextScale(0.5);
    }

    getName() {
        return this.name;
    }

    public getWidth(): number {
        return this.monitorPeripheral.getSize()[0];
    }

    public getHeight(): number {
        return this.monitorPeripheral.getSize()[1];
    }

    public clear() {
        this.monitorPeripheral.setBackgroundColor(colors.black);
        this.monitorPeripheral.setTextColor(colors.white);
        this.monitorPeripheral.clear();
    }

    public drawText(x: number, y: number, text: string, bgColor: Color = colors.black, textColor: Color = colors.white): void {
        this.monitorPeripheral.setTextColor(textColor);
        this.monitorPeripheral.setBackgroundColor(bgColor);
        this.monitorPeripheral.setCursorPos(x, y);
        this.monitorPeripheral.write(text);
        this.monitorPeripheral.setBackgroundColor(colors.black);
        this.monitorPeripheral.setTextColor(colors.white);
    }

    public drawRectangle(x: number, y: number, width: number, height: number, bgColor: Color = colors.gray): void {
        this.monitorPeripheral.setBackgroundColor(bgColor);
        this.monitorPeripheral.setCursorPos(x, y);

        for (let i = 0; i < height; i++) {
            this.monitorPeripheral.write(" ".repeat(width));
            this.monitorPeripheral.setCursorPos(x, y + i + 1);
        }

        this.monitorPeripheral.setBackgroundColor(colors.black);
    }
}
