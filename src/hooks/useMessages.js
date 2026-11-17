import { socket } from '../services/messages.js'
import { getMessages, sendMessage, editMessage, deleteMessage } from '../services/messages.js'
import { useState, useEffect, useReducer, useRef } from 'react';
import { messagesReducer, messagesInitialState } from '../reducers/messages.js';

export function useMessages({ receiver }) {
    const [state, dispatch] = useReducer(messagesReducer, messagesInitialState);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const receiverRef = useRef(receiver);
    receiverRef.current = receiver;
    const messagesRef = useRef(state);
    messagesRef.current = state;

    useEffect(() => {
        (async () => {
            setCargando(true);
            const respuesta = await getMessages(receiver);
            if (respuesta === 500) {
                setError(true);
                setMensajeError('Server error while getting messages. Try again later.');
                setCargando(false);
            } else if (respuesta === 401) {
                setCargando(false);
                window.location.href = '/Login'
                return;
            } else if (respuesta === 400) {
                setError(true);
                setMensajeError('Select an user');
                setCargando(false);
            }
            if (respuesta === null) {
                setCargando(false);
                return;
            }
            dispatch({
                type: 'LOAD',
                payload: respuesta
            })
            return;
        })()
        console.log('Coneccting Socket...')

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket error:', err);
        });
        const handleMessage = (mensaje) => {
            if (!mensaje || mensaje.sender !== receiverRef.current) return;
            dispatch({
                type: 'ADD',
                payload: mensaje
            })
        };
        const handleMessageEdited = (mensaje) => {
            if (!mensaje || mensaje.id == null) return;
            const existingMessage = messagesRef.current.find(
                (message) => message.id === mensaje.id
            );
            if (!existingMessage) return;

            dispatch({
                type: 'EDIT',
                payload: mensaje
            })
        };
        const handleMessageDeleted = (event) => {
            const id = event && typeof event === 'object' ? event.id : event;
            if (id == null) return;
            const existingMessage = messagesRef.current.find(
                (message) => message.id === id
            );
            if (!existingMessage) return;

            dispatch({
                type: 'DELETE',
                payload: { id: existingMessage.id }
            })
        };

        socket.on('message', handleMessage);
        socket.on('message:edited', handleMessageEdited);
        socket.on('message:deleted', handleMessageDeleted);
        socket.connect();

        return () => {
            socket.off('message', handleMessage)
            socket.off('message:edited', handleMessageEdited)
            socket.off('message:deleted', handleMessageDeleted)
            socket.off('connect');
            socket.off('connect_error');
            socket.disconnect();
        }
    }, [])
    useEffect(() => {
        setCargando(false)
    }, [state])
    const handleSubmit = async (event) => {
        setCargando(true);
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const messages = data.get('mensaje')
        const receiver = data.get('receptor')
        const created_at = new Date().toISOString()
        const respuesta = await sendMessage({ receiver, messages, created_at });
        if (respuesta === 500) {
            setCargando(false);
            setError(true);
            setMensajeError('Server error while sending message. Try again later.');
            return;
        } else if (respuesta === 404) {
            setCargando(false);
            setError(true);
            setMensajeError('Message not sent. Please try again.');
            return;
        } else if (respuesta.status === 401) {
            setCargando(false);
            form.reset();
            window.location.href = '/Login'
            return
        }
        setCargando(false);
        dispatch({
            type: 'ADD',
            payload: respuesta
        })
        form.reset()
        return
    }
    const editmessage = async (data) => {
        setCargando(true);
        const result = await editMessage(data)
        const { id, messages } = data;
        if (result) {
            dispatch({
                type: 'EDIT',
                payload: { id, messages }
            })
            return;
        }
        setCargando(false);
        setError(true);
        setMensajeError('Error editing your message. Try again later');
        return;
    }
    const deletemessage = async (data) => {
        setCargando(true)
        const { id } = data;
        const result = await deleteMessage(data)
        if (result === 500) {
            setError(true)
            setMensajeError('Error editing your message. Try again later')
            setCargando(false)
            return;
        }
        dispatch({
            type: 'DELETE',
            payload: { id }
        })
        setCargando(false);
        return;
    }
    const closeAlert = () => {
        setError(false);
        setMensajeError('');
    }

    return { cargando, error, mensajeError, state, editmessage, deletemessage, handleSubmit, closeAlert }
}