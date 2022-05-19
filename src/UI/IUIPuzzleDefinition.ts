import React from "react";
import IPuzzleRules from "../PuzzleDefinition/IPuzzleRules";
import Tree from "../Tree";

export default interface IUIPuzzleDefinition<TCell, TViolation> {
    name: string;
    createPuzzleBuilder(): React.FC<{onFinished: (rules: IPuzzleRules<TCell, TViolation>, board: Tree<TCell[]>) => void}>;
    createPuzzleView(): React.FC<{rules: IPuzzleRules<TCell, TViolation>, board: Tree<TCell[]>}>
}