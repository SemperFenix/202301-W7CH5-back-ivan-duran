export interface CustomError extends Error {
  code: number;
  outMsg: string;
}

export class HTTPError extends Error {
  constructor(
    public code: number,
    public outMsg: string,
    public message: string,
    public options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'HTTP Error';
    this.code = code;
    this.outMsg = outMsg;
  }
}
