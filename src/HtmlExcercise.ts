import { Excercise } from "./Excercise";
import { HtmlExcerciseValidation } from "./HtmlExcerciseValidation";
import { ValidationResult } from "./ValidationResult";

export class HtmlExcercise extends Excercise<HtmlExcerciseValidation> {
    protected _iframe: HTMLIFrameElement;

    constructor(monacoEditorElement: HTMLElement, content?: string, iframe?: HTMLIFrameElement) {
        super(HtmlExcerciseValidation, monacoEditorElement, content);

        if (iframe == null) {
            const newIFrame = document.createElement("iframe");
            newIFrame.setAttribute("style", "display: none");
            document.body.appendChild(newIFrame);
            this._iframe = newIFrame;
        } else {
            this._iframe = iframe;
        }

        this._monacoEditorInstance.onChangeContext.on((data) => {
            this.renderIframe();
        })

        this.renderIframe();
    }

    validateExtend(): ValidationResult {
        this.renderIframe();

        const document = this._iframe.contentDocument;
        if (document == null) {
            throw "contendDocument was null!";
        }

        return this._validation.validate(this.content, document);
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