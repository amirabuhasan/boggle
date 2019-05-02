import React, { Component } from 'react';
import moment from 'moment';

const base = 'timer';
export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = { seconds: props.seconds };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.startCountdown !== this.props.startCountdown) {
            this.props.startCountdown && this.startTimer();
        }
    }

    convertSecondsToReadableTime = (seconds) => {
        const miliseconds = seconds * 1000;
        return moment.utc(miliseconds)
            .format('mm:ss');
    };

    startTimer() {
        let { seconds, handleEndCountdown } = this.props;
        let initialTime = seconds;
        const timer = setInterval(() => {
            initialTime -= 1;
            this.setState({ seconds: initialTime });
            if (initialTime <= 0) {
                clearInterval(timer);
                setTimeout(() => {
                    handleEndCountdown();
                }, 100)
            }
        }, 1000);
    }

    render() {
        return (
            <div className={ base }>
                <p>{ this.convertSecondsToReadableTime(this.state.seconds) }</p>
            </div>
        )
    }
}