import { ValidationResult } from "./ValidationResult";

export interface IValidationRuleSet<RuleType extends IValidationRule> {
    rules: RuleType[];
}

export interface IValidationRule {
    message: string;
}