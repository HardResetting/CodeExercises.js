import EditableFieldValidationRuleSet from "./EditableFieldValidationRuleSet";
import ValidationResult from "./ValidationResult";

export default class EditableField {
    private readonly _ruleSets: Array<EditableFieldValidationRuleSet> = [];
    public addValidationRule() {
        const obj = new EditableFieldValidationRuleSet();
        this._ruleSets.push(obj);
        return obj;
    };
    public range: [number, number, number, number];
    public allowMultiline: boolean;
    public id: string;

    constructor(range: [number, number, number, number], allowMultiline: boolean = false) {
        this.range = range;
        this.allowMultiline = allowMultiline;
        this.id = crypto.randomUUID();
    }

    public validate(content: string): ValidationResult {
        const errors: string[] = [];

        for (const ruleSet of this._ruleSets) {
            for (const rule of ruleSet.rules) {
                if (!(rule.method(content))) {
                    errors.push(rule.message);
                    if (ruleSet.shouldStopOnFail) {
                        break;
                    }
                }
            }
        }
        return new ValidationResult(errors);
    }
}