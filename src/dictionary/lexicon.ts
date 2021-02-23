import { Trie } from './trie'
import { WordParameterList } from './wordParameterList'
import { WordInfoList } from './wordInfoList'

export class Lexicon {
    private trie: Trie
    private wordIdTable: WordIdTable
    private wordParams: WordParameterList
    private wordInfos: WordInfoList

    constructor(buf: Buffer, offset: number) {
        // Trie
        const trieSize = buf.readUInt32LE(offset)
        offset += 4
        const trieOffset = offset
        // TODO: Implement Trie
        this.trie = new Trie(trieOffset)
        offset += trieSize * 4

        // WordIdTable
        const wordIdTableSize = buf.readInt32LE(offset)
        offset += 4
        // TODO: Implement WordIdTable
        this.wordIdTable = new WordIdTable(buf, wordIdTableSize, offset)
        offset += wordIdTableSize

        // WordParams
        const wordParamsSize = buf.readInt32LE(offset)
        offset += 4
        this.wordParams = new WordParameterList(buf, wordParamsSize, offset)
        offset += this.wordParams.storageSize

        // WordInfos
        this.wordInfos = new WordInfoList(buf, offset, wordParamsSize)
    }

    getWordInfo(wordId: number) {
        return this.wordInfos.getWordInfo(wordId)
    }
}

class WordIdTable {
    private buf: Buffer
    private size: number
    private offset: number

    constructor(
        buf: Buffer,
        wordIdTableSize: number,
        wordIdTableOffset: number
    ) {
        this.buf = buf
        this.size = wordIdTableSize
        this.offset = wordIdTableOffset
    }
}
