import EditableField from "./EditableField";
import Event from "./Event";
import { MonacoEditor } from "./MonacoEditor";
import ValidationRuleSet from "./Validation";
import IValidationRule from "./IValidationRule";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { select } from 'optimal-select';
import ValidationResultGroup from "./ValidationResultGroup";
import ValidationResultSummary from "./ValidationSummary";

export default abstract class Excercise<RuleType extends IValidationRule, RuleSetType extends ValidationRuleSet<RuleType>> {
    protected _editableFields: EditableField[];
    protected abstract readonly _ruleSets: RuleSetType[];
    protected readonly _monacoEditorInstance: MonacoEditor;
    protected readonly id: string

    constructor(monacoEditorElement: HTMLElement, content?: string, monacoConfig?: editor.IStandaloneEditorConstructionOptions) {
        this.id = select(monacoEditorElement);

        this._editableFields = [];
        this._monacoEditorInstance = new MonacoEditor(monacoEditorElement, content, { language: "html", ...monacoConfig });

        this._monacoEditorInstance.onChangeContext.on(() => {
            this.validate();
        })
    }

    public abstract addValidationRule(): RuleSetType;

    protected abstract validateRule(rule: RuleType): Promise<boolean> | boolean;

    public readonly onValidate = new Event<ValidationResultSummary>();

    public get content(): string {
        return this._monacoEditorInstance.content;
    }

    public get monacoEditorInstance(): editor.IStandaloneCodeEditor {
        return this._monacoEditorInstance.editorInstance;
    }

    public setEditableFields(fields: EditableField[]) {
        this._editableFields = fields;
        this.editableFieldsChanged();
    }

    public clearEditableFields(): void {
        this._editableFields.length = 0;
        this.editableFieldsChanged();
    }

    public async validate(): Promise<ValidationResultSummary> {
        const rangeValues = this._monacoEditorInstance.rangeValues;
        const results = this._editableFields
            .map(e => {
                const val = rangeValues[e.id];
                if (val == null) {
                    throw "Unexpected missing value in ranges!";
                }

                return e.validate(val);
            })
            .concat((await this.validateExtend()))
            .flat();

        const summary = new ValidationResultSummary(results);
        this.onValidate.trigger(summary);
        return summary;
    }

    /**
     * Override this method to add custom validation
     */
    protected abstract validateExtend(): Promise<Array<ValidationResultGroup>>;

    private editableFieldsChanged(): void {
        const list: RangeRestriction[] = [];
        this._editableFields.forEach(x => {
            list.push({ range: x.range, allowMultiline: x.allowMultiline, label: x.id } as RangeRestriction);
        });

        this._monacoEditorInstance.setRanges(list);
    }
}