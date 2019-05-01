import React, { Component } from 'react';

const base = 'current-word';

export default class CurrentWord extends Component {
    render() {
        const { currentWord } = this.props;
        return (
            <div className={ base }>
                <p>{ currentWord }</p>
            </div>
        )
    }
}