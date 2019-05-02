import React, { Component, Fragment } from 'react';
import './resources/scss/main.scss';
import Board from "./components/Board";
import TopBar from "./components/TopBar";
import AnswersList from "./components/AnswersList";
import CurrentWord from "./components/CurrentWord";
import ErrorBanner from "./components/ErrorBanner";
import Modal from "./components/Modal";
import Button from '@material-ui/core/Button';

const tilesInRow = 4;
const timeAllocatedInMinutes = 5;
const timeAllocatedInSeconds = timeAllocatedInMinutes * 60;

class App extends Component {
    state = {
        dictionary: [],
        boardRows: [],
        selectedTiles: [],
        validWord: false,
        answers: [],
        anyChar: '',
        editingTile: null,
        specialChar: '',
        specialTile: {},
        showError: false,
        errorMessage: '',
        modalText: '',
        modalType: '',
        startCountdown: false
    };

    componentDidMount() {
        setTimeout(() => {
            if (localStorage.getItem('is_replay')) {
                this.handleStartCountdown();
                localStorage.removeItem('is_replay');
            } else {
                this.openModal('start');
            }
        }, 100);
        fetch('data/dictionary.txt')
            .then(response => response.text())
            .then(text => this.setState({ dictionary: text.toLowerCase().split("\n") }));

        fetch('data/testBoard.txt')
            .then(response => response.text())
            .then(text => {
                const tileArray = text.split(", ");
                const shuffledTiles = this.shuffleTiles(tileArray);
                let boardRows = [];
                while (shuffledTiles.length > 0) {
                    boardRows.push(shuffledTiles.splice(0, tilesInRow));
                }
                this.setState({ boardRows })
            });
        document.addEventListener("keydown", this.onPressEnter);
    };

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onPressEnter);
    };

    onPressEnter = (e) => {
        const { modalType } = this.state;
        if (e.key === 'Enter') {
            if (modalType) {
                this.closeModal()
            } else {
                this.submitAnswer()
            }
        }
    };

    shuffleTiles = (tiles) => {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        return tiles
    };

    openModal = (type) => {
        this.setState({ modalType: type })
    };

    closeModal = () => {
        const { modalType } = this.state;
        switch(modalType) {
            case 'start':
                this.handleStartCountdown();
                break;
            case 'end':
                this.handleReplay();
                break;
        }
        this.setState({ modalType: '' })
    };

    resetBoard = () => {
        this.setState({ selectedTiles: [], specialChar: '', specialTile: {}, validWord: false, editingTile: null })
    };

    handleReplay = () => {
        localStorage.setItem('is_replay', true);
        window.location.reload()
    };

    handleSelectTile = (rowIndex, index, character) => {
        const { specialChar } = this.state;
        const selectedTile = { row: rowIndex, index, character };

        this.isEditing(false);
        if (this.checkSelected(selectedTile)) {
            this.unSelectTile(selectedTile, character);
        } else {
            if (this.isAdjacent(selectedTile)) {
                if (character === '*') {
                    if (specialChar) {
                        this.showErrorBanner("You can only use one special character per word")
                    } else {
                        this.isEditing(character, selectedTile);
                    }
                } else {
                    if (this.state.selectedTiles.find(tile => tile.row === rowIndex && tile.index === index)) {
                    } else {
                        this.selectTile(selectedTile, character);
                        this.isSelected(rowIndex, index);
                    }
                }
            } else {
                this.showErrorBanner("Choose a tile that is adjacent to the last tile")
            }
        }
    };

    selectTile = (selectedTile) => {
        this.setState({
            selectedTiles: [...this.state.selectedTiles, selectedTile]
        }, () => { this.isValidWord() });
    };

    unSelectTile = (selectedTile, character) => {
        let isAdjacent = false;

        const removedFromSelectedTiles = this.state.selectedTiles.filter(tile => (JSON.stringify({ row: tile.row, index: tile.index }) !== JSON.stringify({ row: selectedTile.row, index: selectedTile.index })));
        if (removedFromSelectedTiles.length > 0) {
            for (let i = 0; i < removedFromSelectedTiles.length; i++) {
                const filteredSelectedTiles = removedFromSelectedTiles.filter(tile => JSON.stringify({ row: tile.row, index: tile.index }) !== JSON.stringify({ row: removedFromSelectedTiles[i].row, index: removedFromSelectedTiles[i].index }));
                if (this.isAdjacent(removedFromSelectedTiles[i], filteredSelectedTiles)) {
                    isAdjacent = true;
                } else {
                    isAdjacent = false;
                    break
                }
            }
        } else {
            isAdjacent = true;
        }

        if (isAdjacent) {
            this.setState({
                selectedTiles: removedFromSelectedTiles,
            }, () => this.isValidWord());
            if (character === '*') {
                this.setState({
                    specialChar: ''
                })
            }
        } else {
            this.showErrorBanner("Your tiles won't be adjacent if you remove this tile!")
        }
    };

    checkSelected = (selectedTile) => {
        const { selectedTiles } = this.state;
        return selectedTiles.find(tile => JSON.stringify({ row: tile.row, index: tile.index }) === JSON.stringify({ row: selectedTile.row, index: selectedTile.index }))
    };

    isEditing = (character, selectedTile) => {
        if (!character) {
            this.setState({ editingTile: null });
        } else {
            if (!this.checkSelected(selectedTile)) {
                if (this.state.editingTile) {
                    this.setState({ editingTile: null });
                } else {
                    this.setState({ editingTile: selectedTile });
                    this.setState({ specialTile: selectedTile });
                }
            }
        }
    };

    handleChange = (e) => {
        const field = e.target.name;
        const value = e.target.value.toUpperCase();
        this.setState({
            [field]: value,
            specialTile: {
                ...this.state.specialTile,
                character: value
            }
        }, () => {
            this.selectTile(this.state.specialTile, value)
        });
        this.isSelected(this.state.specialTile.rowIndex, this.state.specialTile.index);
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
        } else if (alternativeArray) {
            return arrayToFind.find(selectedTile => Math.abs(selectedTile.row - currentSelectedTile.row) <= 1 && Math.abs(selectedTile.index - currentSelectedTile.index) <= 1);
        } else {
            return Math.abs(arrayToFind[arrayToFind.length - 1].row - currentSelectedTile.row) <= 1 && Math.abs(arrayToFind[arrayToFind.length - 1].index - currentSelectedTile.index) <= 1;
        }
    };

    isSelected = (rowIndex, i) => {
        const { selectedTiles } = this.state;
        return selectedTiles.find(selectedTile => selectedTile.row === rowIndex && selectedTile.index === i)
    };

    submitAnswer = () => {
        const { validWord, answers } = this.state;
        const currentWord = this.getCurrentWord();

        if (answers.includes(currentWord)) {
            this.showErrorBanner("Oops! It seems like you've already selected the word!")
        } else if (validWord) {
            this.setState({ answers: [...this.state.answers, currentWord] });
            this.resetBoard();
        } else if (currentWord.length < 3){
            this.showErrorBanner("Oops! It seems your word has less than 3 characters!")
        } else {
            this.showErrorBanner("It seems that this is not a valid word.")
        }
    };

    showErrorBanner = (message) => {
        this.setState({ showError: true, errorMessage: message });
    };

    closeErrorBanner = () => {
        this.setState({ showError: false, errorMessage: '' })
    };

    handleStartCountdown = () => {
        this.setState({ startCountdown: true })
    };

    handleEndCountdown = () => {
        const { answers } = this.state;
        const score = answers.length * 10;

        setTimeout(() => {
            if ((score > 0 && !localStorage.getItem('high_score')) || score > localStorage.getItem('high_score')) {
                localStorage.setItem('high_score', score);
            }
        }, 500);

        this.openModal('end');
    };

    render() {
        const { dictionary, boardRows, validWord, answers, editingTile, specialChar, specialTile, selectedTiles, showError, errorMessage, modalType, startCountdown } = this.state;
        const isLoading = dictionary.length === 0 || boardRows === 0;
        return (
            <div className='App'>
               <div className='container'>
                   <ErrorBanner handleClose={ this.closeErrorBanner } showError={ showError } errorMessage={ errorMessage }/>
                   <Modal type={ modalType } handleClose={ this.closeModal } score={ answers.length * 10 } seconds={ timeAllocatedInSeconds }/>
                   <TopBar score={ answers.length * 10 } startCountdown={ startCountdown } handleEndCountdown={ this.handleEndCountdown } seconds={ timeAllocatedInSeconds } handleReplay={ this.handleReplay }/>
                   { !isLoading
                       ?
                           (
                               <Fragment>
                                   <Board
                                       rows={ boardRows }
                                       maxWordLength={ tilesInRow }
                                       dictionary={ dictionary }
                                       handleSelectTile={ this.handleSelectTile }
                                       validWord={ validWord }
                                       isSelected={ this.isSelected }
                                       submitChar={ this.submitChar }
                                       editingTile={ editingTile }
                                       specialChar={ specialChar }
                                       handleChange={ this.handleChange }
                                       specialTile={ specialTile }
                                       disabled={ selectedTiles.length === tilesInRow }
                                       currentWord={ this.getCurrentWord() }
                                   />
                                   <div style={ { display: 'flex', marginBottom: '20px' } }>
                                       <Button variant="contained" color="secondary" onClick={ this.submitAnswer }
                                               style={ { marginRight: '10px' } }>
                                           Submit Answer
                                       </Button>
                                       <Button variant="contained" onClick={ this.resetBoard }>
                                           Clear
                                       </Button>
                                   </div>
                                   <AnswersList answers={ answers }/>
                               </Fragment>
                           )
                       : <div>Loading...</div>
                   }
               </div>
            </div>
        );
    }
}
export default App;
