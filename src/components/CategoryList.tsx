import { getAllChances, getAllValues } from "../logic/compute";
import CategoryChances from "./CategoryChances";

type CategoryListProps = {
    dice: number[];
}

function CategoryList(props: CategoryListProps) {
    const chances = getAllChances(props.dice);
    const values = getAllValues(props.dice);
    return (
        <div className="categoryList">
            {
                Object.keys(chances).map((chance, i) => {
                    return (
                        <CategoryChances key={i} category={chance} chances={chances[chance]} values={values[chance]} />
            )})}
        </div>
    );
}

export default CategoryList;