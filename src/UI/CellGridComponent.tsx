import ClassBuilder, { ClassFromObject } from '../ClassBuilder';
import './CellGrid.css';

export interface ICellGridComponentProps {
    sqSize: number;
    grid: IGridCellProps[][];
    onHover?: (x: number, y: number) => void;
    onClick?: (x: number, y: number) => void;
}

export interface IGridCellProps {
    knownValue?: string;
    highlight: boolean;

    error?: boolean
    possible?: string[];

    displayBorder: boolean;
    borderThickness?: number[];
}

interface IGridCellPropsInner extends IGridCellProps {
    x: number;
    y: number;
    sqSize: number
    onHover?: (x: number, y: number) => void;
    onClick?: (x: number, y: number) => void;
}

export default function CellGridComponent(props: ICellGridComponentProps) {
    let range:number[] = [];
    for(let i = 0; i < props.grid.length; i++) { range.push(i); }

    return <table className="board">
        <tbody>
            {range.map((row) => 
                <tr key={row}>
                    {range.map((col) =>
                        <CellComponent key={col} x={col} y={row} {...props} {...props.grid[col][row]}  />
                    )}
                </tr>
            )}
        </tbody>
    </table>;
}

export function CellComponent(props: IGridCellPropsInner) {
    let style: React.CSSProperties = { 
        width: props.sqSize + 'px', 
        height: props.sqSize + 'px', 
        fontSize: (props.sqSize * (props.knownValue !== undefined ? 0.6 : 0.3)) + 'px' 
    };

    let content = props.knownValue ? <>{props.knownValue}</> : props.possible ? <>{props.possible.map((v, i) => <span className='option' key={i}>{v}</span>)}</> : <></>
    let borderThickenss = props.borderThickness === undefined ? '1px' : props.borderThickness.map(t => t + 'px').join(' ');

    style.borderWidth = borderThickenss;

    return <td 
        className={ClassFromObject({ cell: true, highlight: props.highlight, error: props.error ?? false, border: props.displayBorder, knownValue: props.knownValue !== undefined })} 
        style={style}
        onClick={() => props.onClick ? props.onClick(props.x, props.y) : false}
        onMouseEnter={() => props.onHover ? props.onHover(props.x, props.y) : false}>
        {content}
    </td>
}