import React, { Component } from 'react';

const base = 'board';

export default class Board extends Component {
    renderTile = (rowIndex, i, character) => {
        const { substituteChar, submitChar, handleChange, editingTile, substituteTile } = this.props;

        if (i === substituteTile.index && rowIndex === substituteTile.row && substituteChar !== '') {
            return (
                <p>{ substituteChar }</p>
            )
        } else if (editingTile && i === editingTile.index && rowIndex === editingTile.row) {
            return (
                <div className={`${base}__edit-char-container`}>
                    <label>Character:</label>
                    <input className={`${base}__edit-char`} type='text' name='substituteChar' onChange={ handleChange } autoFocus />
                    <button onClick={ submitChar } value={ substituteChar }>Submit</button>
                </div>
            )
        } else {
            return <p>{ character }</p>
        }
    };

    render() {
        const { rows, validWord, handleSelectTile, isSelected, editingTile } = this.props;
        return (
            <div className={ base }>
                <div className={ `${base}__container` }>
                    {
                        rows.map((row, rowIndex) => (
                            <div className={ `${base}__row display--flex` } key={ rowIndex }>
                                { row.map((character, i) => (
                                    <div className={ `${base}__tile` } onClick={() => handleSelectTile(rowIndex, i, character)} key={ i } style={{ backgroundColor: isSelected(rowIndex, i) ? validWord ? 'green' : 'red' : ''}}>
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