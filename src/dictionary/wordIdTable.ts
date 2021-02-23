export class WordIdTable {
    private buf: Buffer
    private size: number
    private offset: number

    constructor(buf: Buffer, offset: number) {
        this.buf = buf
        this.size = buf.readInt32LE(offset)
        this.offset = offset + 4
    }

    storageSize(): number {
        return 4 + this.size
    }
}
