import EditableField from "./EditableField";
import { Event } from "./Event";
import { MonacoEditor } from "./MonacoEditor";
import { IValidationRule, IValidationRuleSet } from "./Validation";
import { ValidationResult } from "./ValidationResult";

export abstract class Excercise<RuleType extends IValidationRule, RuleSetType extends IValidationRuleSet<RuleType>> {
    protected _editableFields: EditableField[];
    protected abstract readonly _ruleSet: RuleSetType;
    protected readonly _monacoEditorInstance: MonacoEditor;

    public readonly onValidate = new Event<ValidationResult>();

    public get content(): string {
        return this._monacoEditorInstance.content;
    }

    public get addValidationRule(): RuleSetType {
        return this._ruleSet;
    }

    constructor(monacoEditorElement: HTMLElement, content?: string) {
        this._editableFields = [];
        this._monacoEditorInstance = new MonacoEditor(monacoEditorElement, content, "html");

        this._monacoEditorInstance.onChangeContext.on(() => {
            this.validate();
        })
    }

    public setEditableFields(fields: EditableField[]) {
        this._editableFields = fields;
        this.editableFieldsChanged();
    }

    public clearEditableFields(): void {
        this._editableFields.length = 0;
        this.editableFieldsChanged();
    }

    public validate(): ValidationResult {
        const rangeValues = this._monacoEditorInstance.rangeValues;
        const result = this._editableFields
            .map(e => {
                const val = rangeValues[e.id];
                if (val == null) {
                    throw "Unexpected missing value in ranges!";
                }

                return e.validate(val);
            })
            .concat(this.validateExtend())
            .reduce((prev, cur) => new ValidationResult(prev.errors.concat(cur.errors)));

        this.onValidate.trigger(result);
        return result;
    }

    /**
     * Override this method to add custom validation
     */
    protected abstract validateExtend(): ValidationResult;

    private editableFieldsChanged(): void {
        const list: RangeRestriction[] = [];
        this._editableFields.forEach(x => {
            list.push({ range: x.range, allowMultiline: x.allowMultiline, label: x.id } as RangeRestriction);
        });

        this._monacoEditorInstance.setRanges(list);
    }
}