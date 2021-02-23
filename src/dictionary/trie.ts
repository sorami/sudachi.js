export class Trie {
    private array: DataView
    private size: number

    constructor(array: DataView, size: number) {
        this.array = array
        this.size = size
    }

    totalSize(): number {
        return 4 * this.size
    }

    commonPrefixSearch(input: Uint8Array, offset: number): [number, number][] {
        let result: [number, number][] = []

        let nodePos = 0
        const unit = this.array.getUint32(nodePos * 4, true /* Little Endian */)
        nodePos ^= this.offset(unit)

        for (let i = offset; i < input.length; i++) {
            const k = input[i] as number
            nodePos ^= k
            const unit = this.array.getUint32(nodePos * 4, true)
            if (this.label(unit) != k) {
                return result
            }

            nodePos ^= this.offset(unit)
            if (this.hasLeaf(unit)) {
                const r: [number, number] = [
                    this.value(this.array.getUint32(nodePos * 4, true)),
                    i + 1,
                ]
                result.push(r)
            }
        }

        return result
    }

    private hasLeaf(unit: number): boolean {
        return ((unit >> 8) & 1) == 1
    }

    private value(unit: number): number {
        return unit & ((1 << 31) - 1)
    }

    private label(unit: number): number {
        return unit & ((1 << 31) | 0xff)
    }

    private offset(unit: number): number {
        return (unit >> 10) << ((unit & (1 << 9)) >> 6)
    }
}
