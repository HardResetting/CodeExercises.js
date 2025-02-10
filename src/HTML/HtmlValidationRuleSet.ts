import { color2Lab } from "../Color";
import { IValidationRuleSet } from "../Validation";
import { HtmlValidationRule } from "./HtmlValidationRule";
import { getDeltaE00 } from "delta-e"

export class HtmlValidationRuleSet implements IValidationRuleSet<HtmlValidationRule> {
    private _rules: HtmlValidationRule[] = [];
    get rules(): ReadonlyArray<HtmlValidationRule> {
        return this._rules as ReadonlyArray<HtmlValidationRule>;
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
            message ?? "String field is required."
        );
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
