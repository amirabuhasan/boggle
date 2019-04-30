import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const tilesInRow = 4;

class App extends Component {
    state = {
        dictionary: [],
        boardRows: []
    };

    componentDidMount() {
        fetch('data/dictionary.txt')
            .then(response => response.text())
            .then(text => this.setState({ dictionary: text.split("\n") }));

        fetch('data/testBoard.txt')
            .then(response => response.text())
            .then(text => {
                const tileArray = text.split(", ");
                let boardRows = [];
                while (tileArray.length > 0) {
                    boardRows.push(tileArray.splice(0, tilesInRow));
                }
                this.setState({ boardRows })
            })
    }
    render() {
        const { dictionary, boardRows } = this.state;
        const isLoading = dictionary.length === 0 || boardRows === 0;
        return (
            <div>
               <div className='board'>
                   { !isLoading
                   &&
                       (
                           boardRows.map((row) => (
                               <div className='row'>
                                   { row.map(tile => (
                                       <div>{ tile }</div>
                                   ))}
                               </div>
                           ))
                       )
                   }
               </div>
            </div>
        );
    }
}
export default App;
