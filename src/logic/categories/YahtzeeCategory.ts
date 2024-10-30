import Category from "./Category";
import { probLess, valueWithFreeD6 } from "./Utils";

export default class YahtzeeCategory extends Category {
    constructor() {
        super("!HUGE!");
    }

    check(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            const correct = dice.filter((x) => x === i).length;
            if(correct >= 5) {
                return true;
            }
        }
        return false;
    }

    canAchieve(d10: number, d6s: number[]): boolean {
        let most = 0;
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            const correct = dice.filter((x) => x === i).length;
            if(correct > most) {
                most = correct;
            }
        }
        const free = dice.filter((x) => x === -1).length;
        return most + free >= 5;
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

        if(!this.canAchieve(d10, d6s)) {
            return [0, 0, 0];
        }

        const dice = [d10, ...d6s];
        const free = dice.filter((x) => x === -1).length;

        let most = 0;
        for(let i = 1; i <= 6; i++) {
            const correct = dice.filter((x) => x === i).length;
            if(correct > most) {
                most = correct;
            }
        }
        const missing = 5 - most;

        return [
            1 - probLess(1, missing, free),
            1 - probLess(2, missing, free),
            1 - probLess(3, missing, free)
        ];

    }

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, 50);

        return chances;
    }

}