import React, { Component } from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

const base = 'error-banner';

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
                classes={{ root: base }}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={
                    <span id="message-id" className={`${base}__message`}>{ errorMessage }
                        <ErrorIcon className={`${base}__icon`} />
                    </span>}
                variant="error"
            />
            </Snackbar>
        )
    }
}

export default ErrorBanner;