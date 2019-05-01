import React, { Component } from 'react';
import './resources/scss/main.scss';
import Board from "./components/Board";
import Scoreboard from "./components/Scoreboard";
import AnswersList from "./components/AnswersList";
import CurrentWord from "./components/CurrentWord";

const tilesInRow = 4;

class App extends Component {
    state = {
        dictionary: [],
        boardRows: [],
        score: 0,
        selectedTiles: [],
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
        this.setState({ selectedTiles: [], substituteChar: '', substituteTile: {}, validWord: false, editingTile: null })
    };

    handleSelectTile = (rowIndex, index, character) => {
        const selectedTile = { row: rowIndex, index, character };
        if (this.isAdjacent(selectedTile)) {
            if (character === '*') {
                this.isEditing(character, selectedTile);
            } else {
                if (this.state.selectedTiles.find(tile => tile.row === rowIndex && tile.index === index)) {
                    this.unSelectTile(selectedTile)
                } else {
                    this.selectTile(selectedTile, character);
                    this.isSelected(rowIndex, index);
                }
                this.setState({ editingTile: null })
            }
        }
    };

    selectTile = (selectedTile) => {
        this.setState({
            selectedTiles: [...this.state.selectedTiles, selectedTile]
        }, () => { this.isValidWord() });
    };

    unSelectTile = (selectedTile) => {
        let isAdjacent = false;

        const removedFromSelectedTiles = this.state.selectedTiles.filter(tile => (JSON.stringify(tile) !== JSON.stringify(selectedTile)));
        if (removedFromSelectedTiles.length > 0) {
            for (let i = 0; i < removedFromSelectedTiles.length; i++) {
                const filteredSelectedTiles = removedFromSelectedTiles.filter(tile => JSON.stringify(tile) !== JSON.stringify(removedFromSelectedTiles[i]));
                if (this.isAdjacent(removedFromSelectedTiles[i], filteredSelectedTiles)) {
                    isAdjacent = true;
                    break
                }
            }
        } else {
            isAdjacent = true;
        }

        if (isAdjacent) {
            this.setState({
                selectedTiles: removedFromSelectedTiles
            }, () => this.isValidWord())
        }
    };

    isEditing = (character, selectedTile) => {
        this.setState({ editingTile: selectedTile });
        this.setState({ substituteTile: selectedTile });
    };

    handleChange = (e) => {
        const field = e.target.name;
        const value = e.target.value.toUpperCase();
        this.setState({
            [field]: value,
            substituteTile: {
                ...this.state.substituteTile,
                character: value
            }
        }, () => {
            this.selectTile(this.state.substituteTile, value)
        });
        this.isSelected(this.state.substituteTile.rowIndex, this.state.substituteTile.index);
    };

    isValidWord = () => {
        const { dictionary } = this.state;
        const currentWord = this.getCurrentWord();
        if (currentWord.length >= 3) {
            if (dictionary.includes(currentWord.toLowerCase())) {
                this.setState({ validWord: true })
            } else {
                this.setState({ validWord: false })
            }
        } else {
            this.setState({ validWord: false })
        }
    };

    getCurrentWord = () => {
        const { selectedTiles } = this.state;
        return selectedTiles.map((tile) => tile.character).join("");
    };

    isAdjacent = (currentSelectedTile, alternativeArray) => {
        const { selectedTiles } = this.state;
        const arrayToFind = alternativeArray ? alternativeArray : selectedTiles;
        if (arrayToFind.length === 0) {
            return true
        }
        return arrayToFind.find(selectedTile => Math.abs(selectedTile.row - currentSelectedTile.row) <= 1 && Math.abs(selectedTile.index - currentSelectedTile.index) <= 1)
    };

    isSelected = (rowIndex, i) => {
        const { selectedTiles } = this.state;
        return selectedTiles.find(selectedTile => selectedTile.row === rowIndex && selectedTile.index === i)
    };

    submitAnswer = () => {
        const { validWord } = this.state;
        const currentWord = this.getCurrentWord();
        if (validWord) {
            this.setState({ answers: [...this.state.answers, currentWord] });
            this.resetBoard();
        }
    };

    render() {
        const { dictionary, boardRows, validWord, answers, editingTile, substituteChar, substituteTile, selectedTiles } = this.state;
        const isLoading = dictionary.length === 0 || boardRows === 0;
        return (
            <div className='App'>
               <div className='container'>
                   <Scoreboard score={ answers.length * 10 }/>
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
                       disabled={ selectedTiles.length === tilesInRow }
                   />
                   }
                   <CurrentWord currentWord={ this.getCurrentWord() }/>
                   <button onClick={ this.submitAnswer }>Submit Answer</button>
               </div>
            </div>
        );
    }
}
export default App;
