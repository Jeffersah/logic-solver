import React from "react";
import IPuzzleRules from "../PuzzleDefinition/IPuzzleRules";
import Tree from "../Tree";

export default interface IUIPuzzleDefinition<TCell, TViolation> {
    createPuzzleBuilder(): React.ComponentClass<{onFinished: (rules: IPuzzleRules<TCell, TViolation>, board: Tree<TCell[]>) => void}, any>;
    createPuzzleView(): React.ComponentClass<{rules: IPuzzleRules<TCell, TViolation>, board: Tree<TCell[]>}, any>
}