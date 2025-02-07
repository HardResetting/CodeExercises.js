export interface IValidationRuleSet<RuleType extends IValidationRule> {
    rules: ReadonlyArray<RuleType>;
}
export interface IValidationRule {
    message: string;
}
