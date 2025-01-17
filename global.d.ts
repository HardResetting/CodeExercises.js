// global.d.ts
import * as Monaco from "monaco-editor";

declare global {
    const monaco: typeof Monaco;

    // Assuming `constrainedEditor` is globally available
    interface RangeRestriction {
        range: [number, number, number, number]; // [startLine, startColumn, endLine, endColumn]
        allowMultiline?: boolean;
        label?: string;
        validate?: Function;
    }

    type ValueInEditableRanges = { [RangeLabel: string]: string };

    class ExtendedModel implements Monaco.editor.ITextModel {
        uri: Monaco.Uri;
        id: string;
        getOptions(): Monaco.editor.TextModelResolvedOptions;
        getVersionId(): number;
        getAlternativeVersionId(): number;
        setValue(newValue: string | Monaco.editor.ITextSnapshot): void;
        getValue(eol?: Monaco.editor.EndOfLinePreference, preserveBOM?: boolean): string;
        createSnapshot(preserveBOM?: boolean): Monaco.editor.ITextSnapshot;
        getValueLength(eol?: Monaco.editor.EndOfLinePreference, preserveBOM?: boolean): number;
        getValueInRange(range: Monaco.IRange, eol?: Monaco.editor.EndOfLinePreference): string;
        getValueLengthInRange(range: Monaco.IRange, eol?: Monaco.editor.EndOfLinePreference): number;
        getCharacterCountInRange(range: Monaco.IRange, eol?: Monaco.editor.EndOfLinePreference): number;
        getLineCount(): number;
        getLineContent(lineNumber: number): string;
        getLineLength(lineNumber: number): number;
        getLinesContent(): string[];
        getEOL(): string;
        getEndOfLineSequence(): Monaco.editor.EndOfLineSequence;
        getLineMinColumn(lineNumber: number): number;
        getLineMaxColumn(lineNumber: number): number;
        getLineFirstNonWhitespaceColumn(lineNumber: number): number;
        getLineLastNonWhitespaceColumn(lineNumber: number): number;
        validatePosition(position: Monaco.IPosition): Monaco.Position;
        modifyPosition(position: Monaco.IPosition, offset: number): Monaco.Position;
        validateRange(range: Monaco.IRange): Monaco.Range;
        getOffsetAt(position: Monaco.IPosition): number;
        getPositionAt(offset: number): Monaco.Position;
        getFullModelRange(): Monaco.Range;
        isDisposed(): boolean;
        findMatches(searchString: string, searchOnlyEditableRange: boolean, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number): Monaco.editor.FindMatch[];
        findMatches(searchString: string, searchScope: Monaco.IRange | Monaco.IRange[], isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number): Monaco.editor.FindMatch[];
        findNextMatch(searchString: string, searchStart: Monaco.IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): Monaco.editor.FindMatch | null;
        findPreviousMatch(searchString: string, searchStart: Monaco.IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): Monaco.editor.FindMatch | null;
        getLanguageId(): string;
        getWordAtPosition(position: Monaco.IPosition): Monaco.editor.IWordAtPosition | null;
        getWordUntilPosition(position: Monaco.IPosition): Monaco.editor.IWordAtPosition;
        deltaDecorations(oldDecorations: string[], newDecorations: Monaco.editor.IModelDeltaDecoration[], ownerId?: number): string[];
        getDecorationOptions(id: string): Monaco.editor.IModelDecorationOptions | null;
        getDecorationRange(id: string): Monaco.Range | null;
        getLineDecorations(lineNumber: number, ownerId?: number, filterOutValidation?: boolean): Monaco.editor.IModelDecoration[];
        getLinesDecorations(startLineNumber: number, endLineNumber: number, ownerId?: number, filterOutValidation?: boolean): Monaco.editor.IModelDecoration[];
        getDecorationsInRange(range: Monaco.IRange, ownerId?: number, filterOutValidation?: boolean, onlyMinimapDecorations?: boolean, onlyMarginDecorations?: boolean): Monaco.editor.IModelDecoration[];
        getAllDecorations(ownerId?: number, filterOutValidation?: boolean): Monaco.editor.IModelDecoration[];
        getAllMarginDecorations(ownerId?: number): Monaco.editor.IModelDecoration[];
        getOverviewRulerDecorations(ownerId?: number, filterOutValidation?: boolean): Monaco.editor.IModelDecoration[];
        getInjectedTextDecorations(ownerId?: number): Monaco.editor.IModelDecoration[];
        normalizeIndentation(str: string): string;
        updateOptions(newOpts: Monaco.editor.ITextModelUpdateOptions): void;
        detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void;
        pushStackElement(): void;
        popStackElement(): void;
        pushEditOperations(beforeCursorState: Monaco.Selection[] | null, editOperations: Monaco.editor.IIdentifiedSingleEditOperation[], cursorStateComputer: Monaco.editor.ICursorStateComputer): Monaco.Selection[] | null;
        pushEOL(eol: Monaco.editor.EndOfLineSequence): void;
        applyEdits(operations: Monaco.editor.IIdentifiedSingleEditOperation[]): void;
        applyEdits(operations: Monaco.editor.IIdentifiedSingleEditOperation[], computeUndoEdits: false): void;
        applyEdits(operations: Monaco.editor.IIdentifiedSingleEditOperation[], computeUndoEdits: true): Monaco.editor.IValidEditOperation[];
        setEOL(eol: Monaco.editor.EndOfLineSequence): void;
        onDidChangeContent(listener: (e: Monaco.editor.IModelContentChangedEvent) => void): Monaco.IDisposable;
        onDidChangeDecorations: Monaco.IEvent<Monaco.editor.IModelDecorationsChangedEvent>;
        onDidChangeOptions: Monaco.IEvent<Monaco.editor.IModelOptionsChangedEvent>;
        onDidChangeLanguage: Monaco.IEvent<Monaco.editor.IModelLanguageChangedEvent>;
        onDidChangeLanguageConfiguration: Monaco.IEvent<Monaco.editor.IModelLanguageConfigurationChangedEvent>;
        onDidChangeAttached: Monaco.IEvent<void>;
        onWillDispose: Monaco.IEvent<void>;
        dispose(): void;
        isAttachedToEditor(): boolean;
        getValueInEditableRanges(): ValueInEditableRanges;
    }

    class ConstrainedEditor {
        constructor(Monaco: typeof monaco);

        initializeIn(editorInstance: Monaco.editor.IStandaloneCodeEditor): void;

        addRestrictionsTo(
            model: Monaco.editor.ITextModel,
            restrictions: RangeRestriction[]
        ): void;

        removeRestrictionsIn(model: Monaco.editor.ITextModel): void;

        getRestrictionsOf(model: Monaco.editor.ITextModel): RangeRestriction[];

        toggleHighlightOfEditableAreas(): void;
    }

    type ConstrainedEditorFunction = (
        monaco: typeof import('monaco-editor')
    ) => ConstrainedEditorFunction;

    function constrainedEditor(
        monaco: typeof import('monaco-editor')
    ): ConstrainedEditor;
}