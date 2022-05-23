import Board from "../Board";
import { BoardCell } from "../BoardCell";
import IChangeInfo from "../IChangeInfo";
import Violation from "../Violation";

export default interface IConstraint<T> {
    constraintIndecies: number[];
    possibilityCount: number | undefined;
    
    check(board: Board<T>): Violation<T> | undefined;
    enumerate(): {index: number, value: T}[];
    adjust(board: Board<T>, change: IChangeInfo<T>): IConstraintAdjustResult<T> | undefined; // Undefined means we weren't actually affected
}

export interface IConstraintAdjustResult<T> {
    constraint: IConstraint<T> | undefined; // Undefined means this constraint is resolved
    changes?: {index: number, newValue: BoardCell<T>}[];
}