import { IValidationRule } from "../Validation";
export declare class HtmlValidationRule implements IValidationRule {
    constructor(method: (val: string, iframeDoc: Document) => boolean, message: string);
    method: (val: string, iframeDoc: Document) => boolean;
    message: string;
}
