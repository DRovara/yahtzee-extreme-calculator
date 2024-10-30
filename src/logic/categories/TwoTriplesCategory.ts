import Category from "./Category";
import { probLess, valueWithFreeD6, fact, bin, probLessOfN } from "./Utils";

export default class TwoTriplesCategory extends Category {
    constructor() {
        super("!LARGE⚀⚀⚀ ⚁⚁⚁");
    }

    check(d10: number, d6s: number[]): boolean {
        let triples = 0;
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            let counter = 0;
            for(const d of dice) {
                if (d === i)
                    counter++;
            }
            if(counter === 3) {
                triples++;
            }
        }
        return triples === 2;
    }
    canAchieve(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        const counts: number[] = [0, 0, 0, 0, 0, 0];
        if (d10 === 0 || d10 > 6) {
            return false;
        }
        for(let i = 1; i <= 6; i++) {
            for(const d of dice) {
                if (d === i)
                    counts[i - 1]++;
            }
        }
        return counts.filter((x) => x >= 0).length <= 2;
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

        if (!this.canAchieve(d10, d6s)) {
            return [0, 0, 0];
        }

        const dice = [d10, ...d6s];
        const free = dice.filter((x) => x === -1).length;
        const fixed = dice.filter((x) => x !== -1);
        const first = fixed.sort()[0];
        const last = fixed.sort()[fixed.length - 1];
        if (first === last) {
            // only one digit is fixed so far
            const remaining = 3 - fixed.length;
            return [
                bin(free, remaining) * Math.pow(1/6, remaining) * Math.pow(5/6, free - remaining) * Math.pow(1/6, 2) * 5/6,
                (1 - probLess(2, remaining, free)) * Math.pow(1/6, 2) * 5/6, // This assumes that we throw non-targets back
                (1 - probLess(3, remaining, free)) * Math.pow(1/6, 3) * 5/6  // in until the last throw.
            ]
        } else {
            const remainingA = 3 - fixed.filter((x) => x === first).length;
            const remainingB = 3 - fixed.filter((x) => x === last).length;
            return [
                1 - probLessOfN(1, remainingA + remainingB, free, 2),
                1 - probLessOfN(2, remainingA + remainingB, free, 2),
                1 - probLessOfN(3, remainingA + remainingB, free, 2),
            ]
        }
    }

    

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, 45);

        return chances;
    }
    
}