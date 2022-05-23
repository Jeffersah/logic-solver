import ImSet from "../../Immutable/ImSet";
import BTree from "../../Immutable/Tree/BTree";
import Board from "../Board";
import { isSingleValue } from "../BoardCell";
import IChangeInfo from "../IChangeInfo";
import Violation from "../Violation";
import IConstraint, { IConstraintAdjustResult } from "./IConstraint";

export default class RegionHasConstraint<T> implements IConstraint<T> {
    public possibilityCount: number | undefined;

    constructor(public region: ImSet<number>, public value: T, public constraintIndecies: number[]) {
        this.possibilityCount = this.region.count;
    }

    check(board: Board<T>): Violation<T> | undefined {
        return undefined; // No need to check, a constraint with 0 possibilities is always considered a violation by the solver
    }

    enumerate(): { index: number; value: T; }[] {
        return this.region.toArray().map(index => ({index, value: this.value}));
    }

    adjust(board: Board<T>, change: IChangeInfo<T>): IConstraintAdjustResult<T> | undefined  {
        if(!this.region.has(change.index)) {
            return undefined;
        }

        if(isSingleValue(change.newValue)) {
            if(change.newValue === this.value) {
                // Fulfilled!
                return { constraint: undefined };
            }
        }

        const rmValue = isSingleValue(change.newValue) || !change.newValue.has(this.value);
        if(!rmValue) return undefined; // We could still put this value here, no change

        return {
            constraint: new RegionHasConstraint(this.region.remove(change.index), this.value, this.constraintIndecies),
        }
    }
}