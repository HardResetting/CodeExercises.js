import { EditableFieldValidationRuleSet } from "./EditableFieldValidationRuleSet";
import { ValidationResult } from "./ValidationResult";

export default class EditableField {
    private readonly _ruleset: EditableFieldValidationRuleSet = new EditableFieldValidationRuleSet();
    public get addValidationRule() {return this._ruleset};
    public range: [number, number, number, number];
    public allowMultiline: boolean;
    public id: string;

    constructor(range: [number, number, number, number], allowMultiline: boolean = false) {
        this.range = range;
        this.allowMultiline = allowMultiline;
        this.id = crypto.randomUUID();
    }

    public validate(content: string): ValidationResult {
        return this._ruleset.validate(content);
    }
}