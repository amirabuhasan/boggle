import React, { Component } from 'react';

const base = 'board';

export default class Board extends Component {
    render() {
        const { rows } = this.props;
        return (
            <div className={ base }>
                {
                    rows.map((row) => (
                        <div className={ `${base}__row display--flex` }>
                            { row.map(tile => (
                                <div className={ `${base}__tile` }>
                                    <p>
                                      { tile }
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))
                }
            </div>
        )
    }
}