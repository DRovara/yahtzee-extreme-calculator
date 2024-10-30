import { useState } from "react";
import CategoryList from "./CategoryList";
import DieBar from "./DieBar";

function CalcScreen() {
    const [dice, setDice] = useState<number[]>([0, 1, 1, 1, 1, 1]);
    const red = [true, false, false, false, false, false];
    const [enabled, setEnabled] = useState<boolean[]>([true, true, true, true, true, true]);

    const updateMinMax = (min: number, max: number, index: number) => {
        return (d: number) => {
            if(d === 0) {
                setEnabled((prev) => prev.map((x, i) => i === index ? !x : x));
            } else {
                setDice((prev) => prev.map((x, i) => i === index ? Math.max(min, Math.min(max, x + d)) : x));
            }
        };
    };

    const updateFunctions = dice.map((_, i) => i === 0 ? updateMinMax(0, 9, i) : updateMinMax(1, 6, i));

    return (
    <div className="calcScreen">
        <DieBar dice={dice} red={red} updateDiceValues={updateFunctions} enabled={enabled}/>
        <CategoryList dice={dice.map((x, i) => enabled[i] ? x : -1)}/>
    </div>
    );
}

export default CalcScreen;