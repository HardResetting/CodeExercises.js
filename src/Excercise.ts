import { HtmlExcerciseValidation } from "./HtmlExcerciseValidation";

export abstract class Excercise<ExcerciseType> {
    constructor(ExcerciseTypeConstructor: new () => ExcerciseType, content?: string) {
        this._excerciseValidation = new ExcerciseTypeConstructor();
        this.content = content ?? "";
    }

    protected _excerciseValidation: ExcerciseType;
    public content: string;
}

export class HtmlExcercise extends Excercise<HtmlExcerciseValidation> {
    constructor(content?: string, iframe?: HTMLIFrameElement) {
        super(HtmlExcerciseValidation, content);

        if (iframe == null) {
            const newIFrame = document.createElement("iframe");
            document.body.appendChild(newIFrame);
            this.iframe = newIFrame;
        } else {
            this.iframe = iframe;
        }
    }

    protected iframe: HTMLIFrameElement;

    validate(): boolean {
        this.renderIframe();

        const document = this.iframe.contentDocument;
        if (document == null) {
            throw "contendDocument was null!";
        }

        this._excerciseValidation.validate(this.content, document);
        return true;
    }

    renderIframe() {
        if (this.iframe.srcdoc == null) {
            throw "iframe was null!";
        }

        const iframeDoc = this.iframe.contentDocument!;
        iframeDoc.open();
        iframeDoc.write(this.content);
        iframeDoc.close();

        console.log(iframeDoc);
    }
}