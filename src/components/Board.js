import React, { Component } from 'react';
import CurrentWord from "./CurrentWord";

const base = 'board';

export default class Board extends Component {
    renderTile = (rowIndex, i, character) => {
        const { specialChar, handleChange, editingTile, specialTile } = this.props;

        if (i === specialTile.index && rowIndex === specialTile.row && specialChar !== '') {
            return (
                <p>{ specialChar }</p>
            )
        } else if (editingTile && i === editingTile.index && rowIndex === editingTile.row) {
            return (
                <div className={`${base}__edit-char-container`}>
                    <label>Character:</label>
                    <input className={`${base}__edit-char`} type='text' name='specialChar' onChange={ handleChange } autoFocus />
                </div>
            )
        } else {
            return <p>{ character }</p>
        }
    };

    render() {
        const { rows, validWord, handleSelectTile, isSelected, disabled, currentWord } = this.props;
        return (
            <div className={ base }>
                <div className={ `${base}__container` }>
                    <CurrentWord currentWord={ currentWord }/>
                    {
                        rows.map((row, rowIndex) => (
                            <div className={ `${base}__row display--flex` } key={ rowIndex }>
                                { row.map((character, i) => (
                                    <div className={ `${base}__tile ${ disabled && !isSelected(rowIndex, i) ? 'disabled' : ''}` } onClick={() => handleSelectTile(rowIndex, i, character)} key={ i } style={{ backgroundColor: isSelected(rowIndex, i) ? validWord ? '#00e676' : '#f44336' : ''}}>
                                       { this.renderTile(rowIndex, i, character) }
                                    </div>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}