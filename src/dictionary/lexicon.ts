const ELEMENT_SIZE = 2 * 3

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

class Trie {
    private offset: number

    constructor(trieOffset: number) {
        this.offset = trieOffset
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

class WordParameterList {
    private ELEMENT_SIZE = 2 * 3

    private buf: Buffer
    private size: number
    private offset: number
    readonly storageSize: number

    constructor(buf: Buffer, size: number, offset: number) {
        this.buf = buf
        this.size = size
        this.offset = offset
        this.storageSize = this.ELEMENT_SIZE * this.size
    }
}

class WordInfoList {
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

        let surface: string
        ;[index, surface] = this.bufferToString(index)

        let headwordLength: number
        ;[index, headwordLength] = this.bufferToStringLength(index)

        const posId = this.buf.readInt16LE(index)
        index += 2

        let normalizedForm: string
        ;[index, normalizedForm] = this.bufferToString(index)
        if (!normalizedForm) {
            normalizedForm = surface
        }

        const dictionaryFormWordId = this.buf.readInt32LE(index)
        index += 4

        let readingForm: string
        ;[index, readingForm] = this.bufferToString(index)
        if (!readingForm) {
            readingForm = surface
        }

        let aUnitSplit: number[]
        ;[index, aUnitSplit] = this.bufferToNumberArray(index)

        let bUnitSplit: number[]
        ;[index, bUnitSplit] = this.bufferToNumberArray(index)

        let wordStructure: number[]
        ;[index, wordStructure] = this.bufferToNumberArray(index)

        let dictionaryForm = surface
        if (dictionaryFormWordId >= 0 && dictionaryFormWordId != wordId) {
            const wi = this.getWordInfo(dictionaryFormWordId)
            dictionaryForm = wi.surface
        }

        return {
            surface,
            headwordLength,
            posId,
            normalizedForm,
            dictionaryFormWordId,
            dictionaryForm,
            readingForm,
            aUnitSplit,
            bUnitSplit,
            wordStructure,
        }
    }

    private bufferToStringLength(index: number) {
        let stringLength = this.buf.readUInt8(index)
        index += 1
        if (stringLength >= 128) {
            stringLength =
                ((stringLength & 0x7f) << 8) | this.buf.readUInt8(index)
            index += 1
        }
        return [index, stringLength]
    }

    private bufferToString(index: number): [number, string] {
        let stringLength: number
        ;[index, stringLength] = this.bufferToStringLength(index)
        const str = this.buf.toString(
            'utf16le',
            index,
            index + stringLength * 2
        )
        index += stringLength * 2
        return [index, str]
    }

    private bufferToNumberArray(index: number): [number, number[]] {
        const length = this.buf.readUInt8(index)
        index += 1
        let array = []
        for (let i = 0; i < length; i++) {
            array.push(this.buf.readInt32LE(index))
            index += 4
        }
        return [index, array]
    }
}
