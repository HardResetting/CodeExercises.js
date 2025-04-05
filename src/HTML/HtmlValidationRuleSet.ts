import ValidationResult from "../ValidationResult";
import { color2Lab } from "../Color";
import ValidationRuleSet from "../Validation";
import HtmlValidationRule from "./HtmlValidationRule";
import { getDeltaE00 } from "delta-e"
import ValidationResultGroup from "../ValidationResultGroup";

export default class HtmlValidationRuleSet extends ValidationRuleSet<HtmlValidationRule> {
    private _rules: HtmlValidationRule[] = [];
    get rules(): ReadonlyArray<HtmlValidationRule> {
        return this._rules as ReadonlyArray<HtmlValidationRule>;
    }

    validate(content: string, iframeDoc: Document): ValidationResultGroup {
        const results: ValidationResult[] = [];

        let validate = true;
        for (let i = 0; i < this._rules.length; ++i) {
            const rule = this._rules[i];

            if (validate) {
                const valid = rule.method(content, iframeDoc);
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

    lambda(
        method: (val: string, iframeDoc: Document) => boolean | Promise<boolean>,
        message: string
    ): HtmlValidationRuleSet {
        if (this._negateNext) {
            this._negateNext = false;
            const negatedMethod = async (val: string, iframeDoc: Document) => !(await method(val, iframeDoc));
            this._rules.push(new HtmlValidationRule(negatedMethod, message));
        } else {
            this._rules.push(new HtmlValidationRule(method, message));
        }
        return this;
    }

    required(message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val.length > 0,
            message ?? (this._negateNext ? "String should be empty" : "String field is required")
        );
    }

    isValidHTML(message?: string) {
        return this.lambda(
            async val => {
                let response = { messages: Array<string> };
                try {
                    const uniResponse = await fetch("https://validator.w3.org/nu/?out=json&level=error", {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/html; charset=UTF-8"
                        },
                        body: val
                    });

                    response = await uniResponse.json(); // Get raw text response
                } catch (error) {
                    console.error("Error:", error);
                }
                console.log(response.messages); // Output the response

                return response.messages.length == 0;
            },
            message ?? (this._negateNext ? "Valid HTML" : "Invalid HTML")
        )
    }

    stringEquals(compareTo: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val === compareTo,
            message ?? (this._negateNext ? `String field must not equal '${compareTo}'.` : `String field must equal '${compareTo}'.`)
        );
    }

    contentIncludes(searchString: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val.includes(searchString),
            message ?? (this._negateNext ? `String field must not include '${searchString}'.` : `String field must include '${searchString}'.`)
        );
    }

    iframeContains(selector: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (_: string, iframeDoc: Document) => iframeDoc.querySelector(selector) !== null,
            message ?? (this._negateNext
                ? `IFrame must not contain an element matching '${selector}'.`
                : `IFrame must contain an element matching '${selector}'.`)
        );
    }

    elementHasAttributeColor(selector: string, property: string, color: string, delta: number = 50, message?: string) {
        return this.lambda(
            (_: string, iframeDoc: Document) => {
                const lab1 = color2Lab(color);

                const elem = iframeDoc.querySelector(selector);
                if (elem == null) {
                    return false;
                }

                const compStyles = window.getComputedStyle(elem);
                const propertyStr = compStyles.getPropertyValue(property);
                if (propertyStr == "") {
                    return false;
                }

                const lab2 = color2Lab(propertyStr);
                const deltaResult = getDeltaE00(lab1, lab2);
                console.log(deltaResult);

                return deltaResult <= delta;
            },
            message ?? (this._negateNext
                ? `Element '${selector}' exists, and has property '${property}' and color '${color}'.`
                : `Element '${selector}' is missig, has no property '${property}' or does not have color '${color}'.`
            ))
    }

    elementIncludesText(selector: string, text: string, message?: string) {
        return this.lambda(
            (_: string, iframeDoc: Document) => {
                const elem = iframeDoc.querySelector(selector);
                if (elem == null) {
                    return false;
                }

                return (elem as HTMLElement).innerText.toLowerCase().includes(text.toLowerCase());
            },
            message ?? (this._negateNext
                ? `Element '${selector}' exists and text matches '${text}'.`
                : `Element '${selector}' is missig or text does not match '${text}'.`
            ))
    }

    elementTextMatchesRegex(selector: string, regex: RegExp, message?: string) {
        return this.lambda(
            (_: string, iframeDoc: Document) => {
                const elem = iframeDoc.querySelector(selector);
                if (elem == null) {
                    return false;
                }

                return regex.test((elem as HTMLElement).innerText);
            },
            message ?? (this._negateNext
                ? `Element '${selector}' exists and text matches '${regex}'.`
                : `Element '${selector}' is missig or text does not match '${regex}'.`
            ))
    }

    stringMatchesRegex(regex: RegExp, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => regex.test(val),
            message ?? (this._negateNext
                ? `String matches the pattern '${regex}'.`
                : `String does not match the pattern '${regex}'.`
            ))
    }
}
