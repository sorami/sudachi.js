export class WordParameterList {
    private ELEMENT_SIZE = 2 * 3

    private buf: Buffer
    readonly size: number
    private offset: number

    constructor(buf: Buffer, offset: number) {
        this.buf = buf
        this.size = buf.readInt32LE(offset)
        this.offset = 4 + offset
    }

    storageSize(): number {
        return 4 + this.ELEMENT_SIZE * this.size
    }
}
