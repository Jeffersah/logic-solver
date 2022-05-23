import BTree from "../Immutable/Tree/BTree";

export type BoardCell<T> = T | BTree<T>;

export function isValue<T>(cell: BoardCell<T>): cell is T {
    return !(cell instanceof BTree);
}
