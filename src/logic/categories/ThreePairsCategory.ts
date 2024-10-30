import Category from "./Category";
import { probLess } from "./Utils";

class ThreePairsCategory extends Category {
    constructor() {
        super('ThreePairs');
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
        return pairs >= 3;
    }
    canAchieve(d10: number, d6s: number[]): boolean {
        if(d10 === 0 || d10 >= 7) {
            return false;
        }

        const dice = [d10, ...d6s];
        for(let i = 1; i <= 6; i++) {
            let counter = 0;
            for(const d of dice) {
                if (d === i)
                    counter++;
            }
            if(counter >= 3) {
                return false;
            }
        }
        return true;
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
        const counts = new Array(6).fill(0);
        for(const d of dice) {
            if(d !== -1) {
                counts[d - 1]++;
            }
        }

        const singles = counts.filter((c) => c === 1).length;
        const pairs = counts.filter((c) => c === 2).length;
        const nones = counts.filter((c) => c === 0).length;
        const free = d6s.filter((d) => d === -1).length;

        const missingPairs = 3 - pairs;
        if(missingPairs - singles === 0) {
            // The remaining throws must be exactly the missing singles.
            // TODO: Is this correct? Can we just add up all the singled?
            return [
                1 - probLess(1, singles, free),
                1 - probLess(2, singles, free),
                1 - probLess(3, singles, free)
            ];
        }
        if(missingPairs - singles === 1) {
            // The remaining throws must be exactly the missing singles and one pair.
            const forSingles = [
                1 - probLess(1, singles, free),
                1 - probLess(2, singles, free),
                1 - probLess(3, singles, free)
            ];
            const forPair = [
                4/6 * 1/6,
                1 - ((32/36)*(32/36)) * ((4/6*5/6)*5/6) * ((32/36)*(4/6*5/6)),
                1 - ((32/36)*(32/36)*(32/36)) * ((4/6*5/6)*(5/6)*(5/6)) * ((32/36)*(4/6*5/6)*(5/6)) * ((32/36)*(32/36)*(4/6*5/6))
            ];
            return [
                forSingles[0] * forPair[0],
                forSingles[1] * forPair[1],
                forSingles[2] * forPair[2]
            ];
        }
        if(missingPairs - singles == 2) {
            // These probabilities were computed through simulation
            if(singles == 0) {
                // we need 2 pairs
                return [
                    0.231676, 0.380927, 0.487816
                ];
            }
            return [
                // The remaining throws must be exactly the one missing single and two pairs.
                0.231547, 0.37967, 0.486695
            ];
        }
        return [0, 0, 0]; // missingPairs - singles cannot be 3 because the d10 is always set here.
    }

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, 35);
        return chances;
    }

    
}