import Category from "./Category";
import { probLess, valueWithFreeD6 } from "./Utils";

export default class TuplesCategory extends Category {

    check(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            const correct = dice.filter((x) => x === i).length;
            if(correct >= this.size) {
                return true;
            }
        }
        return false;
    }

    canAchieve(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        const free = dice.filter((x) => x === -1).length;
        for(let i = 1; i <= 6; i++) {
            const correct = dice.filter((x) => x === i).length;
            if(correct + free >= this.size) {
                return true;
            }
        }
        return false;
    }
    size: number;

    constructor(size: number) {
        super(size === 3 ? "!LARGE⚂ ⚂ ⚂" : "!LARGE⚃ ⚃ ⚃ ⚃");
        if(size < 3 || size > 4) {
            throw new Error("Invalid size for tuples category");
        }
        this.size = size;
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

        const res = this.getChanceForNumber(d10, d6s, 1);
        for(let i = 2; i <= 6; i++) {
            this.vectorAdd(res, this.getChanceForNumber(d10, d6s, i));
        }
        return res;
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

        const res = [0, 0, 0];

        for(let i = 1; i <= 6; i++) {
            const chance = this.getChanceForNumber(d10, d6s, i);
            const remainingD6s = d6s.filter((x) => x === - 1).length;
            const correct = [d10, ...d6s].filter((x) => x === i).length;
            const free = Math.min(correct, this.size) + remainingD6s - this.size;
            let baseScore = d6s.reduce((p, x) => p + Math.max(0, x)) + d10;
            baseScore += Math.max(0, this.size - correct) * i;
            chance[0] *= baseScore + valueWithFreeD6(1, free);
            chance[1] *= baseScore + chance[0] * valueWithFreeD6(2, free) + (chance[1] - chance[0]) * valueWithFreeD6(1, free);
            chance[2] *= baseScore + chance[0] * valueWithFreeD6(3, free) + (chance[1] - chance[0]) * valueWithFreeD6(2, free) + (chance[2] - chance[1]) * valueWithFreeD6(1, free);
            this.vectorAdd(res, chance);
        }

        return res;
    }

    getChanceForNumber(d10: number, d6s: number[], target: number): number[] {
        const dice = [d10, ...d6s];
        const correct = dice.filter((x) => x === target).length;
        const free = d6s.filter((x) => x === -1).length;

        return [
            1 - probLess(1, this.size - correct, free),
            1 - probLess(2, this.size - correct, free),
            1 - probLess(3, this.size - correct, free),
        ]
    }


}