export declare class ValidationResult {
    valid: boolean;
    errors?: string[];
    constructor(valid: boolean, errors?: string[]);
}
export declare class HtmlExcerciseValidation {
    constructor();
    private rules;
    addValidation(rule: HtmlExcerciseValidationRule): void;
    validate(stringVal: string, iframeDoc: Document): ValidationResult;
}
export interface HtmlExcerciseValidationRule {
    test(value: string, iframeDoc: Document): boolean;
    message: string;
}
export declare class StringExpression implements HtmlExcerciseValidationRule {
    func: (val: string) => boolean;
    message: string;
    constructor(func: (val: string) => boolean, message?: string);
    test(value: string): boolean;
}
export declare class IFrameExpression implements HtmlExcerciseValidationRule {
    func: (iframeDoc: Document) => boolean;
    message: string;
    constructor(func: (iframeDoc: Document) => boolean, message?: string);
    test(_: string, iframeDoc: Document): boolean;
}
