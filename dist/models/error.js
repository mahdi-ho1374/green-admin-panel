"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erroro = void 0;
class Erroro extends Error {
    constructor(message, httpStatusCode) {
        super(message);
        this.name = "Erroro";
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, Erroro.prototype);
    }
}
exports.Erroro = Erroro;
