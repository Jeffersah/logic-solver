import { BoardCell } from "./BoardCell";

export default interface IChangeInfo<T> {
    index: number;
    oldValue: BoardCell<T>;
    newValue: BoardCell<T>;
}