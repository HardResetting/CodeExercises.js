import { Excercise } from "../Excercise";
import { HtmlValidationRuleSet } from "./HtmlValidationRuleSet";
import { ValidationResult } from "../ValidationResult";
import { HtmlValidationRule } from "./HtmlValidationRule";

export class HtmlExcercise extends Excercise<HtmlValidationRule, HtmlValidationRuleSet> {
    public readonly iframe: HTMLIFrameElement;
    protected override _ruleSet: HtmlValidationRuleSet;

    constructor(monacoEditorElement: HTMLElement, content?: string, iframe?: HTMLIFrameElement) {
        super(monacoEditorElement, content);
        this._ruleSet = new HtmlValidationRuleSet();
        if (iframe == null) {
            const newIFrame = document.createElement("iframe");
            newIFrame.setAttribute("style", "display: none");
            document.body.appendChild(newIFrame);
            this.iframe = newIFrame;
        } else {
            this.iframe = iframe;
        }

        this._monacoEditorInstance.onChangeContext.on(_ => {
            this.renderIframe();
        })

        this.renderIframe();
    }

    protected async validateExtend(): Promise<ValidationResult> {
        this.renderIframe();

        const contendDocument = this.iframe.contentDocument;
        if (contendDocument == null) {
            throw "contendDocument was null!";
        }

        const errors: string[] = [];

        for (const rule of this._ruleSet.rules) {
            if (!(await rule.method(this.content, contendDocument))) {
                errors.push(rule.message);
            }
        }

        return new ValidationResult(errors);
    }

    public renderIframe(): void {
        if (this.iframe.srcdoc == null) {
            throw "iframe was null!";
        }

        const iframeDoc = this.iframe.contentDocument!;
        iframeDoc.open();
        iframeDoc.write(this.content);
        iframeDoc.close();
    }
}