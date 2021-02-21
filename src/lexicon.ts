const ELEMENT_SIZE = 2 * 3

export class Lexicon {
    private trie: Trie
    private wordIdTable: WordIdTable
    private wordParams: WordParams
    private wordInfos: WordInfos

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
        const wordIdTableOffset = offset
        // TODO: Implement WordIdTable
        this.wordIdTable = new WordIdTable(wordIdTableSize, wordIdTableOffset)
        offset += wordIdTableSize

        // WordParams
        const wordParamsSize = buf.readInt32LE(offset)
        offset += 4
        const WORD_PARAMS_OFFSET = offset
        this.wordParams = new WordParams(buf, wordParamsSize, offset)
        offset += wordParamsSize * ELEMENT_SIZE

        // WordInfos
        this.wordInfos = new WordInfos(buf, offset, wordParamsSize)
    }

    getWordInfo(wordId: number) {
        return this.wordInfos.getWordInfo(wordId)
    }
}

class Trie {
    private offset: number

    constructor(trieOffset: number) {
        this.offset = trieOffset
    }
}

class WordIdTable {
    size: number
    offset: number

    constructor(wordIdTableSize: number, wordIdTableOffset: number) {
        this.size = wordIdTableSize
        this.offset = wordIdTableOffset
    }
}

class WordParams {
    private buf: Buffer
    size: number
    private offset: number

    constructor(buf: Buffer, size: number, offset: number) {
        this.buf = buf
        this.size = size
        this.offset = offset
    }
}

class WordInfos {
    private buf: Buffer
    private offset: number
    private wordSize: number

    constructor(buf: Buffer, offset: number, wordSize: number) {
        this.buf = buf
        this.offset = offset
        this.wordSize = wordSize
    }

    getWordInfo(wordId: number) {
        let index = this.buf.readInt32LE(this.offset + 4 * wordId)

        // surface
        const ret = this.bufferToString(index)
        index = ret.indexAfter
        const surface = ret.str

        return surface

        /*
        surface
        head_word_length
        pos_id
        normalized_form
        dictionary_form_word_id
        dictionary_form
        reading_form
        a_unit_split
        b_unit_split
        word_structure
        synonym_group_ids
        */
    }

    private bufferToStringLength(index: number) {
        let stringLength = this.buf.readInt8(index)
        let indexAfter = index + 1
        if (stringLength >= 128) {
            stringLength =
                ((stringLength & 0x7f) << 8) | this.buf.readInt8(index)
            indexAfter += 1
        }
        return { indexAfter, stringLength }
    }

    private bufferToString(index: number) {
        let { indexAfter, stringLength } = this.bufferToStringLength(index)
        const str = this.buf.toString(
            'utf16le',
            indexAfter,
            indexAfter + stringLength * 2
        )
        indexAfter = indexAfter + stringLength * 2
        return { indexAfter, str }
    }
}
