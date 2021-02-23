import fs from 'fs'
import { Header } from './dictionary/header'
import { Grammar } from './dictionary/grammar'
import { Lexicon } from './dictionary/lexicon'
import { Tokenizer } from './tokenizer'

export class Dictionary {
    private readonly buf: Buffer
    readonly header: Header
    readonly grammar: Grammar
    readonly lexicon: Lexicon

    constructor(filePath: string) {
        try {
            this.buf = fs.readFileSync(filePath)
            let offset = 0

            this.header = new Header(this.buf, offset)
            offset += this.header.storageSize

            this.grammar = new Grammar(this.buf, offset)
            offset += this.grammar.storageSize

            this.lexicon = new Lexicon(this.buf, offset)
        } catch (error) {
            console.error(`Failed to load dictionary '${filePath}':`, error)
            process.exit(1)
        }
    }

    create(): Tokenizer {
        return new Tokenizer(this.grammar, this.lexicon)
    }
}
