
export class Error404 extends Error {
    constructor(message : string) {
        super(message)
        this.name = "404 Error"
    }
}