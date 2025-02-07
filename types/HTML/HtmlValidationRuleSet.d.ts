import { IValidationRuleSet } from "../Validation";
import { HtmlValidationRule } from "./HtmlValidationRule";
export declare class HtmlValidationRuleSet implements IValidationRuleSet<HtmlValidationRule> {
    private _rules;
    get rules(): ReadonlyArray<HtmlValidationRule>;
    lambda(method: (val: string, iframeDoc: Document) => boolean, message: string): HtmlValidationRuleSet;
    required(message?: string): HtmlValidationRuleSet;
    stringEquals(compareTo: string, message?: string): HtmlValidationRuleSet;
    contentIncludes(searchString: string, message?: string): HtmlValidationRuleSet;
    iframeContains(selector: string, message?: string): HtmlValidationRuleSet;
    elementHasAttributeColor(selector: string, property: string, color: string, delta?: number, message?: string): HtmlValidationRuleSet;
    stringMatchesRegex(regex: RegExp, message?: string): HtmlValidationRuleSet;
}
