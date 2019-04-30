import React, { Component } from 'react';
import './resources/scss/main.scss';
import Board from "./components/Board";

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
            <div className='App'>
               <div className='container'>
                   { !isLoading
                   && <Board rows={ boardRows }/>
                   }
               </div>
            </div>
        );
    }
}
export default App;
