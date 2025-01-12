import { HtmlExcerciseValidation } from "./HtmlExcerciseValidation";
import { MonacoEditor } from "./MonacoEditor";
import { ValidationResult } from "./ValidationResult";

export abstract class Excercise<ExcerciseType> {
    constructor(ExcerciseTypeConstructor: new () => ExcerciseType, content?: string) {
        this._validation = new ExcerciseTypeConstructor();
        this.content = content ?? "";
    }

    protected _validation: ExcerciseType;
    public content: string;
}

export class HtmlExcercise extends Excercise<HtmlExcerciseValidation> {
    constructor(monacoEditorElement: HTMLElement, content?: string, iframe?: HTMLIFrameElement) {
        super(HtmlExcerciseValidation, content);

        if (iframe == null) {
            const newIFrame = document.createElement("iframe");
            document.body.appendChild(newIFrame);
            this._iframe = newIFrame;
        } else {
            this._iframe = iframe;
        }

        this._monacoEditorInstance = new MonacoEditor(monacoEditorElement, content, "html");

        this._monacoEditorInstance.onChangeContext.on((data) => {
            this.content = data.content;
            this.renderIframe();
            this.validate();
        })

        this.content = content ?? "";
        this.renderIframe();
    }


    protected _monacoEditorInstance: MonacoEditor;
    protected _iframe: HTMLIFrameElement;
    get validationRuleSet() {
        return this._validation.validationRuleSet;
    }

    validate(): ValidationResult {
        this.renderIframe();

        const document = this._iframe.contentDocument;
        if (document == null) {
            throw "contendDocument was null!";
        }

        const result = this._validation.validate(this.content, document);
        console.log(result);

        return result;
    }

    renderIframe() {
        if (this._iframe.srcdoc == null) {
            throw "iframe was null!";
        }

        const iframeDoc = this._iframe.contentDocument!;
        iframeDoc.open();
        iframeDoc.write(this.content);
        iframeDoc.close();
    }
}