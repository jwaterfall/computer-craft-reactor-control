export function floor(value: number, precision = 2): number {
    const power = Math.pow(10, precision);
    return Math.floor(value * power) / power;
}