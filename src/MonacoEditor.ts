import { editor } from "monaco-editor";
import { Event } from "./Event";

export class onChangeContextData {
    constructor(content: string, rangeValues: string[]) {
        this.content = content;
        this.rangeValues = rangeValues;
    }

    public content: string;
    public rangeValues: string[];
}

export type supportedLanguage = "javascript" | "html" | "json" | "css" | "scss" | "less" | "handlebars" | "razor" | "typescript";

export class MonacoEditor {
    protected _rangeRestrictions: RangeRestriction[] = [];
    protected _editorInstance?: editor.IStandaloneCodeEditor;
    protected _constrainedInstance?: ConstrainedEditor;
    public onChangeContext = new Event<onChangeContextData>();

    constructor(element: HTMLElement, content?: string, language?: supportedLanguage) {
        const range = {
            range: [11, 1, 11, 23], // Range of Function definition
            allowMultiline: true,
            label: "styleText"
        } as RangeRestriction;

        this._rangeRestrictions.push(range);

        this._editorInstance = monaco.editor.create(element, {
            value: content,
            language: language
        });

        this._constrainedInstance = constrainedEditor(monaco);

        const model = this._editorInstance.getModel();
        if (model == null) {
            throw "missing moddel";
        }


        this._constrainedInstance.initializeIn(this._editorInstance);
        this.changeRanges();

        model.onDidChangeContent(() => {
            content = model.getValue();

            let values: string[] = [];
            if (this._rangeRestrictions.length > 0) {
                values = (model as unknown as ExtendedModel).getValueInEditableRanges();
                console.log("change:editable-ranges", values);
            }

            this.onChangeContext.trigger(new onChangeContextData(content, values));
        });

    }
    protected changeRanges(): void {
        if (this._rangeRestrictions.length < 1) {
            return;
        }

        const model = this._editorInstance!.getModel();
        this._constrainedInstance!.addRestrictionsTo(model!, this._rangeRestrictions);
    }

    protected restrictions: RangeRestriction[] = [];
}