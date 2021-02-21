const POS_DEPTH = 6

export class Grammar {
    private buf: Buffer
    private posSize: number
    private leftIdSize: number
    private rightIdSize: number
    private connectTableOffset: number
    readonly storage_size: number

    constructor(buf: Buffer, offset: number) {
        let originalOffset = offset

        this.buf = buf

        this.posSize = buf.readUInt16LE(offset)
        offset += 2

        for (let i = 0; i < this.posSize; i++) {
            let pos: string[] = []
            for (let j = 0; j < POS_DEPTH; j++) {
                const length = buf.readInt8(offset)
                offset += 1
                const s = buf.toString('utf16le', offset, offset + 2 * length)
                offset += 2 * length
                pos.push(s)
            }
            // console.log(`${i}:\t${pos}`);
        }

        this.leftIdSize = buf.readInt16LE(offset)
        offset += 2
        this.rightIdSize = buf.readInt16LE(offset)
        offset += 2

        this.connectTableOffset = offset

        // buf.readInt16LE(CONNECT_TABLE_OFFSET + 2 * leftIdSize * leftId + rightId)}`);

        this.storage_size =
            this.connectTableOffset +
            2 * this.leftIdSize * this.rightIdSize -
            originalOffset
    }
}
