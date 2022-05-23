import * as React from 'react';
import Tree from '../../Tree';
import CellGridComponent, { IGridCellProps } from '../../UI/CellGridComponent';
import IPuzzleRules from '../IPuzzleRules';
import { ITowersViolation } from './TowersRules';

export default function PuzzleDisplayComponent(props: {rules: IPuzzleRules<number, ITowersViolation>, board: Tree<number[]>}) {
    let size = Math.sqrt(props.board.count) + 2;

    let [highlightIndex, setHighlightIndex] = React.useState<[number, number]|undefined>( undefined );

    let grid: IGridCellProps[][] = [];
    for(let y = 0; y < size; y++){
        for(let x = 0; x < size; x++){
            if(grid[x] === undefined) grid[x] = [];

            grid[x][y] = {
                highlight: false,
                displayBorder: x > 0 && y > 0 && x < size - 1 && y < size - 1,
            }

            let tx = x - 1;
            let ty = y - 1;
            if(tx >= 0 && ty >= 0 && tx < size-2 && ty < size-2){
                let cell = props.board.get(tx + ty * (size-2))
                if(cell.length === 1) grid[x][y].knownValue = cell[0];
                else grid[x][y].possible = cell;

                if(highlightIndex !== undefined && x === highlightIndex[0] && y === highlightIndex[1]) grid[x][y].highlight = true;
            }
        }
    }

    return <CellGridComponent grid={grid} sqSize={1024/size} onHover={(x, y) => setHighlightIndex([x, y])} />;
}