import EditableFieldValidationRuleSet from "./EditableFieldValidationRuleSet";
import ValidationResultGroup from "./ValidationResultGroup";
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

    public validate(content: string): ValidationResultGroup[] {
        const validationResults: ValidationResultGroup[] = [];

        for (const ruleSet of this._ruleSets) {
            const results: ValidationResult[] = [];
            for (const rule of ruleSet.rules) {

                const valid = rule.method(content);
                const result = new ValidationResult(rule.message, valid ? "valid" : "invalid")
                results.push(result);
                if (!valid && ruleSet.shouldStopOnFail) {
                    break;
                }
            }
            const resultGroup = new ValidationResultGroup(this.id, results)
            validationResults.push(resultGroup);
        }
        return validationResults;
    }
}