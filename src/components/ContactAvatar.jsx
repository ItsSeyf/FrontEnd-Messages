import { Avatar } from '@mui/material';

export default function ContactAvatar({ name, username }) {
    const initials = (name || username || '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <Avatar className="contact-avatar" aria-hidden="true">
            {initials}
        </Avatar>
    );
}
