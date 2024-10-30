type ChanceDisplayProps = {
    chance: number;
    value?: number;
}

function ChanceDisplay(props: ChanceDisplayProps) {
    return (
        <div className="chanceDisplay">
            <div>{((props.chance * 100)?.toFixed(1) ?? "0.0") + "%"}</div>
            {
                props.value !== undefined ? <div className="vbar"></div> : null
            }
            {
                props.value !== undefined ? <div>{props.value!.toFixed(0)}</div> : null
            }
        </div>
    );
}

export default ChanceDisplay;