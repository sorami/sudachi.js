export class Header {
    readonly version: bigint
    readonly createTime: bigint
    readonly description: string

    private DESCRIPTION_SIZE = 256
    readonly storageSize = 8 + 8 + this.DESCRIPTION_SIZE

    constructor(buf: Buffer, offset: number) {
        this.version = buf.readBigUInt64LE(offset)
        offset += 8

        this.createTime = buf.readBigInt64LE(offset)
        offset += 8

        this.description = buf.toString(
            'utf8',
            offset,
            offset + this.DESCRIPTION_SIZE
        )
    }
}
