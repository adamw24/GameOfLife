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
            if (reference[index-1] === 1){
                nearby ++;
            }
            if (!topEdge && reference[index-1-columns] === 1){
                nearby ++;
            }
            if (!bottomEdge && reference[index-1+columns] === 1){
                nearby ++;
            }
        }
        if (!rightEdge){
            if (reference[index+1] === 1){
                nearby ++;
            }
            if (!topEdge && reference[index+1-columns] === 1){
                nearby ++;
            }
            if (!bottomEdge && reference[index+1+columns] === 1){
                nearby ++;
            }
        }
        if (!topEdge && reference[index-columns] === 1){
            nearby ++;
        }
        if (!bottomEdge && reference[index+columns] === 1){
            nearby ++;
        }
        if (nearby <= 1 || nearby >= 4){
            squares[index] = undefined
        }else if (squares[index] === undefined && nearby === 3){
            squares[index] = 1
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
        grid[loc] = 1;
        }
    }
  return grid;
}


function Square(props) {
    if (props.value === 1){
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

class Board extends React.Component{
    renderSquare(i,v) {
        return (
            <Square 
            value = {v}
            index = {i}
            onClick = {() => this.props.onClick(i)}
            />
        );     
    }

    render() {
        const history = this.props.history.slice()
        const current = history[history.length-1];
        var board = current.board.slice();
        const rows = this.props.rows;
        const columns = this.props.columns;
    
        console.log(this.props.run)
    
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
        return grid
    }
}


class Game extends React.Component {
  constructor(props){
    super(props);
    var rows = parseInt(23*7/4)
    var columns = parseInt(56*7/4)
    this.state={
      rows : rows,
      columns: columns,
      history: [{board: helloWorldStart(rows,columns)}],
      run: false,    };
  }

  
  handleClick(i){
    const history = this.state.history.slice()
    const current = history[history.length-1];
    const board = current.board.slice();
    if ( board[i] === undefined){
        board[i] = 1;
    }else{
        board[i] = undefined;
    }
    this.setState({history:history.concat({board:board})});
  }


    componentDidUpdate(){
        if (this.state.run){
            setTimeout(() =>{
            const rows = this.state.rows;
            const columns = this.state.columns;
            const history = this.state.history.slice()
            const current = history[history.length-1];
            const board = current.board.slice();
            this.setState({ history:history.concat({board: calculateNextIteration(rows, columns, board)})})},200)
        }
    }


  render() {
    const history = this.state.history.slice()
    const current = history[history.length-1];
    var board = current.board.slice();
    const rows = this.state.rows;
    const columns = this.state.columns;

    var play = "Run"
    if(this.state.run){
        play = "Pause"
    }

    return (
    <>
        <div className="intro">
            <div className="title">Conway's Game of Life</div>
            <p>Designed by mathematician John Conway, this game is more of a cellular automaton. How it works: if a cell alive (not black), then it remains alive if surrounded by two or three live cells, otherwise it will die and turn black. A dead cell will become live if it is neighbored by exactly three live cells. Click on a square to change whether it's alive or dead.</p>
    
            <button className="motionControls" onClick={() => {this.setState({run: false, history: [{board: distributeLive(rows, columns, 0)}]})}}> Clear </button>
            <button className="motionControls" onClick={() => {this.setState({run: false, history: [{board: distributeLive(rows, columns, 800)}]})}}> Randomize </button>

            <div>
                <button className="motionControls" onClick={() => {if (history.length > 1){this.setState({history:history.slice(0,history.length-1)})}; this.setState({run:false})}}> &#8592; Previous Iteration </button>
                <button className="motionControls" onClick={() => {this.setState({run:!this.state.run})}}> {play} </button>
                <button className="motionControls" onClick={() => {this.setState({run: false, history:history.concat({board:calculateNextIteration(rows,columns,board)})})}}> Next Iteration &#8594;</button>
                
            </div>
        </div>
    
        <div className="game">
            <div>
            <Board history={this.state.history} rows = {this.state.rows} columns = {this.state.columns} run = {this.state.run} onClick={(i) => this.handleClick(i)}></Board>
            </div>
        </div>
    </>
    );
  }
}


function helloWorldStart(rows, columns){
    var H = [1377, 1475, 1573, 1671, 1769, 1867, 1965, 2063, 2161, 2259, 2357, 2455, 1383, 1481, 1579, 1677, 1775, 1873, 1971, 2069, 2167, 2265, 2363, 2461, 1868, 1869, 1870, 1871, 1872]
    var E = [1386, 1387, 1388, 1389, 1390, 1391, 2464, 2465, 2466, 2467, 2468, 2469, 1483, 1581, 1679, 1777, 1875, 1973, 2071, 2169, 2267, 2365, 1876, 1877, 1878, 1879]
    var L1 = [1393, 1491, 1589, 1687, 1785, 1883, 1981, 2079, 2177, 2275, 2373, 2471, 2472, 2473, 2474, 2475, 2476, 2477]
    var L2 = [1401, 1499, 1597, 1695, 1793, 1891, 1989, 2087, 2185, 2283, 2381, 2479, 2480, 2481, 2482, 2483, 2484, 2485]
    var O1 = [1410, 1411, 1412, 1413, 1414, 2488, 2489, 2490, 2491, 2492, 1507, 1605, 1703, 1801, 1899, 1997, 2095, 2193, 2291, 2389, 1513, 1611, 1709, 1807, 1905, 2003, 2101, 2199, 2297, 2395]

    var W = [1422, 1428, 1520, 1618, 1716, 1814, 1912, 2010, 2108, 2206, 2304, 2402, 1526, 1624, 1722, 1820, 1918, 2016, 2114, 2212, 2310, 2408, 2403, 2404, 2501, 2306, 2307, 2308, 2209, 2406, 2407, 2505]
    var O2 = [1431, 1432, 1433, 1434, 1435, 2509, 2510, 2511, 2512, 2513, 1528, 1626, 1724, 1822, 1920, 2018, 2116, 2214, 2312, 2410, 1534, 1632, 1730, 1828, 1926, 2024, 2122, 2220, 2318, 2416]
    var R = [1536, 1634, 1732, 1830, 1928, 2026, 2124, 2222, 2320, 2418, 2516, 1439, 1440, 1441, 1442, 1443, 1542, 1640, 1738, 1836, 1835, 1933, 1932, 1930, 1931, 1930, 1929, 2027, 2028, 2126, 2127, 2225, 2226, 2324, 2325, 2423, 2424, 2522]
    var L3 = [1446, 1544, 1642, 1740, 1838, 1936, 2034, 2132, 2230, 2328, 2426, 2524, 2525, 2526, 2527, 2528, 2529, 2530]
    var Dex = [1552, 1650, 1748, 1846, 1944, 2042, 2140, 2238, 2336, 2434, 1455, 1456, 1457, 1556, 1655, 1754, 1852, 1950, 2048, 2146, 2244, 2341, 2438, 2533, 2534, 2535, 1463, 1561, 1659, 1757, 1855, 1953, 2051, 2149, 2443, 2541]


   const letters = [H,E,L1,L2,O1,W,O2,R,L3,Dex]
    var grid =  Array(rows * columns);
    for (let j = 0; j < letters.length; j ++){
        for (let i= 0; i < letters[j].length; i ++){
            grid[letters[j][i]] = 1
        }
    }  
    return grid  
}


ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
