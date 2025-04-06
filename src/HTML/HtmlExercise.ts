import Excercise from "../Exercise";
import HtmlValidationRuleSet from "./HtmlValidationRuleSet";
import ValidationResultGroup from "../ValidationResultGroup";
import HtmlValidationRule from "./HtmlValidationRule";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

export default class HtmlExcercise extends Excercise<HtmlValidationRule, HtmlValidationRuleSet> {
    public readonly iframe: HTMLIFrameElement;
    protected override _ruleSets: HtmlValidationRuleSet[];

    constructor(monacoEditorElement: HTMLElement, content?: string, iframe?: HTMLIFrameElement, monacoConfig?: editor.IStandaloneEditorConstructionOptions) {
        super(monacoEditorElement, content, monacoConfig);
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

    protected async validateExtend(): Promise<Array<ValidationResultGroup>> {
        this.renderIframe();

        const contendDocument = this.iframe.contentDocument;
        if (contendDocument == null) {
            throw "contendDocument was null!";
        }

        const validationResults: ValidationResultGroup[] = [];

        for (const ruleSet of this._ruleSets) {
            const res = await ruleSet.validate(this.content, contendDocument);
            validationResults.push(res);
        }

        return validationResults;
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