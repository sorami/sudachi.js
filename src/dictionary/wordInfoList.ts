export class WordInfoList {
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
