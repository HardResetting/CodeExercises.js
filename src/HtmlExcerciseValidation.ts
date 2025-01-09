export class ValidationResult {
    valid: boolean;
    errors?: string[];
    constructor(valid: boolean, errors?: string[]) {
        this.valid = valid;
        this.errors = errors;
    }
}

export class HtmlExcerciseValidation {
    constructor() { }
    private rules: HtmlExcerciseValidationRule[] = [];

    addValidation(rule: HtmlExcerciseValidationRule) {
        this.rules.push(rule);
    }

    validate(stringVal: string, iframeDoc: Document): ValidationResult {
        const errors: string[] = [];
        for (const rule of this.rules) {
            if (!rule.test(stringVal, iframeDoc)) {
                errors.push(rule.message);
            }
        }

        return new ValidationResult(errors.length < 1, errors);
    }
}

export interface HtmlExcerciseValidationRule {
    test(value: string, iframeDoc: Document): boolean;
    message: string;
}

export class StringExpression implements HtmlExcerciseValidationRule {
    func: (val: string) => boolean;
    message: string;

    constructor(func: (val: string) => boolean, message?: string) {
        this.func = func;
        this.message = message ?? "StringExpression failed!";
    }

    test(value: string): boolean {
        return this.func(value);
    }
}

export class IFrameExpression implements HtmlExcerciseValidationRule {
    func: (iframeDoc: Document) => boolean;
    message: string;

    constructor(func: (iframeDoc: Document) => boolean, message?: string) {
        this.func = func;
        this.message = message ?? "IFrameExpression failed!";
    }

    test(_: string, iframeDoc: Document): boolean {
        return this.func(iframeDoc);
    }
}