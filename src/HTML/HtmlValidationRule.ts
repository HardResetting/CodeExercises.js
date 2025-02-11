import { IValidationRule } from "../Validation";

export class HtmlValidationRule implements IValidationRule {
    constructor(method: (val: string, iframeDoc: Document) => boolean | Promise<boolean>, message: string) {
        this.method = method;
        this.message = message;
    }

    method: (val: string, iframeDoc: Document) => boolean | Promise<boolean>;
    message: string;
}
