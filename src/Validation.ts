import IValidationRule from "./IValidationRule";

export default abstract class ValidationRuleSet<RuleType extends IValidationRule> {
    abstract rules: ReadonlyArray<RuleType>;
    protected _stopOnFail: boolean = true;
    protected _negateNext = false;

    get shouldStopOnFail() {
        return this._stopOnFail;
    }

    get not(): ValidationRuleSet<RuleType> {
        this._negateNext = true;
        return this;
    }

    stopOnFail(bool: boolean) {
        this._stopOnFail = bool;
        return this;
    }
}

