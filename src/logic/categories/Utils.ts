function fact(n: number): number {
    let result = 1;
    for(let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

function bin(n: number, k: number) {
    return fact(n) / (fact(k) * fact(n - k));
}
function probLess(throws: number, remaining: number, free: number): number {
    if(remaining <= 0) {
        return 0;
    }
    if(throws <= 0) {
        return 1;
    }
    let result = 0;
    for(let i = 0; i <= free; i++) {
        result += bin(free, i) * Math.pow(1/6, i) * Math.pow(5/6, free - i) * probLess(throws - 1, remaining - i, free - i);
    }
    return result;
};

// This is just an approximation
function probLessOfN(throws: number, remaining: number, free: number, n: number): number {
    if(remaining <= 0) {
        return 0;
    }
    if(throws <= 0) {
        return 1;
    }
    let result = 0;
    for(let i = 0; i <= free; i++) {
        result += bin(free, i) * Math.pow(n/6, i) * Math.pow((6-n)/6, free - i) * probLessOfN(throws - 1, remaining - i, free - i, n);
    }
    return result;
}

function valueWithFreeD6(throws: number, free: number): number {
    if(throws === 0) {
        return 3.5 * free;
    }
    if(throws === 1) {
        // If we throw 4,5,6, we keep the value. 
        // Otherwise, we throw again (leading to 3.5 on average).
        return 15/6 * free + 3/6 * valueWithFreeD6(0, free);
    }
    
    return 11/6 * free + 4/6 * valueWithFreeD6(1, free);
}

export { probLess, valueWithFreeD6, bin, fact, probLessOfN };