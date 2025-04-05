type Status = "valid" | "invalid" | "unknown";
export default class ValidationResult {

    get isValid(): boolean {
        return this.status === "valid";
    };

    readonly message: string;
    readonly status: Status;

    constructor(message: string, status: Status = "unknown") {
        this.message = message;
        this.status = status;
    }
}