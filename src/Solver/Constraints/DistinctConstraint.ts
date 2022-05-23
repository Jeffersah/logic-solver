import ImSet from "../../Immutable/ImSet";
import BTree from "../../Immutable/Tree/BTree";
import Board from "../Board";
import { isSingleValue } from "../BoardCell";
import IChangeInfo from "../IChangeInfo";
import Violation from "../Violation";
import IConstraint, { IConstraintAdjustResult } from "./IConstraint";

export default class DistinctConstraint<T> implements IConstraint<T> {
    public possibilityCount: number | undefined;
    public constraintIndecies: number[];

    constructor(public index: number, public affectedIndecies: ImSet<number>, public values: ImSet<T>) {
        this.possibilityCount = values.count;
        this.constraintIndecies = [index];
    }

    check(board: Board<T>): Violation<T> | undefined {
        return undefined; // No need to check, a constraint with 0 possibilities is always considered a violation by the solver
    }

    enumerate(): { index: number; value: T; }[] {
        return this.values.toArray().map(value => ({index: this.index, value}));
    }

    adjust(board: Board<T>, change: IChangeInfo<T>): IConstraintAdjustResult<T> | undefined  {
        if(change.index === this.index) {
            return this._adjustSelf(board, change);
        }
        else if(change.newValue instanceof ImSet) {
            return undefined;
        }
        else {
            const resultIndecies = this.affectedIndecies.remove(change.index);
            const resultValues = this.values.remove(change.newValue);
            if(resultIndecies.count === this.affectedIndecies.count || resultValues.count === this.values.count) {
                return undefined; // This doesn't actually affect us: Either this value is already restricted, or we don't see that cell.
            }

            return { 
                constraint: new DistinctConstraint(this.index, resultIndecies, resultValues),
                changes: [{ index: this.index, newValue: this.values }]
            }
        }
    }

    _adjustSelf(board: Board<T>, change: IChangeInfo<T>): IConstraintAdjustResult<T> {
        if(isSingleValue(change.newValue)) {
            return { constraint: undefined };
        }
        else {
            return {
                constraint: new DistinctConstraint(this.index, this.affectedIndecies, change.newValue)
            }
        }
    }
}