import React, { Component } from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from '@material-ui/core/SnackbarContent';
class ErrorBanner extends Component {
    render() {
        const { showError, errorMessage, handleClose } = this.props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={ showError }
                autoHideDuration={ 3000 }
                onClose={ handleClose }
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
            >
            <SnackbarContent
                classes={{ root: 'error-banner' }}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{ errorMessage }</span>}
            />
            </Snackbar>
        )
    }
}

export default ErrorBanner;