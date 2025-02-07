import { EditableFieldValidationRuleSet } from "./EditableFieldValidation";
import { ValidationResult } from "./ValidationResult";
export default class EditableField {
    private readonly _ruleset;
    get addValidationRule(): EditableFieldValidationRuleSet;
    range: [number, number, number, number];
    allowMultiline: boolean;
    id: string;
    constructor(range: [number, number, number, number], allowMultiline?: boolean);
    validate(content: string): ValidationResult;
}
