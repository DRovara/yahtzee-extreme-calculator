import Category from "./Category";
import { probLess, valueWithFreeD6, fact, bin, probLessOfN } from "./Utils";

class CacheEntry {
    d10: number;
    d6s: number[];
    throws: number;

    constructor(d10: number, d6s: number[], throws: number) {
        this.d10 = d10;
        this.d6s = d6s;
        this.throws = throws;
    }

    equals(other: CacheEntry) {
        return this.d10 === other.d10 && this.d6s.every((x) => other.d6s.includes(x)) && other.d6s.every((x) => this.d6s.includes(x)) && this.throws === other.throws;
    }

    getKey() {
        return this.d10.toString() + ";" + this.d6s.join(",") + ";" + this.throws.toString();
    }
}

abstract class StraightCategory extends Category {
    size: number;
    score: number

    chancesCache: Map<string, number>;

    constructor(name: string, size: number, score: number) {
        super(name);
        this.size = size;
        this.score = score;

        this.chancesCache = new Map();
    }

    check(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        const fixed = dice.filter((x) => x !== -1).sort();

        let prev = -1;
        let straight = 0;
        for(const d of fixed) {
            if(d === prev)
                continue;
            if(prev !== -1 && prev !== d - 1) {
                prev = -1;
                straight = 0;
            }
            prev = d;
            straight++;

            if(straight === this.size) {
                return true;
            }
        }
        return false;
    }

    canAchieve(d10: number, d6s: number[]): boolean {
        const dice = [d10, ...d6s];
        const fixed = dice.filter((x) => x !== -1).sort();
        const free = dice.filter((x) => x === -1).length;

        for(let i = 0; i < fixed.length; i++) {
            let budget = free;
            let size = 1;
            for(let j = i + 1; j < fixed.length; j++) {
                if(fixed[j] === fixed[j - 1] + 1) {
                    size += 1;
                    continue;
                }
                if(fixed[j] === fixed[j - 1]) {
                    continue;
                }
                if(fixed[j] - fixed[j - 1] - 1 < budget) {
                    budget -= fixed[j] - fixed[j - 1] - 1;
                    size += fixed[j] - fixed[j - 1];
                    continue;
                } else {
                    break;
                }
            }
            if(size >= this.size) {
                return true;
            }
            if(size + budget < this.size) {
                continue;
            }
            const before = Math.min(budget, fixed[i] - 1 + (d10 === -1 ? 1 : 0));
            budget -= before;
            size += before;
            const after = Math.min(budget, 6 - fixed[fixed.length - 1]);
            size += after;
            if (size >= this.size) {
                return true;
            }
        }
        
        return false;
    }
    

    getValues(d10: number, d6s: number[]): number[] {
        const chances = this.getChances(d10, d6s);
        this.vectorMult(chances, this.score);
        return chances;
    }

    replacementStrategy(d10: number, previousD6s: number[], newD6s: number[]): number[] {
        const dice = [d10, ...previousD6s];
        const nonRepeats = newD6s.filter((x) => !dice.includes(x)).sort();

        let optimal = -1;
        let optimalLeft = -1;
        let optimalRight = -1;

        for(let left = 0; left < nonRepeats.length; left++) {
            for(let right = 0; right < nonRepeats.length - left - 1; right++) {
                const end = nonRepeats.length - right - 1;
                if(end - left < optimal) {
                    break;
                }
                const trial = nonRepeats.filter((_, i) => i >= left && i <= end);
                if(!this.canAchieve(d10, [...previousD6s, ...trial])) {
                    continue;
                }
                optimal = end - left;
                optimalLeft = left;
                optimalRight = right;
            }
        }

        if(optimal === -1) {
            return [...previousD6s, ...newD6s.map((x) => -1)];
        }

        const assignment = nonRepeats.filter((_, i) => i >= optimalLeft && i <= nonRepeats.length - optimalRight - 1);
        const output = [...previousD6s, ...assignment];
        for(let i = 0; i < newD6s.length - assignment.length; i++) {
            output.push(-1);
        }

        if(output.length !== 5) {
            throw new Error("Invalid replacement strategy");
        }

        return output;
    }

    calcChances(d10: number, d6s: number[], throws: number) : number {
        const cacheKey = new CacheEntry(d10, d6s, throws).getKey();
        if(this.chancesCache.has(cacheKey)) {
            return this.chancesCache.get(cacheKey)!;
        }

        const fixed = d6s.filter((x) => x !== -1).sort();
        const free = d6s.filter((x) => x === -1).length;

        if(!this.canAchieve(d10, d6s)) {
            this.chancesCache.set(cacheKey, 0);
            return 0;
        }
        
        if(free === 0) {
            this.chancesCache.set(cacheKey, this.check(d10, d6s) ? 1 : 0);
            return this.check(d10, d6s) ? 1 : 0;
        }

        const assignment = new Array(free).fill(1);
        let count = 0;
        for(let i = 0; i < Math.pow(6, free); i++) {
            if(i !== 0) {
                assignment[0]++;
                for(let j = 0; j < free; j++) {
                    if(assignment[j] === 7) {
                        assignment[j] = 1;
                        assignment[j + 1]++;
                    }
                }
            }
            const newD6s = [...fixed, ...assignment];
            if(this.check(d10, newD6s)) {
                count++;
            } else if(throws > 1) {
                count += this.calcChances(d10, this.replacementStrategy(d10, fixed, assignment), throws - 1);
            }
        }
        const result = count / Math.pow(6, free);
        this.chancesCache.set(cacheKey, result);
        return result;
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

        const dice = [d10, ...d6s];

        return [
            this.calcChances(d10, d6s, 1),
            this.calcChances(d10, d6s, 2),
            this.calcChances(d10, d6s, 3)
        ]
    }
    
}

class SmallStraightCategory extends StraightCategory {
    constructor() {
        super("!LARGE- - -", 4, 30);
    }
}

class LargeStraightCategory extends StraightCategory {
    constructor() {
        super("!LARGE- - - -", 5, 40);
    }
}

class HighwayStraightCategory extends StraightCategory {
    constructor() {
        super("!LARGE= = = =", 6, 50);
    }
}

export { SmallStraightCategory, LargeStraightCategory, HighwayStraightCategory };