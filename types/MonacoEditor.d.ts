import { editor } from "monaco-editor";
import { Event } from "./Event";
export declare class onChangeContextData {
    constructor(content: string, rangeValues: ValueInEditableRanges);
    content: string;
    rangeValues: ValueInEditableRanges;
}
export type supportedLanguage = "javascript" | "html" | "json" | "css" | "scss" | "less" | "handlebars" | "razor" | "typescript";
export declare class MonacoEditor {
    protected _rangeRestrictions: RangeRestriction[];
    protected readonly _editorInstance: editor.IStandaloneCodeEditor;
    protected readonly _constrainedInstance: ConstrainedEditor;
    protected readonly restrictions: RangeRestriction[];
    private _previousRestrictionLength;
    readonly onChangeContext: Event<onChangeContextData>;
    private get _model();
    get content(): string;
    get rangeValues(): ValueInEditableRanges;
    constructor(element: HTMLElement, content?: string, language?: supportedLanguage);
    protected changeRanges(): void;
    setRanges(rangeRestrictions: RangeRestriction[]): void;
    clearRanges(): void;
}
