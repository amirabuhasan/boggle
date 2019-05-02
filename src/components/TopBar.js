import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';

const base = 'top-bar';

export default class TopBar extends Component {
    handleReplay = () => {
        localStorage.setItem('is_replay', true);
        window.location.reload()
    };
    render() {
        const { score } = this.props;
        return (
            <div className={ base }>
                <p className={ `${base}__score` }>Your score: { score }</p>
                <p>00:00</p>
                <Icon className={ `${base}__replay-icon` } onClick={ this.handleReplay }>replay</Icon>
            </div>
        )
    }
}