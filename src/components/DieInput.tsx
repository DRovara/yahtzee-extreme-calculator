import "./components.css"

type DieInputProps = {
    value: number;
    updateValue: (d: number) => void;
    enabled: boolean;
    red: boolean;
}

function DieInput(props: DieInputProps) {

    return (
        <div className={"dieInputBox"}>
            <button className={props.enabled ? "dieInputUp" : "dieInputArrowHidden"} onClick={() => props.updateValue(1)}>+</button>
            <div className="dieInputSquare" onClick={() => props.updateValue(0)}><div className={props.enabled ? ((props.red ? "dieInputValueActiveRed " : "") + "dieInputValueActive") : "dieInputValueInActive"}><p>{props.enabled ? props.value : ""}</p></div></div>
            <button className={props.enabled ? "dieInputDown" : "dieInputArrowHidden"} onClick={() => props.updateValue(-1)}>-</button>
        </div>
    );
}

export default DieInput;