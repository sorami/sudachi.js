export class Grammar {
    private POS_DEPTH = 6
    readonly BOS_PARAMETER = [0, 0, 0]
    readonly EOS_PARAMETER = [0, 0, 0]

    private buf: Buffer
    private posList: string[][]
    private connectTableOffset: number
    private leftIdSize: number
    private rightIdSize: number
    readonly storageSize: number

    constructor(buf: Buffer, offset: number) {
        const originalOffset = offset

        this.buf = buf

        const posSize = buf.readUInt16LE(offset)
        offset += 2

        this.posList = []
        for (let i = 0; i < posSize; i++) {
            let pos: string[] = []
            for (let j = 0; j < this.POS_DEPTH; j++) {
                const length = buf.readInt8(offset)
                offset += 1
                pos.push(buf.toString('utf16le', offset, offset + 2 * length))
                offset += 2 * length
            }
            this.posList.push(pos)
        }

        this.leftIdSize = buf.readInt16LE(offset)
        offset += 2
        this.rightIdSize = buf.readInt16LE(offset)
        offset += 2
        this.connectTableOffset = offset

        this.storageSize =
            this.connectTableOffset +
            2 * this.leftIdSize * this.rightIdSize -
            originalOffset
    }

    getPartOfSpeechString(posId: number): string[] {
        return this.posList[posId]
    }

    getConnectCost(left: number, right: number): number {
        return this.buf.readInt16LE(
            this.connectTableOffset + left * 2 + 2 * this.leftIdSize * right
        )
    }
}
