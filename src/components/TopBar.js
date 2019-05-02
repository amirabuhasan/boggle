import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
import Timer from "./Timer";

const base = 'top-bar';

export default class TopBar extends Component {
    render() {
        const { score, startCountdown, handleEndCountdown, seconds, handleReplay } = this.props;
        const highScore = localStorage.getItem('high_score');
        return (
            <div className={ base }>
                { highScore && <p className={ `${base}__score` }>High score: { highScore }</p> }
                <p className={ `${base}__score` }>Your score: { score }</p>
                <Timer seconds={ seconds } startCountdown={ startCountdown } handleEndCountdown={ handleEndCountdown }/>
                <Icon className={ `${base}__replay-icon` } onClick={ handleReplay }>replay</Icon>
            </div>
        )
    }
}