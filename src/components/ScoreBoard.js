import React, { Component } from 'react';

const base = 'scoreboard';

export default class ScoreBoard extends Component {
    render() {
        const { score } = this.props;
        return (
            <div className={ base }>
                <p>Your score: { score }</p>
            </div>
        )
    }
}