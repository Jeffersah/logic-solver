import ImMap from "./ImMap";

export default class BufferedArray<T> {
    private data: T[];
    public length: number;
    private changes: ImMap<number, T>;

    constructor(data: T[], changes?: ImMap<number, T>) {
        this.data = data;
        this.changes = changes || new ImMap<number, T>(((a, b) => a - b));
        this.length = this.data.length;
    }

    public clone(){
        return new BufferedArray<T>(this.data, this.changes);
    }

    public get(index: number): T {
        return this.changes.get(index) ?? this.data[index];
    }

    public set(index: number, value: T) {
        this.changes = this.changes.set(index, value);
    }

    public flushChanges() {
        for(const change of this.changes.toArray()){
            this.data[change.key] = change.value;
        }
        this.changes = new ImMap<number, T>(((a, b) => a - b));
    }
}