import EditableField from "./EditableField";
import { Event } from "./Event";
import { MonacoEditor } from "./MonacoEditor";
import { IValidationRule, IValidationRuleSet } from "./Validation";
import { ValidationResult } from "./ValidationResult";
export declare abstract class Excercise<RuleType extends IValidationRule, RuleSetType extends IValidationRuleSet<RuleType>> {
    protected _editableFields: EditableField[];
    protected abstract readonly _ruleSet: RuleSetType;
    protected readonly _monacoEditorInstance: MonacoEditor;
    readonly onValidate: Event<ValidationResult>;
    get content(): string;
    get addValidationRule(): RuleSetType;
    constructor(monacoEditorElement: HTMLElement, content?: string);
    setEditableFields(fields: EditableField[]): void;
    clearEditableFields(): void;
    validate(): ValidationResult;
    /**
     * Override this method to add custom validation
     */
    protected abstract validateExtend(): ValidationResult;
    private editableFieldsChanged;
}
