import { FC } from "react";
import ImMap from "../../Immutable/ImMap";
import Board from "../../Solver/Board";
import IPuzzleBuilder, { IPuzzleBuilderDisplayProps } from "../IPuzzleBuilder";
import SudokuBuilderDisplayComponent from "./SudokuBuilderDisplay";
import SudokuBuilderPanelComponent from "./SudokuBuilderPanel";

export class SudokuBuilder implements IPuzzleBuilder<number, ISudokuBuilderState> {

    constructor() {
        this.initialBuilderState = {
            sqSize: 3,
            boardSize: 9,
            givens: new ImMap<{x: number, y: number}, number>(((a, b) => {
                let dx = a.x-b.x;
                if(dx !== 0) return dx;
                return a.y-b.y;
            })),
            toggleRules: {
                King: false,
                Knight: false,
                NonConsecutive: false
            }
        }

        this.builderDisplayComponent = SudokuBuilderDisplayComponent;
        this.builderPanelComponent = SudokuBuilderPanelComponent;
    }

    name: string = 'Sudoku';
    initialBuilderState: ISudokuBuilderState;
    builderDisplayComponent: FC<IPuzzleBuilderDisplayProps<ISudokuBuilderState>>;
    builderPanelComponent: FC<{ state: ISudokuBuilderState; setState: (state: ISudokuBuilderState) => void; }>;

    finalize(state: ISudokuBuilderState): Board<number> {
        throw new Error("Method not implemented.");
    }

}

export interface ISudokuBuilderState {
    sqSize: number;
    boardSize: number;
    givens: ImMap<{x: number, y: number}, number>;
    selected?: {x: number, y: number}
    toggleRules: {
        [key: string]: boolean;
    }
}

export const Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ+';

const Sudoku = new SudokuBuilder();
export default Sudoku;