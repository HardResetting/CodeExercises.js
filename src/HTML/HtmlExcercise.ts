import { Excercise } from "../Excercise";
import { HtmlValidationRuleSet } from "./HtmlValidationRuleSet";
import { ValidationResult } from "../ValidationResult";
import { HtmlValidationRule } from "./HtmlValidationRule";

export class HtmlExcercise extends Excercise<HtmlValidationRule, HtmlValidationRuleSet> {
    public readonly iframe: HTMLIFrameElement;
    protected override _ruleSets: HtmlValidationRuleSet[];

    constructor(monacoEditorElement: HTMLElement, content?: string, iframe?: HTMLIFrameElement) {
        super(monacoEditorElement, content);
        this._ruleSets = [];
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

    public override addValidationRule(): HtmlValidationRuleSet {
        const obj = new HtmlValidationRuleSet();
        this._ruleSets.push(obj);
        return obj;
    }

    protected async validateExtend(): Promise<ValidationResult> {
        this.renderIframe();

        const contendDocument = this.iframe.contentDocument;
        if (contendDocument == null) {
            throw "contendDocument was null!";
        }

        const errors: string[] = [];

        for (const ruleSet of this._ruleSets) {
            for (const rule of ruleSet.rules) {
                if (!(await rule.method(this.content, contendDocument))) {
                    errors.push(rule.message);
                    if (ruleSet.shouldStopOnFail) {
                        break;
                    }
                }
            }
        }

        return new ValidationResult(errors);
    }

    protected async validateRule(rule: HtmlValidationRule): Promise<boolean> {
        this.renderIframe();

        const contendDocument = this.iframe.contentDocument;
        if (contendDocument == null) {
            throw "contendDocument was null!";
        }

        return await rule.method(this.content, contendDocument);
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