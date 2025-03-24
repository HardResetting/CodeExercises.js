import { editor } from "monaco-editor";
import Event from "./Event";
import * as debounce from "debounce";

export class onChangeContextData {
    constructor(content: string, rangeValues: ValueInEditableRanges) {
        this.content = content;
        this.rangeValues = rangeValues;
    }

    public content: string;
    public rangeValues: ValueInEditableRanges;
}

const debounceTime = 200; // ms
export class MonacoEditor {
    protected _rangeRestrictions: RangeRestriction[] = [];
    protected readonly _editorInstance: editor.IStandaloneCodeEditor;
    protected readonly _constrainedInstance: ConstrainedEditor;
    protected readonly restrictions: RangeRestriction[] = [];
    private _previousRestrictionLength: number = 0;
    public readonly onChangeContext = new Event<onChangeContextData>();

    private get _model(): editor.ITextModel {
        const model = this._editorInstance.getModel();
        if (model == null) {
            throw "missing moddel";
        }

        return model;
    }

    public get content() {
        return this._model.getValue();
    }

    public get editorInstance() {
        return this._editorInstance;
    }

    public get rangeValues(): ValueInEditableRanges {
        let values: ValueInEditableRanges = {};
        if (this._rangeRestrictions.length > 0) {
            values = (this._model as unknown as ExtendedModel).getValueInEditableRanges();
        }

        return values;
    }

    constructor(element: HTMLElement, content?: string, config?: editor.IStandaloneEditorConstructionOptions) {
        const options: editor.IStandaloneEditorConstructionOptions = { value: content, ...config };

        this._editorInstance = monaco.editor.create(element, options);

        this._constrainedInstance = constrainedEditor(monaco);
        this._constrainedInstance.initializeIn(this._editorInstance);

        const callback = debounce(() => {
            this.onChangeContext.trigger(new onChangeContextData(this.content, this.rangeValues))
        }, debounceTime);
        this._model.onDidChangeContent(callback);
    }

    protected changeRanges(): void {
        if (this._rangeRestrictions.length === this._previousRestrictionLength) {
            return;
        }

        if (this._previousRestrictionLength > 1) {
            this._constrainedInstance.removeRestrictionsIn(this._model);
        }

        this._constrainedInstance!.addRestrictionsTo(this._model, this._rangeRestrictions);
        this._previousRestrictionLength = this._rangeRestrictions.length;
    }

    public setRanges(rangeRestrictions: RangeRestriction[]): void {
        this._rangeRestrictions = rangeRestrictions;
        this.changeRanges();
    }

    public clearRanges(): void {
        this._rangeRestrictions.length = 0;
        this.changeRanges();
    }
}