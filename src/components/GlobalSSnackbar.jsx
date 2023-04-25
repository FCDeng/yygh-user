import React, { Fragment, useEffect, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Box, Container, createTheme, ThemeProvider } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Message from "./Message";
const theme = createTheme({
    palette: {
        error: {
            main: '#FDD4DA',
            light: '#8c000',
            contrastText: '#8c000'
        }
    },
    color: '#8c000'
})
const GlobalSnackbar = () => {
    useEffect(() => {
        Message.info = (msg) => {
            setOpen(true);
            setSeverity("info");
            setContent(msg);
        };
        Message.warn = (msg) => {
            changeToast("warn", msg)
        };
        Message.success = (msg) => {
            changeToast("success", msg)
        };
        Message.error = (msg) => {
            changeToast("error", msg)
        };
    }, [])
    const changeToast = (service, msg) => {
        setOpen(true);
        setSeverity(service);
        setContent(msg);
    }
    const [isOpen, setOpen] = useState(false);
    const [severity, setSeverity] = useState("info");
    const [content, setContent] = useState("");

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') return
        setOpen(false)
    };

    return (
        <ThemeProvider theme={theme} >
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={isOpen} autoHideDuration={2000} color={severity}   >
                <Alert elevation={6} variant={"filled"} severity={severity} action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                } >
                    <AlertTitle>{severity.slice(0, 1).toUpperCase() + severity.slice(1).toLowerCase()}</AlertTitle>
                    <Box sx={{ width: 150 }}>
                        {content}
                    </Box>
                </Alert>
            </Snackbar>
        </ThemeProvider>
    )
}

export default GlobalSnackbar