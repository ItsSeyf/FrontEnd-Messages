import { Link } from '../components/Link.jsx';
import { Box, Typography } from '@mui/material';

export default function Page404() {
    return (
        <Box className="not-found">
            <Box>
                <Typography component="h1" className="not-found__code">404</Typography>
                <Typography component="h2" className="page-heading">Page not found</Typography>
                <Link className="not-found__link" to="/">Back to the main page</Link>
            </Box>
        </Box>
    );
}