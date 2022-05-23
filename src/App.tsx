import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import towers from './PuzzleDefinition/Towers'
import IUIPuzzleDefinition from './UI/IUIPuzzleDefinition';
import IPuzzleRules from './PuzzleDefinition/IPuzzleRules';
import Tree from './Tree';
import TreeTestComponent from './UI/TreeTestComponent';

const allPuzzleBuilders: IUIPuzzleDefinition<any, any>[] = [
  towers
]

interface IAppState {
  currentBuilder?: IUIPuzzleDefinition<any, any>;
  currentSolver?: {
    uiDefinition: IUIPuzzleDefinition<any, any>,
    rules: IPuzzleRules<any, any>,
    board: Tree<any[]>
  };
}

function App() {
  const [state, setState] = React.useState<IAppState>({currentBuilder: towers});

  let content: JSX.Element;
  if(state.currentBuilder) { 
    const PuzzleBuilder = state.currentBuilder.createPuzzleBuilder();
    content = <PuzzleBuilder onFinished={(rules, board) => {
      setState({
        currentSolver: {
          uiDefinition: state.currentBuilder as IUIPuzzleDefinition<any, any>,
          rules,
          board
        }
      });
    }} />
  }
  else if(state.currentSolver){
    const PuzzleDisplay = state.currentSolver.uiDefinition.createPuzzleView();
    content = <PuzzleDisplay rules={state.currentSolver.rules} board={state.currentSolver.board} />
  }
  else {
    content = <div>Select a puzzle type</div>
  }

  //tmp:
  return <TreeTestComponent />

  return (
    <div className="App">
      <select>
        {allPuzzleBuilders.map((b, i) => <option key={i}>{b.name}</option>)}
      </select>
      {content}
    </div>
  );
}

export default App;
