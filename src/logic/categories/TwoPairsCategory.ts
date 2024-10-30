import Category from "./Category";
import { probLess, valueWithFreeD6 } from "./Utils";

export default class TwoPairsCategory extends Category {
    constructor() {
        super("!LARGE⚀ ⚀ ⚁ ⚁");
    }

    check(d10: number, d6s: number[]): boolean {
        let pairs = 0;
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            let counter = 0;
            for(const d of dice) {
                if (d === i)
                    counter++;
            }
            if(counter >= 2) {
                pairs++;
            }
        }
        return pairs >= 2;
    }
    canAchieve(d10: number, d6s: number[]): boolean {
        let pairs = 0;
        const dice = [d10, ...d6s];
        const pairDigits: number[] = [];
        for(let i = 1; i <= 6; i++) {
            let counter = 0;
            for(const d of dice) {
                if (d === i)
                    counter++;
            }
            if(counter >= 2) {
                pairs++;
                pairDigits.push(i);
            }
        }
        const nonPairDigits = new Array(6).fill(0).map((_, i) => i + 1).filter((x) => !pairDigits.includes(x)).length;

        const free = dice.filter((x) => x === -1).length;
        return pairs >= 2 || (pairs === 1 && (free >= 2 || (nonPairDigits >= 1 && free >= 1))) || free >= 4 || (nonPairDigits >= 2 && free >= 2) || (nonPairDigits >= 1 && free >= 3);
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

        let pairs = 0;
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            let counter = 0;
            for(const d of dice) {
                if (d === i)
                    counter++;
            }
            if(counter >= 2) {
                pairs++;
            }
        }

        if(pairs >= 2) {
            return [1, 1, 1];
        }
        const res = [0, 0, 0];
        for(let i = 1; i <= 6; i++) {
            for(let j = i + 1; j <= 6; j++) {
                this.vectorAdd(res, this.getChanceForPairs(d10, d6s, i, j));
            }
        }
        return res;
    }

    getChanceForPairs(d10: number, d6s: number[], pair1: number, pair2: number): number[] {
        const dice = [d10, ...d6s];
        const free = d6s.filter((x) => x === -1).length;
        const missing1 = Math.max(0, 2 - dice.filter((d) => d === pair1).length);
        const missing2 = Math.max(0, 2 - dice.filter((d) => d === pair2).length);
        if(missing1 === 0 && missing2 === 0) {
            return [1, 1, 1];
        }
        // TODO: Is this correct? Can we just say missing1 + missing2?
        return [
            1 - probLess(1, missing1 + missing2, free),
            1 - probLess(2, missing1 + missing2, free),
            1 - probLess(3, missing1 + missing2, free),
        ];
    }

    getValues(d10: number, d6s: number[]): number[] {
        if (d10 === -1) {
            const res = this.getValues(0, d6s);
            for(let i = 1; i < 10; i++) {
                this.vectorAdd(res, this.getValues(i, d6s));
            }
            this.vectorMult(res, 0.1);
            return res;
        }

        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, 35);

        return chances;
    }
    
}