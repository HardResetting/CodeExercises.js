import ValidationResultGroup from "./ValidationResultGroup";

export default class ValidationResultSummary {
    private readonly _validationResultGroups: Array<ValidationResultGroup>;

    constructor(validationResultGroups: Array<ValidationResultGroup>) {
        this._validationResultGroups = validationResultGroups;
    }

    get valid() {
        return this.getInvalidResults().length == 0;
    }

    get results() {
        return this._validationResultGroups.map(e => e.results).flat();
    }

    get resultGroups() {
        return this._validationResultGroups;
    }

    getInvalidResults() {
        return this.results.filter(obj => !obj.isValid);
    }

    getValidResults() {
        return this.results.filter(obj => obj.isValid);
    }

    getInvalidMessages() {
        return this.results.filter(obj => !obj.isValid).map(obj => obj.message);
    }

    getValidMessages() {
        return this.results.filter(obj => obj.isValid).map(obj => obj.message);
    }

    getMessages() {
        return this.results.map(obj => obj.message);
    }
}