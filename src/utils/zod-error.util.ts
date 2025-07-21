export class ZodValidationError extends Error {
    name: string = "ZodValidationError";
    errors: Record<string, string> = {};
    constructor(data: { path: string[], message: string }[]) {
        super("One or more data validations failed.");
        data.forEach((error) => this.errors[error.path.join(".")] = error.message);
    }
}