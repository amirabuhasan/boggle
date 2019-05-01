import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const modalText = {
    start: {
        header: 'Welcome to the game!',
        subheader: [
            `You will be playing a game called Boggle.The goal is to find as many 3 - 4 character words as possible in 5 minutes. When a tile contains the "*" character, it can be substituted with any character of your choice.`,
            'Good luck!'
        ]
    }
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class Modal extends Component {
    render() {
        const { type, handleClose } = this.props;
        const isOpen = type ? true : false;

        return (
            isOpen ?
                (
                    <Dialog
                        open={ isOpen }
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={ handleClose }
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            { modalText[type].header }
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                { modalText[type].subheader &&
                                    modalText[type].subheader.map((text, i) => (
                                        <Fragment>
                                            <span style={{ marginBottom: i === modalText[type].subheader.length - 1 ? '' : '10px', display: 'block' }}>{text}</span>
                                        </Fragment>
                                    ))
                                }
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={ handleClose } color="primary">
                                Okie !
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
                : <div />
        )
    }
}