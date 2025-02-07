import { ValidationResult } from "./ValidationResult";
export declare class EditableFieldValidationRule {
    constructor(method: (val: string) => boolean, message: string);
    method: (val: string) => boolean;
    message: string;
}
export declare class EditableFieldValidationRuleSet {
    private _rules;
    get rules(): EditableFieldValidationRule[];
    validate(val: string): ValidationResult;
    lambda(method: (val: string) => boolean, message: string): EditableFieldValidationRuleSet;
    required(message?: string): EditableFieldValidationRuleSet;
    equals(compareTo: string, message?: string): EditableFieldValidationRuleSet;
    startsWith(prefix: string, message?: string): EditableFieldValidationRuleSet;
    endsWith(suffix: string, message?: string): EditableFieldValidationRuleSet;
    equalsRegex(regex: RegExp, message?: string): EditableFieldValidationRuleSet;
}
