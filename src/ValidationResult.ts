export class ValidationResult {
    get valid(): boolean {
        return (this.errors?.length ?? 0) > 0;
    };
    errors: string[];

    constructor(errors?: string[]) {
        this.errors = errors ?? [];
    }
}