import fs from 'fs'
import { Grammar } from './grammar'
import { Lexicon } from './lexicon'

const DESCRIPTION_SIZE = 256

export class Dictionary {
    readonly header: {
        version: bigint
        createTime: bigint
        description: string
    }
    readonly grammar: Grammar
    readonly lexicon: Lexicon

    constructor(filePath: string) {
        try {
            let buf = Buffer.from(fs.readFileSync(filePath))
            let offset = 0

            // header
            const version = buf.readBigUInt64LE(offset)
            offset += 8

            const createTime = buf.readBigInt64LE(offset)
            offset += 8

            const description = buf.toString(
                'utf8',
                offset,
                offset + DESCRIPTION_SIZE
            )
            offset += DESCRIPTION_SIZE

            this.header = { version, createTime, description }

            // grammar
            this.grammar = new Grammar(buf, offset)
            offset += this.grammar.storage_size

            // lexicon
            this.lexicon = new Lexicon(buf, offset)
        } catch (error) {
            console.error(`Failed to load setting file '${filePath}':`, error)
            process.exit(1)
        }
    }
}
