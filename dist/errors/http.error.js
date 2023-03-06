export class HTTPError extends Error {
    code;
    outMsg;
    message;
    options;
    constructor(code, outMsg, message, options) {
        super(message, options);
        this.code = code;
        this.outMsg = outMsg;
        this.message = message;
        this.options = options;
        this.name = 'HTTP Error';
        this.code = code;
        this.outMsg = outMsg;
    }
}
