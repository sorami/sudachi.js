import { Trie } from './trie'
import { WordIdTable } from './wordIdTable'
import { WordParameterList } from './wordParameterList'
import { WordInfoList } from './wordInfoList'

export class Lexicon {
    private trie: Trie
    private wordIdTable: WordIdTable
    private wordParams: WordParameterList
    private wordInfos: WordInfoList

    constructor(buf: Buffer, offset: number) {
        const trieSize = buf.readUInt32LE(offset)
        offset += 4
        const trieArray = new DataView(buf.buffer, offset, trieSize * 4)
        this.trie = new Trie(trieArray, trieSize)
        offset += this.trie.totalSize()

        this.wordIdTable = new WordIdTable(buf, offset)
        offset += this.wordIdTable.storageSize()

        this.wordParams = new WordParameterList(buf, offset)
        offset += this.wordParams.storageSize()

        this.wordInfos = new WordInfoList(buf, offset, this.wordParams.size)
    }

    getWordInfo(wordId: number) {
        return this.wordInfos.getWordInfo(wordId)
    }
}
