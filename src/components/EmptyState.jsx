import { Box, Typography } from '@mui/material';

export default function EmptyState({ icon, title, description }) {
    return (
        <Box className="empty-state">
            <Box className="empty-state__icon" aria-hidden="true">{icon}</Box>
            <Typography className="empty-state__title">{title}</Typography>
            {description && (
                <Typography className="empty-state__description">{description}</Typography>
            )}
        </Box>
    );
}
