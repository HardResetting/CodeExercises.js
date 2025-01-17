import { EditableFieldValidationRuleSet } from "./EditableFieldValidation";
import { ValidationResult } from "./ValidationResult";

export default class EditableField {
    public readonly ruleset: EditableFieldValidationRuleSet = new EditableFieldValidationRuleSet();
    public range: [number, number, number, number];
    public allowMultiline?: boolean;
    public id: string;

    constructor(range: [number, number, number, number], allowMultiline?: boolean) {
        this.range = range;
        this.allowMultiline = allowMultiline;
        this.id = crypto.randomUUID();
    }

    public validate(content: string): ValidationResult {
        return this.ruleset.validate(content);
    }
}