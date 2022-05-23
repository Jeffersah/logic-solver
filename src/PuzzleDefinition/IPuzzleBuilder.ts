import React from "react";
import { isContext } from "vm";
import Board from "../Solver/Board";
import Tree from "../Tree";

export default interface IPuzzleBuilder<T, TBuilderState> {
    initialBuilderState: TBuilderState;
    name: string;

    builderDisplayComponent: React.FC<IPuzzleBuilderDisplayProps<TBuilderState>>;
    builderPanelComponent: React.FC<{state: TBuilderState, setState: (state: TBuilderState) => void}>;

    finalize(state: TBuilderState): Board<T>;
}

export interface IPuzzleBuilderDisplayProps<TBuilderState> {
    maxWidth: number;
    maxHeight: number;
    state: TBuilderState;
    setState: (state: TBuilderState) => void;
}
