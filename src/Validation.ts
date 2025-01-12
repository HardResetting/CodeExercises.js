export abstract class Validation<ValidationType> {
    constructor(ValidationTypeConstructor: new () => ValidationType) {
        this._validationRuleSet = new ValidationTypeConstructor();
    }

    protected _validationRuleSet: ValidationType;

    get validationRuleSet() {
        return this._validationRuleSet;
    }
}
