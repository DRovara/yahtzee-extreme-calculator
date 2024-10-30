import ChanceDisplay from "./ChanceDisplay";

type CategoryChancesProps = {
    category: string;
    chances: number[];
    values?: number[];
}

function CategoryChances(props: CategoryChancesProps) {
    let style = "";
    let name = props.category;
    if(props.category.startsWith("!HUGE")) {
        style = "hugeIcon";
        name = name.substring(5);
    }
    if(props.category.startsWith("!LARGE")) {
        style = "largeIcon";
        name = name.substring(6);
    }
    if(props.category.startsWith("!BIG")) {
        style = "bigIcon";
        name = name.substring(4);
    }
    return (
        <div className={"categoryChances" + (props.chances[2] === 0 ? " impossibleChances" : "")}>
            <div className="icon"><div className={style}>{name}</div></div>
            <ChanceDisplay chance={props.chances[0]} value={props.values ? props.values[0] : undefined}/>
            <ChanceDisplay chance={props.chances[1]} value={props.values ? props.values[1] : undefined}/>
            <ChanceDisplay chance={props.chances[2]} value={props.values ? props.values[2] : undefined}/>
        </div>
    );
}

export default CategoryChances;