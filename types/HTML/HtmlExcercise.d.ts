import { Excercise } from "../Excercise";
import { HtmlValidationRuleSet } from "./HtmlValidationRuleSet";
import { ValidationResult } from "../ValidationResult";
import { HtmlValidationRule } from "./HtmlValidationRule";
export declare class HtmlExcercise extends Excercise<HtmlValidationRule, HtmlValidationRuleSet> {
    readonly iframe: HTMLIFrameElement;
    protected _ruleSet: HtmlValidationRuleSet;
    constructor(monacoEditorElement: HTMLElement, content?: string, iframe?: HTMLIFrameElement);
    protected validateExtend(): ValidationResult;
    renderIframe(): void;
}
