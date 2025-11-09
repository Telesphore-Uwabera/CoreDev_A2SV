export class AppError extends Error {
  public status: number;
  public errors?: string[];

  constructor(message: string, status = 500, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

