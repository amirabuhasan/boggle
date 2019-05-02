import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import moment from "moment";

const base = 'modal';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class Modal extends Component {
    convertSecondsToReadableTime = (seconds) => {
        const miliseconds = seconds * 1000;
        return moment.utc(miliseconds)
            .format('m');
    };

    render() {
        const { type, handleClose, score, seconds } = this.props;
        const isOpen = type ? true : false;
        const highScore = localStorage.getItem('high_score');
        const modalText = {
            start: {
                header: 'Welcome to the game!',
                subheader:
                    <Fragment>
                        <span>
                            You will be playing a game called Boggle.The goal is to find as many 3 - 4 character words as possible in { this.convertSecondsToReadableTime(seconds) > 1 ? this.convertSecondsToReadableTime(seconds) + ' minutes' : this.convertSecondsToReadableTime(seconds) + ' minute' }. Special characters are denoted by "*", and can be substituted with any character of your choice.
                        </span>
                        <br /><br />
                        <span>Good luck!</span>
                    </Fragment>,
                cta: 'Okie!'
            },
            end: {
                header: (highScore && score > highScore) ? 'Congratulations! You set a new high score.' : 'Times up!',
                subheader:
                    <Fragment>
                        { highScore &&
                            <Fragment>
                                <span>High score: <strong>{ highScore }</strong></span>
                                <br />
                            </Fragment>
                        }
                        <span>Your score: <strong>{ score }</strong></span>
                    </Fragment>,
                cta: 'Play again'
            }
        };

        const activeModal = modalText[type];

        return (
            isOpen ?
                (
                    <Dialog
                        className={ base }
                        fullWidth={ true }
                        open={ isOpen }
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={ handleClose }
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            { activeModal.header }
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                { activeModal.subheader }
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={ handleClose } color="primary">
                                { activeModal.cta }
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
                : <div />
        )
    }
}