import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 

    function Square( props ) {
        return (
            <div className="square" onClick={props.onClick}>
                {props.value}
            </div>
        );
    }
  
  class Board extends React.Component {
      renderSquare(i) {
        return (
            <Square 
                key = {`square_${i}`}
                value={this.props.squares[i]}
                onClick = {()=> this.props.onClick(i)}   
            />
        );
    }

    render() {
      let count = -1;
      return (
        <div>
          {[0,1,2].map(()=>{
            return (
              <div className="board-row">
                {[0,1,2].map(()=>{
                  count = count + 1;
                  return this.renderSquare(count)
                })}
              </div>
            )
          })}
        </div>
      );
    }
  }
  
  const location = {
    0: [0,0],
    1: [0,1],
    2: [0,2],
    3: [1,0],
    4: [1,1],
    5: [1,2],
    6: [2,0],
    7: [2,1],
    8: [2,2]
}      

  class Game extends React.Component {
    
    constructor( props ){
        super( props);
        this.state = {
            xIsNext: true,
            history: [{
                squares: Array(9).fill(null),
                squareNumber: null,
                stepNumber: null
            }],
            stepNumber: 0
        }
        this.selectedMove = null;
        this.toggleState = true;
    }

    calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }
  

    handleClick = (i)=> {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(this.calculateWinner(squares) || squares[i]) return;
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
              squares,
              squareNumber: i,
              stepNumber: history.length + 1
          }]),
          xIsNext : !this.state.xIsNext,
          stepNumber: history.length
      });
    }

    jumpTo = (move)=> {
        this.setState({
            stepNumber: move,
            xIsNext : (move%2) == 0
        })
        this.selectedMove = move;
    }

    getColRow = ( squareNumber ) => {
      if(!location[squareNumber]) return;
      return `( ${location[squareNumber][1]}, ${location[squareNumber][0]})`;
    }

    isSelectedMove = ( move )=> {
      return move === this.selectedMove;
    }

    toggleMoves = ()=> {
      const history = this.state.history.slice();
      this.setState({
        history : history.reverse()
      })
      this.toggleState = !this.toggleState;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        let status;
        if(winner) {
            status = `Winner is: ${winner}`;
        } else{
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        const moves = history.map((step, move) => {
          let message;
          if(this.toggleState) {
             message = move ? `Go to move # ${step.stepNumber} ${this.getColRow(step.squareNumber)}` : `Go to game start`
          } else {
             message = move < history.length - 1 ? `Go to move # ${step.stepNumber} ${this.getColRow(step.squareNumber)}` : `Go to game start`
          }
            return (
                <li key={`step_${move}`}>
                    <button className={this.isSelectedMove(move) ? 'bold' : ''} onClick={()=>this.jumpTo(move)}>{message}</button>
                </li>
            )
        })
  
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) =>this.handleClick(i)}/>
          </div>
          <div className="game-info">
          <div className="status">{status}</div>
            <ol>{moves}</ol>
            <button onClick={this.toggleMoves}>Sort moves</button>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );