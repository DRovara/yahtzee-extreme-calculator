export default abstract class Category {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract check(d10: number, d6s: number[]): boolean
    abstract canAchieve(d10: number, d6s: number[]): boolean

    abstract getChances(d10: number, d6s: number[]): number[]
    abstract getValues(d10: number, d6s: number[]): number[]

    vectorMult(vec: number[], factor: number) {
        for(let i = 0; i < vec.length; i++) {
            vec[i] *= factor;
        }
    }

    vectorAdd(vec1: number[], vec2: number[]) {
        for(let i = 0; i < vec1.length; i++) {
            vec1[i] += vec2[i];
        }
    }
}