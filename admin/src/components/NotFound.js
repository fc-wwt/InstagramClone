import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Box, Paper } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5',
    },
    paper: {
        padding: theme.spacing(6),
        textAlign: 'center',
        maxWidth: 600,
        margin: 'auto',
    },
    errorIcon: {
        fontSize: 120,
        color: theme.palette.error.main,
        marginBottom: theme.spacing(2),
    },
    errorCode: {
        fontSize: '6rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(2),
    },
    title: {
        fontSize: '2rem',
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary,
    },
    description: {
        fontSize: '1.1rem',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(4),
        lineHeight: 1.6,
    },
    button: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(1.5, 4),
        fontSize: '1rem',
    },
}));

export default function NotFound() {
    const classes = useStyles();
    const history = useHistory();

    const handleGoHome = () => {
        history.push('/');
    };

    return (
        <Container className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
                <ErrorOutlineIcon className={classes.errorIcon} />
                <Typography className={classes.errorCode}>
                    404
                </Typography>
                <Typography className={classes.title}>
                    Page Not Found
                </Typography>
                <Typography className={classes.description}>
                    We're sorry, but the page you're looking for doesn't exist. 
                    The URL may be incorrect, or the page may have been moved or deleted.
                </Typography>
                <Box mt={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Here are some helpful links instead:
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    startIcon={<HomeIcon />}
                    onClick={handleGoHome}
                >
                    Go to Home Page
                </Button>
            </Paper>
        </Container>
    );
}
