import { ValidationResult } from "./ValidationResult";

export class EditableFieldValidation {
    constructor() {
        this._validationRuleSet = new ValidationRuleSet();
    }

    private _validationRuleSet: ValidationRuleSet;

    get validationRuleSet() {
        return this._validationRuleSet;
    };

    validate(val: string): ValidationResult {
        const errors: string[] = [];

        for (const rule of this._validationRuleSet.rules) {
            if (!rule.method(val)) {
                errors.push(rule.message);
            }
        }
        return new ValidationResult(errors.length > 0, errors);
    }
}

class EditableFieldValidationRule {
    constructor(method: (val: string) => boolean, message: string) {
        this.method = method;
        this.message = message;
    }

    method: (val: string) => boolean;
    message: string;
}

export class ValidationRuleSet {
    private _rules: EditableFieldValidationRule[] = [];
    get rules() {
        return this._rules;
    }

    lambda(method: (val: string) => boolean, message: string): ValidationRuleSet {
        this._rules.push(new EditableFieldValidationRule(method, message));
        return this;
    }

    required(message?: string): ValidationRuleSet {
        return this.lambda(
            (val: string) => val.length > 0,
            message || "Field is required."
        );
    }

    equals(compareTo: string, message?: string): ValidationRuleSet {
        return this.lambda(
            (val: string) => val === compareTo,
            message || `Field must equal '${compareTo}'.`
        );
    }

    startsWith(prefix: string, message?: string): ValidationRuleSet {
        return this.lambda(
            (val: string) => val.startsWith(prefix),
            message || `Field must start with '${prefix}'.`
        );
    }

    endsWith(suffix: string, message?: string): ValidationRuleSet {
        return this.lambda(
            (val: string) => val.endsWith(suffix),
            message || `Field must end with '${suffix}'.`
        );
    }

    equalsRegex(regex: RegExp, message?: string): ValidationRuleSet {
        return this.lambda(
            (val: string) => regex.test(val),
            message || `Field must match the pattern '${regex.toString()}'.`
        );
    }
}