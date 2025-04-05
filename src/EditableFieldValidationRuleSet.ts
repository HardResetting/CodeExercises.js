import EditableFieldValidationRule from "./EditableFieldValidationRule";
import ValidationRuleSet from "./Validation";
import ValidationResultGroup from "./ValidationResultGroup";
import ValidationResult from "./ValidationResult";

export default class EditableFieldValidationRuleSet extends ValidationRuleSet<EditableFieldValidationRule> {
    private _rules: EditableFieldValidationRule[] = [];
    get rules() {
        return this._rules;
    }

    validate(val: string): ValidationResultGroup {
        const results: ValidationResult[] = [];

        let validate = true;
        for (let i = 0; i < this._rules.length; ++i) {
            const rule = this._rules[i];

            console.log(rule.message);
            

            if (validate) {
                const valid = rule.method(val);
                const result = new ValidationResult(rule.message, valid ? "valid" : "invalid");
                results.push(result);

                if (!valid && this.shouldStopOnFail) {
                    validate = false;
                }
            } else {
                const result = new ValidationResult(rule.message);
                results.push(result);
            }
        }

        return new ValidationResultGroup(this.id, results);
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