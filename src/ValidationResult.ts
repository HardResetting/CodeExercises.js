type Status = "valid" | "invalid";
export default class ValidationResult {

    get isValid(): boolean {
        return this.status === "valid";
    };

    readonly message: string;
    readonly status: Status;

    constructor(message: string, status: Status) {
        this.message = message;
        this.status = status;
    }
}