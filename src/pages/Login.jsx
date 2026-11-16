import { useLogin } from '../hooks/useLogin.js';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    TextField,
    Typography
} from '@mui/material';
import { Link } from '../components/Link.jsx';

export default function Login() {
    const { error, errormessage, closeAlert, cargando, handleSubmit } = useLogin();

    return (
        <Box className="auth-page">
            <Box className="auth-card surface">
                <Box className="auth-card__brand">
                    <span className="brand__mark" aria-hidden="true">T</span>
                    <span>TSTChat</span>
                </Box>
                <Typography component="h1" className="auth-card__heading">Welcome back</Typography>
                <Typography className="auth-card__description">Log in to continue to your messages.</Typography>
                <Box component="form" onSubmit={handleSubmit} className="form-stack">
                    <FormControl>
                        <FormLabel htmlFor="user">Username</FormLabel>
                        <TextField
                            autoComplete="username"
                            name="user"
                            required
                            fullWidth
                            id="user"
                            placeholder="Your username"
                            size="small"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="pass">Password</FormLabel>
                        <TextField
                            autoComplete="current-password"
                            name="pass"
                            required
                            type="password"
                            fullWidth
                            id="pass"
                            placeholder="Your password"
                            size="small"
                        />
                    </FormControl>
                    <Button type="submit" variant="contained" className="primary-button" fullWidth disabled={cargando}>
                        {cargando ? 'Logging in…' : 'Log in'}
                    </Button>
                </Box>
                <Box className="auth-card__footer">
                    Don’t have an account?
                    <Link to="/Register">Create one</Link>
                </Box>
                <Dialog
                    open={error}
                    onClose={closeAlert}
                    aria-labelledby="error-dialog-title"
                    aria-describedby="error-dialog-description"
                >
                    <DialogTitle id="error-dialog-title">An error occurred</DialogTitle>
                    <DialogContent>
                        <Alert severity="error" sx={{ mt: 1 }}>
                            <AlertTitle>Error</AlertTitle>
                            <span id="error-dialog-description">{errormessage}</span>
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeAlert} variant="contained" color="error" autoFocus>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
