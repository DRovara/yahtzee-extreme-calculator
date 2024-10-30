import Category from "./Category";
import { probLess, valueWithFreeD6 } from "./Utils";

export default class ChanceCategory extends Category {

    check(d10: number, d6s: number[]): boolean {
        return true;
    }

    canAchieve(d10: number, d6s: number[]): boolean {
        return true;
    }

    double: boolean;

    constructor(double: boolean) {
        super((double ? "Super " : "") + "Chance");
        this.double = double;
    }

    getChances(d10: number, d6s: number[]): number[] {
        return [1, 1, 1];
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
        const dice = [d10, ...d6s];
        const free = dice.filter((x) => x === -1).length;
        const current = dice.reduce((acc, x) => acc + x, 0);

        const result = [
            current + valueWithFreeD6(1, free),
            current + valueWithFreeD6(2, free),
            current + valueWithFreeD6(3, free)
        ];

        if(this.double) {
            this.vectorMult(result, 2);
        }
        return result;
    }

}