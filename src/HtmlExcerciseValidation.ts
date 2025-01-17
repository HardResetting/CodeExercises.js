import { Validation } from "./Validation";
import { ValidationResult } from "./ValidationResult";

export class HtmlExcerciseValidation extends Validation<HtmlValidationRuleSet> {
    constructor() {
        super(HtmlValidationRuleSet);
    }

    validate(stringVal: string, iframeDoc: Document): ValidationResult {
        const errors: string[] = [];

        for (const rule of this._validationRuleSet.rules) {
            if (!rule.method(stringVal, iframeDoc)) {
                errors.push(rule.message);
            }
        }

        return new ValidationResult(errors);
    }
}

class HtmlValidationRule {
    constructor(method: (val: string, iframeDoc: Document) => boolean, message: string) {
        this.method = method;
        this.message = message;
    }

    method: (val: string, iframeDoc: Document) => boolean;
    message: string;
}

export class HtmlValidationRuleSet {
    private _rules: HtmlValidationRule[] = [];
    get rules() {
        return this._rules;
    }

    lambda(
        method: (val: string, iframeDoc: Document) => boolean,
        message: string
    ): HtmlValidationRuleSet {
        this._rules.push(new HtmlValidationRule(method, message));
        return this;
    }

    required(message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val.length > 0,
            message || "String field is required."
        );
    }

    stringEquals(compareTo: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val === compareTo,
            message || `String field must equal '${compareTo}'.`
        );
    }

    stringIncludes(searchString: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val.includes(searchString),
            message ?? `String must includes ${searchString}`
        );
    }

    iframeContains(selector: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (_: string, iframeDoc: Document) => iframeDoc.querySelector(selector) !== null,
            message || `IFrame must contain an element matching '${selector}'.`
        );
    }

    iframeMatches(
        testFunc: (iframeDoc: Document) => boolean,
        message?: string
    ): HtmlValidationRuleSet {
        return this.lambda(
            (_: string, iframeDoc: Document) => testFunc(iframeDoc),
            message || "IFrame validation failed."
        );
    }

    stringMatchesRegex(regex: RegExp, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => regex.test(val),
            message || `String must match the pattern '${regex.toString()}'.`
        );
    }
}
