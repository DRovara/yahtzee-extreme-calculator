import Category from "./Category";
import { probLess, valueWithFreeD6, fact, bin, probLessOfN } from "./Utils";

export default class FullHouseCategory extends Category {
    big: boolean;

    constructor(big: boolean) {
        super(big ? "!BIG⚃⚃⚃⚃ ⚁⚁" : "!LARGE⚂⚂⚂  ⚁⚁");
        this.big = big;
    }

    largeTupleSize(): number {
        return this.big ? 4 : 3;
    }

    check(d10: number, d6s: number[]): boolean {
        let largeTuples = 0;
        let pairs = 0;
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            let counter = 0;
            for(const d of dice) {
                if (d === i)
                    counter++;
            }
            if(counter >= this.largeTupleSize()) {
                largeTuples++;
            }
            if(counter >= 2) {
                pairs++;
            }
        }
        return pairs >= 2 && largeTuples >= 1;
    }
    canAchieve(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        const counts: number[] = [0, 0, 0, 0, 0, 0];
        for(let i = 1; i <= 6; i++) {
            for(const d of dice) {
                if (d === i)
                    counts[i - 1]++;
            }
        }
        counts.sort();
        const biggest = counts[counts.length - 1];
        const second = counts[counts.length - 2];
        const missing = (this.largeTupleSize() - biggest) + (2 - second);
        return dice.filter((x) => x === - 1).length >= missing;
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

        const counts: number[] = [0, 0, 0, 0, 0, 0];
        for(let i = 1; i <= 6; i++) {
            for(const d of dice) {
                if (d === i)
                    counts[i - 1]++;
            }
        }
        counts.sort();
        const biggest = this.largeTupleSize() - counts[counts.length - 1];
        const second = 2 - counts[counts.length - 2];
        const free = dice.filter((x) => x === -1).length;

        if (biggest <= 0 && second <= 0) {
            return [1, 1, 1];
        }

        if (biggest <= 0) {
            return [
                1 - probLess(1, second, free),
                1 - probLess(2, second, free),
                1 - probLess(3, second, free)
            ]
        }

        if (second <= 0) {
            return [
                1 - probLess(1, biggest, free),
                1 - probLess(2, biggest, free),
                1 - probLess(3, biggest, free)
            ]
        }

        // TODO approximation used here
        return [
            1 - probLessOfN(1, biggest + second, free, 2),
            1 - probLessOfN(2, biggest + second, free, 2),
            1 - probLessOfN(3, biggest + second, free, 2)
        ]
    }

    

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, this.big ? 45 : 25);

        return chances;
    }
    
}