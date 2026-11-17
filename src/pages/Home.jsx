import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useMessages } from '../hooks/useMessages.js';
import Navbar from '../components/Navbar.jsx';
import EmptyState from '../components/EmptyState.jsx';

function formatMessageTimestamp(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const now = new Date();
    const isToday = date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
    return isToday
        ? time
        : `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`;
}

export default function Home({ routeParams }) {
    const { cargando, error, mensajeError, state, handleSubmit, closeAlert, editmessage, deletemessage } = useMessages(routeParams);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');
    const initials = (routeParams.name || routeParams.receiver || '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <>
            <Navbar />
            <Container className="conversation-page">
                <Box className="conversation surface">
                    <Box className="conversation__header">
                        <Avatar className="contact-avatar" aria-hidden="true">{initials}</Avatar>
                        <Box>
                            <Typography component="h1" className="conversation__title">{routeParams.name}</Typography>
                            <Typography className="conversation__subtitle">@{routeParams.receiver}</Typography>
                        </Box>
                    </Box>

                    <Box className="conversation__messages" aria-live="polite">
                        {cargando && state.length === 0 ? (
                            <Box className="loading-state">
                                <CircularProgress size={18} />
                                <span>Loading conversation…</span>
                            </Box>
                        ) : state.length > 0 ? (
                            state.map((mensaje, index) => {
                                const isOwnMessage = mensaje.sender !== routeParams.receiver;
                                const isEditing = editingMessageId === mensaje.id;
                                const messageText = mensaje.message ?? mensaje.messages;

                                return (
                                    <Box
                                        key={mensaje.id ?? index}
                                        className={`message-row${isOwnMessage ? ' message-row--own' : ''}`}
                                    >
                                        <Box className="message-bubble">
                                            {isEditing ? (
                                                <TextField
                                                    className="message-edit"
                                                    value={editedMessage}
                                                    onChange={(event) => setEditedMessage(event.target.value)}
                                                    multiline
                                                    fullWidth
                                                    autoFocus
                                                    disabled={cargando}
                                                    inputProps={{ 'aria-label': 'Edit message' }}
                                                />
                                            ) : (
                                                <Typography className="message-bubble__text" sx={{ whiteSpace: 'pre-wrap' }}>
                                                    {messageText}
                                                </Typography>
                                            )}
                                            <Box className="message-bubble__meta">
                                                <span>{formatMessageTimestamp(mensaje.created_at)}</span>
                                            </Box>

                                            {isOwnMessage && (
                                                <Box className="message-bubble__actions">
                                                    {isEditing ? (
                                                        <>
                                                            <Button
                                                                onClick={() => {
                                                                    setEditingMessageId(null);
                                                                    setEditedMessage('');
                                                                }}
                                                                disabled={cargando}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={async () => {
                                                                    await editmessage({ id: mensaje.id, messages: editedMessage, receiver: routeParams.receiver });
                                                                    setEditingMessageId(null);
                                                                    setEditedMessage('');
                                                                }}
                                                                disabled={cargando || !editedMessage.trim()}
                                                            >
                                                                Save
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                onClick={() => {
                                                                    setEditingMessageId(mensaje.id);
                                                                    setEditedMessage(messageText);
                                                                }}
                                                                disabled={cargando}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                className="danger-button"
                                                                onClick={() => deletemessage({id: mensaje.id, receiver: routeParams.receiver})}
                                                                disabled={cargando}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })
                        ) : (
                            <EmptyState
                                icon="✉"
                                title="No messages yet"
                                description={`Send a message to ${routeParams.name} to start the conversation.`}
                            />
                        )}
                    </Box>

                    <Box className="conversation__composer">
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            className="conversation__composer-inner"
                        >
                            <TextField
                                id="mensaje"
                                name="mensaje"
                                placeholder="Write a message…"
                                fullWidth
                                multiline
                                maxRows={5}
                                required
                                disabled={cargando}
                                inputProps={{ 'aria-label': 'Write a message' }}
                            />
                            <TextField
                                id="receptor"
                                name="receptor"
                                type="hidden"
                                value={routeParams.receiver}
                                required
                                sx={{ display: 'none' }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                className="conversation__send"
                                disabled={cargando}
                            >
                                {cargando ? 'Sending…' : 'Send'}
                            </Button>
                        </Box>
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
