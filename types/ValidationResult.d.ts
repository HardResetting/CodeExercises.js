export declare class ValidationResult {
    get valid(): boolean;
    errors: string[];
    constructor(errors?: string[]);
}
