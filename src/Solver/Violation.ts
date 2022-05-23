import Board from "./Board";
import IConstraint from "./Constraints/IConstraint";

export default class Violation<T> {
    constructor(
        public constraint: IConstraint<T>,
        public board: Board<T>,
        public message: string
    ) { }
}