export default class ClassBuilder {
    public result: string;

    constructor(){
        this.result = '';
    }

    private append(className: string) {
        if(this.result === '') this.result = className;
        else this.result += ' ' + className;
    }

    public with(className: string) {
        this.append(className);
        return this;
    }

    public if(condition: boolean, className: string) {
        if(condition) this.append(className);
        return this;
    }
}

export function ClassFromObject(obj: { [key: string]: boolean }) {
    let result = '';
    for(const key in obj) {
        if(obj[key]) {
            result += key + ' ';
        }
    }
    return result;
}