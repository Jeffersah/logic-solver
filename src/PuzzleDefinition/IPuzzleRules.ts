import { isContext } from "vm";
import Tree from "../Tree";

export default interface IPuzzleRules<TCell, TViolation> {
    /**
     * Get the set of indecies which should check for updates due to a change at the provided index
     * @param board The current board
     * @param changedIndex The index which changed
     * @param oldValue The previous value of this cell
     * @param value The value the current cell was changed to
     * @returns The set of indecies which should be checked for updates
     */
    getAffectedIndecies(board: Tree<TCell[]>, changedIndex: number, oldValue: TCell[], value: TCell[]): number[];

    /**
     * Check board invariants are held after a set of changes
     * @param board The current board
     * @param changedIndecies Indecies of all cells for which updateCellValue returned an actual change
     * @returns A list of violations, or null if no violations
     */
    checkInvariants(board: Tree<TCell[]>, changedIndecies: number[]): TViolation | null;

    /**
     * If provided, checks invariants after each assignment during change propagation
     * @param board The current board
     * @param changedIndex The index of the cell that was changed
     * @param newValue The new value of the cell
     * @returns A list of violations, or null if no violations
     */
    fastCheckInvariants?: (board: Tree<TCell[]>, changedIndex: number, newValue: TCell[]) => TViolation | null;

    /**
     * Return an updated value space for a cell at a given index, due to changes elsewhere.
     * @param board The current board state
     * @param index The index of the current cell
     * @param causedBy Set of changes which caused this cell to update. A set of indecies, old, and new values.
     * @returns The updated value space for the cell, or null if the cell should be unchanged
     */
    updateCellValue(board: Tree<TCell[]>, index: number, oldValue: TCell[], causedBy: {index: number, from: TCell[], to: TCell[]}[]): TCell[] | null;
}