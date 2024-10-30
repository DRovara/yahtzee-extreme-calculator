import Category from "./Category";
import { probLess } from "./Utils";

export default class ExtremeYahtzeeCategory extends Category {
    constructor() {
        super("!HUGE!!");
    }

    check(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            const correct = dice.filter((x) => x === i).length;
            if(correct >= 6) {
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
        return most + free >= 6;
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

        return [
            1 - probLess(1, free, free),
            1 - probLess(2, free, free),
            1 - probLess(3, free, free)
        ];

    }

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, 75);

        return chances;
    }

}