import Tree from "../Tree";

export default interface IDeduction<TCell, TViolation> {
    require: IAssignment<TCell>;
    because: IAssumptionTree<TCell, TViolation>;
}

export interface IAssignment<TCell> {
    index: number;
    value: TCell[];
    consequences: ({index: number, value: TCell[]})[];
    resultingBoard: Tree<TCell[]>;
}

export interface IAssumptionTree<TCell, TViolation> {
    index: number;
    values: {
        assignment: IAssignment<TCell>;
        violation: TViolation | IAssumptionTree<TCell, TViolation>;
    }[]
}

export function IsTree<TCell, TViolation>(violation: TViolation | IAssumptionTree<TCell, TViolation>): violation is IAssumptionTree<TCell, TViolation> {
    return violation && 
        typeof violation === 'object' && 
        'index' in violation && 
        'values' in violation && 
        violation.values instanceof Array && 
        violation.values.every(v => typeof v === 'object' && 'assignment' in v);
}