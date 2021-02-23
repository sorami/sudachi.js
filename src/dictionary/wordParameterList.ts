export class WordParameterList {
    private ELEMENT_SIZE = 2 * 3

    private readonly buf: Buffer
    readonly size: number
    private readonly offset: number

    constructor(buf: Buffer, offset: number) {
        this.buf = buf
        this.size = buf.readInt32LE(offset)
        this.offset = 4 + offset
    }

    storageSize(): number {
        return 4 + this.ELEMENT_SIZE * this.size
    }

    getLeftId(wordId: number): number {
        return this.buf.readInt16LE(this.offset + this.ELEMENT_SIZE * wordId)
    }

    getRightId(wordId: number): number {
        return this.buf.readInt16LE(
            this.offset + this.ELEMENT_SIZE * wordId + 2
        )
    }

    getCost(wordId: number): number {
        return this.buf.readInt16LE(
            this.offset + this.ELEMENT_SIZE * wordId + 4
        )
    }
}
