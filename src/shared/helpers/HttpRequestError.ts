export class HttpRequestError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'HttpRequestError';
  }
}
