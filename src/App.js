import React, { Component } from 'react';
import './resources/scss/main.scss';
import Board from "./components/Board";
import ScoreBoard from "./components/ScoreBoard";
import AnswersList from "./components/AnswersList";

const tilesInRow = 4;

class App extends Component {
    state = {
        dictionary: [],
        boardRows: [],
        score: 0,
        selectedTiles: [],
        currentWord: '',
        validWord: false,
        answers: [],
        anyChar: '',
        editingTile: null,
        substituteChar: '',
        substituteTile: {}
    };

    componentDidMount() {
        fetch('data/dictionary.txt')
            .then(response => response.text())
            .then(text => this.setState({ dictionary: text.toLowerCase().split("\n") }));

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

    resetBoard = () => {
        this.setState({ currentWord: '', selectedTiles: [], substituteChar: '', substituteTile: {}, validWord: false })
    };

    handleSelectTile = (rowIndex, index, character) => {
        const selectedTile = { row: rowIndex, index };
        if (this.isAdjacent(selectedTile)) {
            if (character === '*') {
                this.isEditing(character, selectedTile);
            } else {
                this.selectTile(selectedTile, character);
                this.isSelected(rowIndex, index);
            }
        }
    };

    selectTile = (selectedTile, character) => {
        this.setState({
            selectedTiles: [...this.state.selectedTiles, selectedTile],
            currentWord: this.state.currentWord + character,
            editingTile: null
        }, () => { this.isValidWord() });
    };

    handleChange = (e) => {
        const { substituteTile } = this.state;
        const field = e.target.name;
        const value = e.target.value.toUpperCase();
        // this.setState({ [field]: value, currentWord: this.state.currentWord.slice(0, this.state.currentWord.length - 1) + value })
        this.setState({
            [field]: value,
        }, () => { this.selectTile(substituteTile, value) });
        this.isSelected(substituteTile.rowIndex, substituteTile.index);
    };

    isValidWord = () => {
        const { currentWord, dictionary } = this.state;
        if (currentWord.length >= 3) {
            if (dictionary.includes(currentWord.toLowerCase())) {
                this.setState({ validWord: true })
            } else {
                this.setState({ validWord: false })
            }
        }
    };

    isAdjacent = (currentSelectedTile) => {
        const { selectedTiles } = this.state;
        if (selectedTiles.length === 0) {
            return true
        }
        return selectedTiles.find(selectedTile => Math.abs(selectedTile.row - currentSelectedTile.row) <= 1 && Math.abs(selectedTile.index - currentSelectedTile.index) <= 1)
    };

    isSelected = (rowIndex, i) => {
        const { selectedTiles } = this.state;
        return selectedTiles.find(selectedTile => selectedTile.row === rowIndex && selectedTile.index === i)
    };

    submitAnswer = () => {
        const { currentWord, validWord } = this.state;
        if (validWord) {
            this.setState({ answers: [...this.state.answers, currentWord]});
            this.resetBoard();
        }
    };

    isEditing = (character, selectedTile) => {
        this.setState({ editingTile: selectedTile });
        this.setState({ substituteTile: selectedTile });
    };

    render() {
        const { dictionary, boardRows, score, validWord, answers, editingTile, substituteChar, substituteTile } = this.state;
        const isLoading = dictionary.length === 0 || boardRows === 0;
        return (
            <div className='App'>
               <div className='container'>
                   <ScoreBoard score={ score }/>
                   <AnswersList answers={ answers }/>
                   { !isLoading
                   && <Board
                       rows={ boardRows }
                       maxWordLength={ tilesInRow }
                       dictionary={ dictionary }
                       handleSelectTile={ this.handleSelectTile }
                       validWord={ validWord }
                       isSelected={ this.isSelected }
                       submitChar={ this.submitChar }
                       editingTile={ editingTile }
                       substituteChar={ substituteChar }
                       handleChange={ this.handleChange }
                       substituteTile={ substituteTile }
                   />
                   }
                   <button onClick={ this.submitAnswer }>Submit Answer</button>
               </div>
            </div>
        );
    }
}
export default App;
