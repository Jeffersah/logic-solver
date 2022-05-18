import IPuzzleRules from "../PuzzleDefinition/IPuzzleRules";
import Tree from "../Tree";

export default class PuzzleSolver<TCell, TViolation> {
    constructor(private rules: IPuzzleRules<TCell, TViolation>, public board: Tree<TCell[]>) {

    }
}