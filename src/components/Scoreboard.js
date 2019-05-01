import React, { Component } from 'react';

const base = 'scoreboard';

export default class Scoreboard extends Component {
    render() {
        const { score } = this.props;
        return (
            <div className={ base }>
                <p className={ `${base}__text` }>Your score: { score }</p>
            </div>
        )
    }
}