export class WordParameterList {
    private ELEMENT_SIZE = 2 * 3

    private buf: Buffer
    private size: number
    private offset: number
    readonly storageSize: number

    constructor(buf: Buffer, size: number, offset: number) {
        this.buf = buf
        this.size = size
        this.offset = offset
        this.storageSize = this.ELEMENT_SIZE * this.size
    }
}
