import {
    Alert,
    AlertTitle,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';
import { useBlock } from '../hooks/useBlock.js';
import Navbar from '../components/Navbar.jsx';
import ContactAvatar from '../components/ContactAvatar.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Blocked() {
    const { blockedUsers, cargando, error, mensajeError, handleUnblockUser, closeAlert } = useBlock();

    return (
        <>
            <Navbar />
            <Container className="page-container">
                <Box sx={{ mb: 3 }}>
                    <Typography component="h1" className="page-heading">Blocked users</Typography>
                    <Typography className="page-subheading">
                        Manage the people you have blocked.
                    </Typography>
                </Box>

                <Box className="surface" sx={{ overflow: 'hidden' }}>
                    <Box className="surface__header">
                        <Typography className="section-title">Blocked list</Typography>
                        <Typography className="section-caption">
                            {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'}
                        </Typography>
                    </Box>
                    {cargando && blockedUsers.length === 0 ? (
                        <Box className="loading-state">
                            <CircularProgress size={18} />
                            <span>Loading blocked users…</span>
                        </Box>
                    ) : blockedUsers.length > 0 ? (
                        <Box className="contact-list">
                            {blockedUsers.map((person, index) => (
                                <Box className="contact-row" key={person.username || index}>
                                    <ContactAvatar name={person.name} username={person.username} />
                                    <Box className="contact-row__details">
                                        <Typography className="contact-row__name">{person.name}</Typography>
                                        <Typography className="contact-row__username">@{person.username}</Typography>
                                    </Box>
                                    <Box className="contact-row__actions">
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleUnblockUser(person.username)}
                                            disabled={cargando}
                                        >
                                            {cargando ? 'Please wait…' : 'Unblock'}
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <EmptyState
                            icon="✓"
                            title="No blocked users"
                            description="Anyone you block will appear here, and you can unblock them at any time."
                        />
                    )}
                </Box>

                <Dialog open={error} onClose={closeAlert} aria-labelledby="error-dialog-title" aria-describedby="error-dialog-description">
                    <DialogTitle id="error-dialog-title">An error occurred</DialogTitle>
                    <DialogContent>
                        <Alert severity="error" sx={{ mt: 1 }}>
                            <AlertTitle>Error</AlertTitle>
                            <span id="error-dialog-description">{mensajeError}</span>
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeAlert} variant="contained" color="error" autoFocus>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}
