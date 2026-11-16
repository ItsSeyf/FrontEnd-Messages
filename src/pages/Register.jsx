import { useRegister } from '../hooks/useRegister.js';
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

export default function Register() {
    const { error, closeAlert, errormessage, cargando, validar, handleSubmit } = useRegister();

    return (
        <Box className="auth-page">
            <Box className="auth-card surface">
                <Box className="auth-card__brand">
                    <span className="brand__mark" aria-hidden="true">m</span>
                    <span>Messages</span>
                </Box>
                <Typography component="h1" className="auth-card__heading">Create your account</Typography>
                <Typography className="auth-card__description">A few details and you’re ready to connect.</Typography>
                <Box component="form" onSubmit={handleSubmit} className="form-stack">
                    <FormControl>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <TextField
                            autoComplete="name"
                            name="name"
                            required
                            fullWidth
                            id="name"
                            placeholder="Your name"
                            size="small"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="user">Username</FormLabel>
                        <TextField
                            autoComplete="username"
                            name="user"
                            required
                            fullWidth
                            id="user"
                            placeholder="Choose a username"
                            size="small"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            autoComplete="email"
                            name="email"
                            required
                            fullWidth
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            size="small"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="pass">Password</FormLabel>
                        <TextField
                            autoComplete="new-password"
                            name="pass"
                            required
                            type="password"
                            fullWidth
                            id="pass"
                            placeholder="Create a password"
                            size="small"
                        />
                    </FormControl>
                    <Button type="submit" variant="contained" className="primary-button" onClick={validar} fullWidth disabled={cargando}>
                        {cargando ? 'Creating account…' : 'Create account'}
                    </Button>
                </Box>
                <Box className="auth-card__footer">
                    Already have an account?
                    <Link to="/Login">Log in</Link>
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
