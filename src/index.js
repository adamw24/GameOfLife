import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateNextIteration(rows, columns, squares){
    let reference = squares.slice()
    for (let index = 0; index <reference.length; index++){
        var nearby = 0;
        var leftEdge = index % columns === 0;
        var rightEdge = index % columns === columns-1;
        var topEdge = index >=0 && index < columns;
        var bottomEdge = index >= columns * (rows-1) && index < rows*columns;
        if (!leftEdge){
            if (reference[index-1] === 'X'){
                nearby ++;
            }
            if (!topEdge && reference[index-1-columns] === 'X'){
                nearby ++;
            }
            if (!bottomEdge && reference[index-1+columns] === 'X'){
                nearby ++;
            }
        }
        if (!rightEdge){
            if (reference[index+1] === 'X'){
                nearby ++;
            }
            if (!topEdge && reference[index+1-columns] === 'X'){
                nearby ++;
            }
            if (!bottomEdge && reference[index+1+columns] === 'X'){
                nearby ++;
            }
        }
        if (!topEdge && reference[index-columns] === 'X'){
            nearby ++;
        }
        if (!bottomEdge && reference[index+columns] === 'X'){
            nearby ++;
        }
        if (nearby <= 1 || nearby >= 4){
            squares[index] = undefined
        }else if (squares[index] === undefined && nearby === 3){
            squares[index] = 'X'
        }
    }
    return squares
}


function distributeLive(rows, columns, numLeft){
    var alreadyLive = new Set();
    var grid =  Array(rows * columns);
    while (numLeft !== 0){
        var loc = parseInt(Math.random()*rows*columns);
        if (!alreadyLive.has(loc)){
        alreadyLive.add(loc);
        numLeft --; 
        grid[loc] = 'X';
        }
    }
  return grid;
}


function Square(props) {
    if (props.value === 'X'){
        return (
            <button className="square" onClick={props.onClick}> 
            </button>
            );
    }else{
        return (
            <button className="square dead" onClick={props.onClick}> 
            </button>
            );
    }
    
}


class Board extends React.Component {
  constructor(props){
    super(props);
    var rows = parseInt(23*7/4)
    var columns = parseInt(56*7/4)
    this.state={
      rows : rows,
      columns: columns,
      history: [{board: distributeLive(rows,columns, 800)}],
      run: false,
      should: true,
    };
  }

  renderSquare(i,v) {
        return (
            <Square 
            value = {v}
            onClick = {() => this.onClick(i)}
            />
        );     
  }


  onClick(i){
    const history = this.state.history.slice()
    const current = history[history.length-1];
    const board = current.board.slice();
    if ( board[i] === undefined){
        board[i] = 'X';
    }else{
        board[i] = undefined;
    }
    this.setState({history:history.concat({board:board})});
  }


  componentDidUpdate(){
    if (this.state.run && this.state.should){
        const rows = this.state.rows;
        const columns = this.state.columns;
        const history = this.state.history.slice()
        const current = history[history.length-1];
        const board = current.board.slice();
        this.setState({run: false, history:history.concat({board: calculateNextIteration(rows, columns, board)})})
    }
}


  render() {
    const history = this.state.history.slice()
    const current = history[history.length-1];
    var board = current.board.slice();
    const rows = this.state.rows;
    const columns = this.state.columns;

    console.log(this.state.run)

    var grid = [];    
    for (let i= 0; i<rows; i++){
      var row = [];
      for(let j = 0; j<columns; j++){
        let info = board[i*columns +j];
        row.push(this.renderSquare(i*columns+j, info));          
      }
      grid.push(<div className="board-row">
      {row}
    </div>);
    }

    var play = "Play"
    if(this.state.should){
        play = "Pause"
    }

      return (
      <>
      <div className="intro">
      <div className="title">John Conway's Game of Life</div>
      <p>Designed by mathmatician John Conway, this game is more of a cellular automaton. How it works: if a cell alive (not black), then it remains alive if surrounded by two or three live cells, otherwise it will die and turn black. A dead cell will become live if it is neighbored by exactly three live cells. Click on a square to change whether it's alive or dead.</p>
      <button className="motionControls" onClick={() => {if (history.length > 1){this.setState({history:history.slice(0,history.length-1)})}; this.setState({run:false})}}> &#8592; Previous Iteration </button>
      <button className="motionControls" onClick={() => {this.setState({run:!this.state.run})}}> {play} </button>
      <button className="motionControls" onClick={() => {this.setState({run: false, history: [{board: distributeLive(rows, columns, 0)}]})}}> Clear </button>
      <button className="motionControls" onClick={() => {this.setState({run: false, history: [{board: distributeLive(rows, columns, 800)}]})}}> Randomize </button>
      <button className="motionControls" onClick={() => {this.setState({run: false, history:history.concat({board:calculateNextIteration(rows,columns,board)})})}}> Next Iteration &#8594;</button>


      </div>
      
      <div className="game">
          <div>
            {grid}
          </div>
      </div>
      </>
      );
  }
}





ReactDOM.render(
  <React.StrictMode>
    <Board />
  </React.StrictMode>,
  document.getElementById('root')
);
