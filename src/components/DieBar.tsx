import DieInput from "./DieInput";

type DieBarProps = {
    dice: number[];
    red: boolean[];
    enabled: boolean[];
    updateDiceValues: ((d: number) => void)[];
}

function DieBar(props: DieBarProps) {
    return (
        <div className="dieBar">
            {props.dice.map((d, i) => {
                return <DieInput red={props.red[i]} key={i} value={d} updateValue={props.updateDiceValues[i]} enabled={props.enabled[i]}/>
            })}
        </div>
    )
}

export default DieBar;