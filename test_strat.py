import random
from typing import Callable
N = [4, 4]

# Type: ReplacementStrategy(existing: list[int], throw: list[int], remaining_throws: int) -> list[int]
ReplacementStrategy = Callable[[list[int], list[int], int], list[int]]
CombinationChecker = Callable[[list[int]], tuple[bool, int]]

def trial(strat: ReplacementStrategy, checker: CombinationChecker, starting_point: list[int] = None) -> list[tuple[bool, int]]:
    all_x = []
    x = [random.randint(1, 6) for _ in range(5)] if starting_point is None else (starting_point + [random.randint(1, 6) for _ in range(5 - len(starting_point))])
    all_x.append(x)
    to_keep = []
    new = x
    for i in range(2):
        kept = strat(to_keep, new, 2 - i)
        to_keep.extend(kept)
        new = [random.randint(1, 6) for _ in range(5 - len(to_keep))]
        all_x.append(to_keep + new)
    return [checker(y) for y in all_x]

def threePairsChecker(x: list[int]) -> tuple[bool, int]:
    x.sort()
    y = set(x)
    if len(y) != 3:
        return (False, 0)
    if any(x.count(z) == 3 for z in y):
        return False, 0
    return True, 35

def threePairsReplacementStrategy(existing: list[int], new: list[int], throws: int) -> list[int]:
    existing.sort()
    new.sort()
    keep = []
    for x in new:
        if existing.count(x) == 1:
            keep.append(x)
            continue
        if existing.count(x) >= 2:
            continue
        if existing.count(x) == 0 and new.count(x) >= 2 and keep.count(x) < 2:
            keep.append(x)
            continue
        if existing.count(x) == 0 and len(set(existing + keep)) < 3:
            keep.append(x)
            continue
    return keep
    

if __name__ == "__main__":
    M = 1000000
    results = [trial(threePairsReplacementStrategy, threePairsChecker, [1]) for _ in range(M)]
    sums = [0, 0, 0]
    wins = [0, 0, 0]
    for x in results:
        sums[0] += x[0][1]
        sums[1] += x[1][1]
        sums[2] += x[2][1]
        wins[0] += x[0][0]
        wins[1] += x[1][0]
        wins[2] += x[2][0]
    print([s/M for s in sums])
    print([s/M for s in wins])
    