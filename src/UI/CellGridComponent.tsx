import ClassBuilder, { ClassFromObject } from '../ClassBuilder';
import './CellGrid.css';

export interface ICellGridComponentProps {
    sqSize: number;
    grid: IGridCellProps[][];
    onHover?: (x: number, y: number) => void;
    onClick?: (x: number, y: number) => void;
}

export interface IGridCellProps {
    knownValue?: number;
    highlight: boolean;

    error?: boolean
    possible?: number[];

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

    return <table className="board">
        <tbody>
            {props.grid.map((row, rowIndex) => 
                <tr key={rowIndex}>
                    {row.map((cell, colIndex) =>
                        <CellComponent key={colIndex} x={colIndex} y={rowIndex} {...props} {...cell}  />
                    )}
                </tr>
            )}
        </tbody>
    </table>;
}

export function CellComponent(props: IGridCellPropsInner) {
    let style = { width: props.sqSize + 'px', height: props.sqSize + 'px'};

    let content = props.knownValue ? <>{props.knownValue}</> : props.possible ? <>{props.possible.map((v, i) => <span className='option' key={i}>{v}</span>)}</> : <></>

    return <td 
        className={ClassFromObject({ cell: true, highlight: props.highlight, error: props.error ?? false, border: props.displayBorder })} 
        style={style}
        onClick={() => props.onClick ? props.onClick(props.x, props.y) : false}
        onMouseEnter={() => props.onHover ? props.onHover(props.x, props.y) : false}>
        {content}
    </td>
}