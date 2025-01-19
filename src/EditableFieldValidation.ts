import { ValidationResult } from "./ValidationResult";

export class EditableFieldValidationRule {
    constructor(method: (val: string) => boolean, message: string) {
        this.method = method;
        this.message = message;
    }

    method: (val: string) => boolean;
    message: string;
}

export class EditableFieldValidationRuleSet {
    private _rules: EditableFieldValidationRule[] = [];
    get rules() {
        return this._rules;
    }

    validate(val: string): ValidationResult {
        const errors: string[] = [];

        for (const rule of this._rules) {
            if (!rule.method(val)) {
                errors.push(rule.message);
            }
        }
        return new ValidationResult(errors);
    }

    lambda(method: (val: string) => boolean, message: string): EditableFieldValidationRuleSet {
        this._rules.push(new EditableFieldValidationRule(method, message));
        return this;
    }

    required(message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val.length > 0,
            message || "Field is required."
        );
    }

    equals(compareTo: string, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val === compareTo,
            message || `Field must equal '${compareTo}'.`
        );
    }

    startsWith(prefix: string, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val.startsWith(prefix),
            message || `Field must start with '${prefix}'.`
        );
    }

    endsWith(suffix: string, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val.endsWith(suffix),
            message || `Field must end with '${suffix}'.`
        );
    }

    equalsRegex(regex: RegExp, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => regex.test(val),
            message || `Field must match the pattern '${regex.toString()}'.`
        );
    }
}