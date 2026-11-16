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
    FormControl,
    FormLabel,
    TextField,
    Typography
} from '@mui/material';
import { useAgenda } from '../hooks/useAgenda.js';
import { navigate } from '../components/Link.jsx';
import Navbar from '../components/Navbar.jsx';
import ContactAvatar from '../components/ContactAvatar.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Agenda() {
    const { agenda, error, cargando, mensajeError, handleSubmit, removeFromAgenda, closeAlert } = useAgenda();

    return (
        <>
            <Navbar />
            <Container className="page-container">
                <Box sx={{ mb: 3 }}>
                    <Typography component="h1" className="page-heading">Your contacts</Typography>
                    <Typography className="page-subheading">
                        Keep your conversations close and start a chat anytime.
                    </Typography>
                </Box>

                <Box
                    className="agenda-layout"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(260px, 0.72fr) minmax(0, 1.5fr)',
                        gap: 2.5,
                        alignItems: 'start'
                    }}
                >
                    <Box className="surface">
                        <Box className="surface__header">
                            <Typography className="section-title">Add a contact</Typography>
                            <Typography className="section-caption">Add someone using their username.</Typography>
                        </Box>
                        <Box className="surface__body">
                            <Box component="form" onSubmit={handleSubmit} className="form-stack">
                                <FormControl>
                                    <FormLabel htmlFor="receiver">Username</FormLabel>
                                    <TextField
                                        id="receiver"
                                        name="receiver"
                                        placeholder="Enter username"
                                        fullWidth
                                        required
                                        size="small"
                                    />
                                </FormControl>
                                <Button type="submit" variant="contained" className="primary-button" disabled={cargando}>
                                    {cargando ? 'Adding contact…' : 'Add contact'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Box className="surface" sx={{ overflow: 'hidden' }}>
                        <Box className="surface__header">
                            <Typography className="section-title">Agenda</Typography>
                            <Typography className="section-caption">
                                {agenda.length} {agenda.length === 1 ? 'contact' : 'contacts'}
                            </Typography>
                        </Box>
                        {cargando && agenda.length === 0 ? (
                            <Box className="loading-state">
                                <CircularProgress size={18} />
                                <span>Loading contacts…</span>
                            </Box>
                        ) : agenda.length > 0 ? (
                            <Box className="contact-list">
                                {agenda.map((person, index) => (
                                    <Box className="contact-row" key={person.username || index}>
                                        <ContactAvatar name={person.name} username={person.username} />
                                        <Box className="contact-row__details">
                                            <Typography className="contact-row__name">{person.name}</Typography>
                                            <Typography className="contact-row__username">@{person.username}</Typography>
                                        </Box>
                                        <Box className="contact-row__actions">
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate(`/Home/${encodeURIComponent(person.username)}/${encodeURIComponent(person.name)}`)}
                                                disabled={cargando}
                                            >
                                                Open chat
                                            </Button>
                                            <Button
                                                className="danger-button"
                                                onClick={() => removeFromAgenda(person.username)}
                                                disabled={cargando}
                                            >
                                                Block
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <EmptyState
                                icon="＋"
                                title="Your agenda is empty"
                                description="Add a contact by username to start a conversation."
                            />
                        )}
                    </Box>
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
