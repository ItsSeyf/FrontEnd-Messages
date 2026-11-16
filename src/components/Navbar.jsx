import { AppBar, Button, Toolbar, Box } from '@mui/material'
import { Logout } from '../services/messages.js'
import { navigate } from './Link.jsx'

export default function Navbar() {
    const currentPath = window.location.pathname

    const handleLogout = async () => {
        await Logout()
        window.location.href = '/Login'
    }

    const handleNavigation = (event, path) => {
        const isModifiedClick = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
        if (event.button !== 0 || isModifiedClick) return

        event.preventDefault()
        navigate(path)
        window.scrollTo(0, 0)
    }

    return (
        <AppBar component="nav" position="static" className="topbar">
            <Toolbar className="topbar__toolbar">
                <a className="brand" href="/Agenda" onClick={(event) => handleNavigation(event, '/Agenda')}>
                    <span className="brand__mark" aria-hidden="true">T</span>
                    <span>TSTChat</span>
                </a>
                <Box className="topbar__nav">
                    <Button
                    component="a"
                    href="/Agenda"
                    className="topbar__link"
                    aria-current={currentPath === '/Agenda' || currentPath === '/' ? 'page' : undefined}
                    onClick={(event) => handleNavigation(event, '/Agenda')}
                >
                    Agenda
                </Button>
                <Button
                    component="a"
                    href="/Blocked"
                    className="topbar__link"
                    aria-current={currentPath === '/Blocked' ? 'page' : undefined}
                    onClick={(event) => handleNavigation(event, '/Blocked')}
                >
                    Blocked
                </Button>
                </Box>
                <Button className="topbar__logout" onClick={handleLogout}>
                    Log out
                </Button>
            </Toolbar>
        </AppBar>
    )
}