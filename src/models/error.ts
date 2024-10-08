export class Erroro extends Error {
  httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.name = "Erroro";
    this.httpStatusCode = httpStatusCode;
    Object.setPrototypeOf(this, Erroro.prototype);
  }
}
