import React, { useState } from 'react';
import './App.css';
import PuzzleBuilderComponent from './Components/PuzzleBuilderComponent';
import IPuzzleBuilder from './PuzzleDefinition/IPuzzleBuilder';
import Sudoku from './PuzzleDefinition/Sudoku';

const allPuzzleBuilders: IPuzzleBuilder<any, any>[] = [
  Sudoku,
]

interface IAppState {
  currentBuilder?: IPuzzleBuilder<any, any>
}

function App() {
  const [state, setState] = React.useState<IAppState>({currentBuilder: Sudoku});
  if(state.currentBuilder !== undefined) {
    return <PuzzleBuilderComponent builder={state.currentBuilder} allBuilders={allPuzzleBuilders} puzzleBuilderChanged={(builder: IPuzzleBuilder<any, any>) => setState({currentBuilder: builder})} />
  }
  return <div></div>
}

export default App;
