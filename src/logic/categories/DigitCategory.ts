import Category from "./Category";
import { probLess } from "./Utils";

const DIGIT_SYMBOLS = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]

export default class DigitCategory extends Category {
    digit: number;

    constructor(digit: number) {
        super(`!HUGE${DIGIT_SYMBOLS[digit - 1]}`);
        this.digit = digit;
    }

    check(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        return dice.filter((d) => d === this.digit).length >= 3;
    }

    canAchieve(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        return (dice.filter((d) => d === this.digit).length +
        dice.filter((d) => d === -1).length) >= 3;
    }

    getChances(d10: number, d6s: number[]): number[] {
        const dice = [d10, ...d6s];

        const freeD6s = d6s.filter((d) => d === -1).length;
        const freeD10 = d10 === -1 ? 1 : 0;
        const freeDice = freeD6s + freeD10;

        const correctDice = dice.filter((d) => d === this.digit).length;
        
        const missing = 3 - correctDice;
        const result = [0, 0, 0];
        if (missing > freeDice) {
            return result;
        }
        if (missing <= 0) {
            return [1, 1, 1];
        }
        
        if (missing === 1) {
            // The d10 only gets 1 trial, even with multiple throws.
            return [
                1 - (Math.pow(9/10.0, freeD10) * Math.pow(5/6, freeD6s)), 
                1 - (Math.pow(9/10.0, freeD10) * Math.pow(5/6, freeD6s * 2)), 
                1 - (Math.pow(9/10.0, freeD10) * Math.pow(5/6, freeD6s * 3))
            ];
        }
        if (missing >= 2) {
            const ifD10 = [
                1 - probLess(1, missing - 1, freeD6s),
                1 - probLess(2, missing - 1, freeD6s),
                1 - probLess(3, missing - 1, freeD6s)
            ];
            const ifNotD10 = [
                1 - probLess(1, missing, freeD6s),
                1 - probLess(2, missing, freeD6s),
                1 - probLess(3, missing, freeD6s)
            ];
            return [
                freeD10 === 0 ? ifNotD10[0] : 1/10 * ifD10[0] + 9/10 * ifNotD10[0],
                freeD10 === 0 ? ifNotD10[1] : 1/10 * ifD10[1] + 9/10 * ifNotD10[1],
                freeD10 === 0 ? ifNotD10[2] : 1/10 * ifD10[2] + 9/10 * ifNotD10[2]
            ];
        }
        return [];
    }

    getValues(d10: number, d6s: number[]): number[] {
        const freeD6s = d6s.filter((d) => d === -1).length;
        const correctD6s = d6s.filter((d) => d === this.digit).length;

        const fact = (n: number): number => {
            let result = 1;
            for(let i = 1; i <= n; i++) {
                result *= i;
            }
            return result;
        }
        const bin = (n: number, k: number) => {
            return fact(n) / (fact(k) * fact(n - k));
        }

        const prob = (throws: number, remaining: number, free: number): number => {
            if(remaining < 0) {
                return 0;
            }
            if(remaining === 0) {
                return 1;
            }
            if(throws === 0) {
                return 0;
            }
            let result = 0;
            for(let i = 0; i <= free; i++) {
                result += bin(free, i) * Math.pow(1/6, i) * Math.pow(5/6, free - i) * prob(throws - 1, remaining - i, free - i);
            }
            return result;
        }
        let total = [0, 0, 0];
        for(let i = 1; i <= freeD6s; i++) {
            total[0] += i * prob(1, i, freeD6s);
            total[1] += i * prob(2, i, freeD6s);
            total[2] += i * prob(3, i, freeD6s);
        }
        const d10score = d10 === -1 ? 1 / 10 : (d10 === this.digit ? 1 : 0);
        total[0] += correctD6s + d10score;
        total[1] += correctD6s + d10score;
        total[2] += correctD6s + d10score;
        total[0] *= this.digit;
        total[1] *= this.digit;
        total[2] *= this.digit;
        return total;
    }
}