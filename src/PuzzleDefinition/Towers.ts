import { range } from "../ArrayExtensions";
import Point2d, { IPoint2d } from "../Point2d";
import Tree from "../Tree";
import IPuzzleRules from "./IPuzzleRules";

export default class TowersRules implements IPuzzleRules<number, ITowersViolation> {
    private eyes: {value: number, indecies: number[]}[];
    fastCheckInvariants?: ((board: Tree<number[]>, changedIndex: number, newValue: number[]) => ITowersViolation | null) | undefined;
    constructor(public boardSize: number, eyes: ITowersEyeDefinition[])
    {
        this.eyes = [];
        for(const eye of eyes){
            let indecies = [];
            let pt = eye.from;
            while(this.inBounds(pt)){
                indecies.push(this.getIndex(pt));
                pt = Point2d.add(pt, eye.direction);
            }
            this.eyes.push({value: eye.value, indecies});
        }
        this.fastCheckInvariants = this._fastCheckInvariants;
    }

    getIndex(pt: IPoint2d) {
        return pt.x + pt.y * this.boardSize;
    }

    getPt(index: number) {
        return { x: index % this.boardSize, y: Math.floor(index / this.boardSize) };
    }

    inBounds(pt: IPoint2d) {
        return pt.x >= 0 && pt.x < this.boardSize && pt.y >= 0 && pt.y < this.boardSize;
    }

    getAffectedIndecies(board: Tree<number[]>, changedIndex: number, oldValue: number[], value: number[]): number[] {
        if(value.length > 1) return []; // If we've just reduced the possibility set, the change doesn't propagate any further.

        let pt = this.getPt(changedIndex);
        let dx = range(0, this.boardSize);
        return [...dx.filter(x => x != pt.x).map(x => ({ x, y: pt.y})), ...dx.filter(y => y != pt.y).map(y => ({x: pt.x, y}))].map(this.getIndex)
    }

    checkInvariants(board: Tree<number[]>, changedIndecies: number[]): ITowersViolation | null {
        const changedPts = changedIndecies.map(this.getPt);
        const checkRows = range(0, this.boardSize).filter(y => changedPts.some(p => p.y === y));
        const checkCols = range(0, this.boardSize).filter(x => changedPts.some(p => p.x === x));
        const checkEyes = this.eyes.filter(eye => changedIndecies.some(i => eye.indecies.includes(i)));

        for(const row of checkRows){
            const idx = range(0,this.boardSize).map(x => this.getIndex({x, y: row}));
            const inner = this.checkRowOrColumn(board, idx);
            if(inner !== null) return inner;
        }
        for(const col of checkCols){
            const idx = range(0,this.boardSize).map(y => this.getIndex({x: col, y}));
            const inner = this.checkRowOrColumn(board, idx);
            if(inner !== null) return inner;
        }
        for(const eye of checkEyes) {
            const inner = this.checkEye(board, eye);
            if(inner !== null) return inner;
        }
        return null;
    }

    checkEye(board: Tree<number[]>, eye: {value: number, indecies: number[]}): ITowersViolation | null {
        const values = eye.indecies.map(i => board.get(i)).map(v => v.length === 1 ? v[0] : null);
        const remaining = range(1, this.boardSize).filter(v => !values.includes(v));
        if(remaining.length === 0) {
            const seeCount = this.getEyeCount(values, []);
            if(seeCount != eye.value) {
                return {
                    message: `Eye sees ${seeCount} but expects ${eye.value}`,
                    affectedIndecies: eye.indecies
                };
            }
            return null;
        }
        else {
            const min = this.getMinCount(values, [...remaining]);
            const max = this.getMaxCount(values, remaining);
            if(min > eye.value) {
                return {
                    message: `Eye sees at least ${min} but expects ${eye.value}`,
                    affectedIndecies: eye.indecies
                };
            }
            if(max < eye.value) {
                return {
                    message: `Eye sees at most ${max} but expects ${eye.value}`,
                    affectedIndecies: eye.indecies
                };
            }
            return null;
        }
    }

    getMinCount(values: (number|null)[], remaining: number[]) {
        remaining.sort((a, b) => a - b);
        return this.getEyeCount(values, remaining);
    }

    getMaxCount(values: (number|null)[], remaining: number[]) {
        remaining.sort((a, b) => b - a);
        return this.getEyeCount(values, remaining);
    }

    getEyeCount(values: (number|null)[], remaining: number[]) {
        let seenCount = 0;
        let highestSeen = 0;
        for(let v of values){
            if(v === null) {
                v = remaining[0];
                remaining.shift();
            }
            if(v > highestSeen) {
                highestSeen = v;
                seenCount++;
            }
        }
        return seenCount;
    }

    checkRowOrColumn(board: Tree<number[]>, indecies: number[]) {
        const valueIndecies = Array(this.boardSize).fill(-1);
        let needValues: number[] = range(1, this.boardSize);
        for(const index of indecies){
            const value = board.get(index);
            if(value.length === 0) {
                return {
                    message: `No valid values`,
                    affectedIndecies: [index]
                }
            }
            if(value.length === 1) {
                if(valueIndecies[value[0]] !== -1) {
                    return {
                        message: `Duplicate value`,
                        affectedIndecies: [index, valueIndecies[value[0]]]
                    }
                }
                valueIndecies[value[0]] = index;
            }
            needValues = needValues.filter(v => !value.includes(v));
        }
        if(needValues.length > 0) { 
            return {
                message: `Missing ${needValues[0]}`,
                affectedIndecies: indecies
            }
        }
        return null;
    }

    _fastCheckInvariants(board: Tree<number[]>, changedIndex: number, newValue: number[]): ITowersViolation | null {
        if(newValue.length === 0)
        {
            return {
                message: `No valid values`,
                affectedIndecies: [changedIndex]
            };
        }
        return null;
    }

    updateCellValue(board: Tree<number[]>, index: number, oldValue: number[], causedBy: { index: number; from: number[]; to: number[]; }[]): number[] | null {
        let newValues = [...oldValue];
        let anyChanged = false;
        for(const { index: i, from, to } of causedBy) {
            if(to.length === 1){
                const v = to[0];
                const idx = newValues.indexOf(v);
                if(idx !== -1){
                    anyChanged = true;
                    newValues.splice(idx, 1);
                }
            }
        }
        
        if(anyChanged) return newValues;
        return null;
    }

}

export interface ITowersEyeDefinition {
    value: number;
    from: {x: number, y: number};
    direction: {x: number, y: number};
}

export interface ITowersViolation {
    message: string;
    affectedIndecies: number[];
}