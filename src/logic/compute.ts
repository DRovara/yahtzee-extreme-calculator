import BigsCategory from "./categories/BigsCategory";
import ChanceCategory from "./categories/ChanceCategory";
import DigitCategory from "./categories/DigitCategory";
import ExtremeYahtzeeCategory from "./categories/ExtremeYahtzeeCategory";
import FullHouseCategory from "./categories/FullHouseCategory";
import SmallsCategory from "./categories/SmallsCategory";
import { LargeStraightCategory, HighwayStraightCategory, SmallStraightCategory } from "./categories/StraightCategory";
import TuplesCategory from "./categories/TuplesCategory";
import TwoPairsCategory from "./categories/TwoPairsCategory";
import TwoTriplesCategory from "./categories/TwoTriplesCategory";
import YahtzeeCategory from "./categories/YahtzeeCategory";

const ALL_CATEGORIES = [
    new DigitCategory(1),
    new DigitCategory(2),
    new DigitCategory(3),
    new DigitCategory(4),
    new DigitCategory(5),
    new DigitCategory(6),
    new TuplesCategory(3),
    new TuplesCategory(4),
    new TwoPairsCategory(),
    new TwoTriplesCategory(),
    new FullHouseCategory(false),
    new FullHouseCategory(true),
    new SmallStraightCategory(),
    new LargeStraightCategory(),
    new HighwayStraightCategory(),
    new YahtzeeCategory(),
    new ExtremeYahtzeeCategory(),
    new SmallsCategory(),
    new BigsCategory(),
    new ChanceCategory(false),
    new ChanceCategory(true),
];

function getAllChances(dice: number[]): {[key: string]: number[]} {
    const chances: {[key: string]: number[]} = {};

    for (const category of ALL_CATEGORIES) {
        chances[category.name] = category.getChances(dice[0], dice.slice(1));
    }
    return chances;
}

function getAllValues(dice: number[]): {[key: string]: number[]} {
    const values: {[key: string]: number[]} = {};
    
    for (const category of ALL_CATEGORIES) {
        values[category.name] = category.getValues(dice[0], dice.slice(1));
    }

    return values;
}

export { getAllChances, getAllValues };