export class Result<T> {
  data: T | null = null;
  message: string[] = [];
  errors: string[] = [];
  statusCode: number = 200;

  setData(data: T): Result<T> {
    this.data = data;
    return this;
  }
  addMessage(msg: string): Result<T> {
    this.message.push(msg);
    return this;
  }
  addError(error: string): Result<T> {
    this.errors.push(error);
    return this;
  }
  setStatusCode(code: number): Result<T> {
    this.statusCode = code;
    return this;
  }
}
