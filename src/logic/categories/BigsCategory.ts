import Category from "./Category";

const P: {[k1: number]: {[k2: number]: number}} = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {}
}
const f = (x: number, s: number) => {
    if(x === 0) {
        return s === 0 ? 1 : 0;
    }
    if(x === 1) {
        if(s <= 0) {
            return 0;
        }
        if(s >= 7) {
            return 1;
        }
        return 1/6;
    }
    let sum = 0;
    for(let i = 1; i <= 6; i++) {
        sum += f(x - 1, s - i) / 6;
    }
    return sum;
}
for(let i = 0; i <= 5; i++) {
    for(let j = 0; j <= 33; j++) {
        P[i][j] = f(i, j);
    }
}


export default class BigsCategory extends Category {

    constructor() {
        super("≥ 33")
    }
    
    check(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s].filter((x) => x !== -1);
        return dice.length === 6 && dice.reduce((acc, x) => acc + x, 0) >= 33;
    }
    canAchieve(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s].filter((x) => x !== -1);
        const maximumFree = (d10 === -1 ? 9 : 0) + 6 * d6s.filter((x) => x === -1).length;
        return dice.reduce((acc, x) => acc + x, 0) + maximumFree >= 33;
    }

    getChances(d10: number, d6s: number[]): number[] {
        if (d10 === -1) {
            const res = this.getChances(0, d6s);
            for(let i = 1; i < 10; i++) {
                this.vectorAdd(res, this.getChances(i, d6s));
            }
            this.vectorMult(res, 0.1);
            return res;
        }

        if(this.check(d10, d6s)) {
            return [1, 1, 1];
        }

        if(!this.canAchieve(d10, d6s)) {
            return [0, 0, 0];
        }

        const dice = [d10, ...d6s];
        const free = dice.filter((x) => x === -1).length;
        const fixed = dice.filter((x) => x !== -1);
        const sum = fixed.reduce((acc, x) => acc + x, 0);
        const missing = 33 - sum;

        return [
            this.getChancesOf(free, missing),
            this.getChancesOfTwo(free, missing),
            this.getChancesOfThree(free, missing)
        ]

    }

    getChancesOf(free: number, target: number): number {
        let p = 0;
        const max = free * 6;
        for(let i = target; i <= max; i++) {
            p += P[free][i];
        }
        return p;
    }

    getChancesOfTwo(free: number, target: number): number {
        let p = 0;
        const max = free * 6;
        for(let i = target; i <= max; i++) {
            p += P[free][i];
        }
        const expectedHighNumbers = Math.round(1/2 * free);
        return p + (1 - p) * this.getChancesOf(free - expectedHighNumbers, target - 5 * expectedHighNumbers);
    }

    getChancesOfThree(free: number, target: number): number {
        let p = 0;
        const max = free * 6;
        for(let i = target; i <= max; i++) {
            p += P[free][i];
        }
        const expectedHighNumbers = Math.round(1/3 * free);
        return p + (1 - p) * this.getChancesOfTwo(free - expectedHighNumbers, target - Math.floor(5.5 * expectedHighNumbers));
    }

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, 40);

        return chances;
    }

}