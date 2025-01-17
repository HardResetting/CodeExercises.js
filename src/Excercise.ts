import EditableField from "./EditableField";
import { EditableFieldValidationRuleSet } from "./EditableFieldValidation";
import { Event } from "./Event";
import { HtmlValidationRuleSet } from "./HtmlExcerciseValidation";
import { MonacoEditor } from "./MonacoEditor";
import { ValidationResult } from "./ValidationResult";

export abstract class Excercise<ExcerciseType extends { get validationRuleSet(): HtmlValidationRuleSet }> {
    protected _editableFields: EditableField[];
    protected readonly _validation: ExcerciseType;
    protected readonly _monacoEditorInstance: MonacoEditor;

    public readonly onValidate = new Event<ValidationResult>();

    public get content(): string {
        return this._monacoEditorInstance.content;
    }

    public get validationRuleSet() {
        return this._validation.validationRuleSet;
    }

    constructor(ExcerciseTypeConstructor: new () => ExcerciseType, monacoEditorElement: HTMLElement, content?: string) {
        this._validation = new ExcerciseTypeConstructor();
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