import ImSet from "../Immutable/ImSet";
import BTree from "../Immutable/Tree/BTree";

export type BoardCell<T> = T | ImSet<T>;

export function isSingleValue<T>(cell: BoardCell<T>): cell is T {
    return !(cell instanceof ImSet);
}
