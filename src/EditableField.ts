export type Range = [number, number, number, number];

export default abstract class EditableField {
    constructor(range: Range) {
        this.range = range;
    }

    get numericId(): number {
        return 0;
    }

    public range: Range;

    isValid(): boolean {
        return true;
    }
}