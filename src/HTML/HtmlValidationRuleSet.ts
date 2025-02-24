import { color2Lab } from "../Color";
import { ValidationRuleSet } from "../Validation";
import { HtmlValidationRule } from "./HtmlValidationRule";
import { getDeltaE00 } from "delta-e"

export class HtmlValidationRuleSet extends ValidationRuleSet<HtmlValidationRule> {
    private _rules: HtmlValidationRule[] = [];
    get rules(): ReadonlyArray<HtmlValidationRule> {
        return this._rules as ReadonlyArray<HtmlValidationRule>;
    }

    lambda(
        method: (val: string, iframeDoc: Document) => boolean | Promise<boolean>,
        message: string
    ): HtmlValidationRuleSet {
        if (this._negateNext) {
            this._negateNext = false;
            const negatedMethod = async (val: string, iframeDoc: Document) => !(await method(val, iframeDoc));
            this._rules.push(new HtmlValidationRule(negatedMethod, `Negated: ${message}`));
        } else {
            this._rules.push(new HtmlValidationRule(method, message));
        }
        return this;
    }

    required(message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val.length > 0,
            message ?? "String field is required."
        );
    }

    isValidHtml(message?: string) {
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
            message ?? "Invalid HTML."
        )
    }

    stringEquals(compareTo: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val === compareTo,
            message ?? `String field must equal '${compareTo}'.`
        );
    }

    contentIncludes(searchString: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => val.includes(searchString),
            message ?? `String must includes ${searchString}`
        );
    }

    iframeContains(selector: string, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (_: string, iframeDoc: Document) => iframeDoc.querySelector(selector) !== null,
            message ?? `IFrame must contain an element matching '${selector}'.`
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
            message ?? `Element '${selector}' is missig, has no property ${property} or does not have color '${color}'.`
        )
    }

    elementIncludesText(selector: string, text: string, message?: string) {
        return this.lambda(
            (_: string, iframeDoc: Document) => {
                const elem = iframeDoc.querySelector(selector);
                if (elem == null) {
                    return false;
                }

                return (elem as HTMLElement).innerText.includes(text);
            },
            message ?? `Element '${selector}' is missig or text does not match ${text}.`
        )
    }

    stringMatchesRegex(regex: RegExp, message?: string): HtmlValidationRuleSet {
        return this.lambda(
            (val: string) => regex.test(val),
            message ?? `String must match the pattern '${regex.toString()}'.`
        );
    }
}
