import { Grammar } from './dictionary/grammar'

export class UTF8InputTextBuilder {
    grammar: Grammar
    originalText: string
    modifiedText: string ///
    modifiedToOriginal: number[]

    constructor(text: string, grammar: Grammar) {
        this.grammar = grammar
        this.originalText = text
        this.modifiedText = text /// TODO
        this.modifiedToOriginal = []

        // TODO: fill modifiedToOriginal
        for (let i = 0; i < this.originalText.length; i++) {
            // TODO: check surrogate pairs
        }
    }

    build(): UTF8INputText {
        const byteText = Buffer.from(this.modifiedText, 'utf-8')
        // TODO: more processing
        return new UTF8INputText(this.originalText, this.modifiedText, byteText)
    }
}

export class UTF8INputText {
    originalText: string
    modifiedText: string
    bytes: ArrayBuffer
    // TODO: add more propeties

    constructor(
        originalText: string,
        modifiedText: string,
        bytes: ArrayBuffer
    ) {
        this.originalText = originalText
        this.modifiedText = modifiedText
        this.bytes = bytes
    }
}
