import EditableFieldValidationRule from "./EditableFieldValidationRule";
import ValidationRuleSet from "./Validation";
import ValidationResult from "./ValidationResult";

export default class EditableFieldValidationRuleSet extends ValidationRuleSet<EditableFieldValidationRule> {
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
        if (this._negateNext) {
            this._negateNext = false;
            const negatedMethod = (val: string) => !(method(val));
            this._rules.push(new EditableFieldValidationRule(negatedMethod, message));
        } else {
            this._rules.push(new EditableFieldValidationRule(method, message));
        }
        return this;
    }

    required(message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val.length > 0,
            message ?? (this._negateNext ? "Field should be empty" : "Field is required")
        );
    }

    equals(compareTo: string, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val === compareTo,
            message ?? (this._negateNext ? `Field must not equal '${compareTo}'.` : `Field must equal '${compareTo}'.`)
        );
    }

    startsWith(prefix: string, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val.startsWith(prefix),
            message ?? (this._negateNext ? `Field must not start with '${prefix}'.` : `Field must start with '${prefix}'.`)
        );
    }

    endsWith(suffix: string, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => val.endsWith(suffix),
            message ?? (this._negateNext ? `Field must not end with '${suffix}'.` : `Field must end with '${suffix}'.`)
        );
    }

    equalsRegex(regex: RegExp, message?: string): EditableFieldValidationRuleSet {
        return this.lambda(
            (val: string) => regex.test(val),
            message ?? (this._negateNext ? `Field must not match the pattern '${regex.toString()}'.` : `Field must match the pattern '${regex.toString()}'.`)
        );
    }
}