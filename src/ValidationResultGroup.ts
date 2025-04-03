import ValidationResult from "./ValidationResult";

export default class ValidationResultGroup {
    private readonly _results: Array<ValidationResult>;
    readonly id: string;
    get isValid(): boolean {
        return (this.results?.length ?? 0) == 0;
    };

    constructor(id: string, results: Array<ValidationResult>) {
        this.id = id;
        this._results = results ?? [];
    }

    get results() {
        return this._results;
    }
    
    getInvalidResults() {
        return this._results.filter(obj => !obj.isValid);
    }
    
    getValidResults() {
        return this._results.filter(obj => obj.isValid);
    }

    getInvalidMessages() {
        return this._results.filter(obj => !obj.isValid).map(obj => obj.message);
    }

    getValidMessages() {
        return this._results.filter(obj => obj.isValid).map(obj => obj.message);
    }
    
    getMessages() {
        return this._results.map(obj => obj.message);
    }
}