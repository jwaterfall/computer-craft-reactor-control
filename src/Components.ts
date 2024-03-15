import { Monitor } from "./Monitor";
import { MonitorTouchEvent } from "./Event";

export default interface Component {
    render(monitor: Monitor, x: number, y: number, width: number, height: number): void;
}

export class Page implements Component {
    public constructor(private title: string, private child: Component, private padding = 1) {}

    public render(monitor: Monitor): void {
        const width = monitor.getWidth();
        const height = monitor.getHeight();

        monitor.drawRectangle(1, 1, width, 1, colors.blue);
        monitor.drawText(Math.floor((width - this.title.length) / 2), 1, this.title, colors.blue, colors.white);

        this.child.render(monitor, 1 + this.padding, 2 + this.padding, width - this.padding * 2, height - this.padding * 2 - 1);
    }
}

export class HorizontalLayout implements Component {
    public constructor(private children: Component[], private gap = 1) {}

    public render(monitor: Monitor, x: number, y: number, width: number, height: number): void {
        const childWidth = Math.floor((width - (this.children.length - 1) * this.gap) / this.children.length);
        const remainingWidth = width - childWidth * this.children.length - this.gap * (this.children.length - 1);
        const extraGap = Math.floor(remainingWidth / (this.children.length - 1));

        this.children.forEach((child, index) => {
            child.render(monitor, x + index * (childWidth + this.gap + extraGap), y, childWidth, height);
        });
    }
}

export class VerticalLayout implements Component {
    public constructor(private children: Component[], private gap = 1) {}

    public render(monitor: Monitor, x: number, y: number, width: number, height: number): void {
        const childHeight = Math.floor((height - (this.children.length - 1) * this.gap) / this.children.length);

        this.children.forEach((child, index) => {
            child.render(monitor, x, y + index * (childHeight + this.gap), width, childHeight);
        });
    }
}

export class Section implements Component {
    public constructor(private title: string, private child: Component, private padding = 1) {}

    public render(monitor: Monitor, x: number, y: number, width: number, height: number): void {
        monitor.drawRectangle(x, y, width, height);
        monitor.drawRectangle(x + 1, y + 1, width - 2, height - 2, colors.black);
        monitor.drawText(x + 2, y, ` ${this.title} `);

        this.child.render(monitor, x + this.padding + 1, y + this.padding + 1, width - this.padding * 2 - 2, height - this.padding * 2 - 2);
    }
}

export class ProgressBar implements Component {
    public constructor(private value: number, private limit: number, private title: string, private color: Color) {}

    public render(monitor: Monitor, x: number, y: number, width: number, height: number): void {
        const percentage = this.value / this.limit;
        const barWidth = Math.min(Math.floor(percentage * width), width);

        monitor.drawText(x + 1, y, `${this.title} ${Math.round(percentage * 100)}%`);
        monitor.drawRectangle(x, y + 1, width, height - 1);
        monitor.drawRectangle(x, y + 1, barWidth, height - 1, this.color);
    }
}

type HorizontalAlignment = 'left' | 'center' | 'right';

export class Text implements Component {
    public constructor(private text: string, private color: Color = colors.white, private horizontalAlignment: HorizontalAlignment = 'left') {}

    public render(monitor: Monitor, x: number, y: number, width: number, height: number): void {
        let textX: number;
        if (this.horizontalAlignment === 'center') {
            textX = x + Math.floor((width - this.text.length) / 2);
        } else if (this.horizontalAlignment === 'right') {
            textX = x + width - this.text.length;
        } else {
            textX = x;
        }

        const textLines = this.wrapText(this.text, width);

        const lineHeight = Math.min(Math.floor(height / textLines.length), 1);
        const textY = y + Math.floor((height - lineHeight * textLines.length) / 2);

        textLines.forEach((line, index) => {
            monitor.drawText(textX, textY + lineHeight * index, line, colors.black, this.color);
        });
    }

    private wrapText(text: string, width: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word, index) => {
            const potentialLine = currentLine + ' ' + word;
            if (potentialLine.trim().length <= width) {
                currentLine = potentialLine.trim();
            } else {
                lines.push(currentLine);
                currentLine = word;
            }

            if (index === words.length - 1) {
                lines.push(currentLine);
            }
        });

        return lines;
    }
}


export class Button implements Component {
    public constructor(private title: string, private callback: () => void, private event?: MonitorTouchEvent, private color: Color = colors.blue) {}

    public render(monitor: Monitor, x: number, y: number, width: number, height: number): void {
        const newHeight = height % 2 === 0 ? height - 1 : height;
        const textX = x + Math.floor((width - this.title.length) / 2);
        const textY = y + Math.floor((newHeight - 1) / 2);

        monitor.drawRectangle(x, y, width, newHeight, this.color);
        monitor.drawText(textX, textY, this.title, this.color);

        if (!this.event) return;

        const mouseX = this.event.x;
        const mouseY = this.event.y;

        if (mouseX >= x && mouseX < x + width && mouseY >= y && mouseY < y + newHeight) {
            this.callback();
        }
    }
}
