import BufferedArray from "../Immutable/BufferedArray";
import { BoardCell } from "./BoardCell";
import IConstraint from "./Constraints/IConstraint";

export default class Board<T> {
    public cells: BufferedArray<BoardCell<T>>;
    public criteria: BufferedArray<IConstraint<T> | undefined>;

    constructor(cells: BufferedArray<BoardCell<T>>, criteria: BufferedArray<IConstraint<T> | undefined>) {
        this.cells = cells;
        this.criteria = criteria;
    }
}