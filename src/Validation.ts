import IValidationRule from "./IValidationRule";

export default abstract class ValidationRuleSet<RuleType extends IValidationRule> {
    abstract rules: ReadonlyArray<RuleType>;
    protected readonly id: string;
    protected _stopOnFail: boolean = false;
    protected _negateNext = false;

    constructor() {
        this.id = crypto.randomUUID();
    }

    get shouldStopOnFail() {
        return this._stopOnFail;
    }

    get not(): ValidationRuleSet<RuleType> {
        this._negateNext = true;
        return this;
    }

    stopOnFail(bool: boolean = true) {
        this._stopOnFail = bool;
        return this;
    }
}