import { IValidationRule } from "./IValidationRule";


export class EditableFieldValidationRule implements IValidationRule {
    constructor(method: (val: string) => boolean, message: string) {
        this.method = method;
        this.message = message;
    }

    method: (val: string) => boolean;
    message: string;
}
