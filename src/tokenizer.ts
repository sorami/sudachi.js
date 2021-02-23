import { Grammar } from './dictionary/grammar'
import { Lexicon } from './dictionary/lexicon'
import { UTF8INputText, UTF8InputTextBuilder } from './utf8InputText'
import { Lattice } from './lattice'

export class Tokenizer {
    private grammar: Grammar
    private lexicon: Lexicon

    private lattice: Lattice

    constructor(grammar: Grammar, lexicon: Lexicon) {
        this.grammar = grammar
        this.lexicon = lexicon
        this.lattice = new Lattice(this.grammar)
    }

    tokenize(text: string) {
        const input = this.buildInputText(text)

        // TODO: sentence splitting

        this.buildLattice(input)
        // TODO: path: LatticeNode[] = lattice.getBestPath()
        // TODO: return new MorphemeList(input, grammar, lexicon, path)

        return input
    }

    buildInputText(text: string) {
        // TODO: run all inputTextPlugins

        const builder = new UTF8InputTextBuilder(text, this.grammar)
        return builder.build()
    }

    buildLattice(input: UTF8INputText) {
        const bytes = input.bytes
        //this.lattice.resize(bytes.byteLength)

        for (let i = 0; i < bytes.byteLength; i++) {
            //            console.log(bytes[i])
        }
    }
}
