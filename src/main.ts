import { Command } from 'commander'
import { Dictionary } from './dictionary'

const program = new Command()
program
    .option('-d, --dic <file>', 'dictibonary file', 'resources/system.dic')
    .option('-s, --setting <file>', 'setting file', 'resources/sudachi.json')

program.parse(process.argv)
const options = program.opts()

// function loadSetting(filePath: string) {
//     try {
//         const content = fs.readFileSync(filePath, 'utf8')
//         return JSON.parse(content)
//     } catch (error) {
//         console.error(`Failed to load setting file '${filePath}':`, error)
//         process.exit(1)
//     }
// }
// const settings = loadSetting(options.setting)

const dictionary = new Dictionary(options.dic)

console.log(`version:\t0x${dictionary.header.version.toString(16)}`)
console.log(`create time:\t${dictionary.header.createTime}`)
console.log(`description:\t${dictionary.header.description}`)

const wordInfo = dictionary.lexicon.getWordInfo(9999)
console.log(wordInfo)
console.log(dictionary.grammar.getPartOfSpeechString(wordInfo.posId))
