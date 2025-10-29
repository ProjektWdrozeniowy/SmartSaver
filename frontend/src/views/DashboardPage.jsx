// src/views/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Container,
    Avatar,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../api/auth';

// Import dashboard sections
import PulpitSection from '../components/dashboard/PulpitSection';
import WydatkiSection from '../components/dashboard/WydatkiSection';
import BudzetSection from '../components/dashboard/BudzetSection';
import CeleSection from '../components/dashboard/CeleSection';
import AnalizySection from '../components/dashboard/AnalizySection';
import UstawieniaSection from '../components/dashboard/UstawieniaSection';

const drawerWidth = 260;

const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('pulpit');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Pobierz dane użytkownika z localStorage
        const userData = getUser();
        if (userData) {
            setUser(userData);
        }
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        // Wyloguj użytkownika (usuń token i dane z localStorage)
        logout();
        navigate('/signin');
    };

    // Funkcja do wygenerowania inicjałów
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Menu items with colors matching dashboard cards
    const menuItems = [
        { id: 'pulpit', label: 'Pulpit', icon: <DashboardIcon />, color: '#00f0ff' }, // Aktualne saldo - cyan
        { id: 'wydatki', label: 'Wydatki', icon: <AccountBalanceWalletIcon />, color: '#ff6b9d' }, // Wydatki - różowy
        { id: 'budzet', label: 'Budżet', icon: <TrendingUpIcon />, color: '#a8e6cf' }, // Przychody - zielony
        { id: 'cele', label: 'Cele', icon: <TrackChangesIcon />, color: '#c77dff' }, // Twój cel - fioletowy
        { id: 'analizy', label: 'Analizy', icon: <BarChartIcon />, color: '#ffd93d' }, // Oszczędności - żółty
        { id: 'ustawienia', label: 'Ustawienia', icon: <SettingsIcon />, color: '#90a4ae' }, // Ustawienia - blue-grey
    ];

    // Titles for AppBar (can be different from menu labels)
    const sectionTitles = {
        pulpit: 'Pulpit',
        wydatki: 'Wydatki',
        budzet: 'Budżet',
        cele: 'Cele oszczędnościowe',
        analizy: 'Analizy i statystyki',
        ustawienia: 'Ustawienia',
    };

    // Render content based on selected menu
    const renderContent = () => {
        switch (selectedMenu) {
            case 'pulpit':
                return <PulpitSection user={user} onNavigate={setSelectedMenu} />;
            case 'wydatki':
                return <WydatkiSection />;
            case 'budzet':
                return <BudzetSection />;
            case 'cele':
                return <CeleSection />;
            case 'analizy':
                return <AnalizySection />;
            case 'ustawienia':
                return <UstawieniaSection />;
            default:
                return <PulpitSection user={user} onNavigate={setSelectedMenu} />;
        }
    };

    // Drawer content (sidebar)
    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <Box
                sx={{
                    height: 64,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        letterSpacing: 1,
                    }}
                >
                    SmartSaver
                </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(0, 240, 255, 0.2)', boxShadow: '0 1px 2px rgba(0, 240, 255, 0.1)' }} />

            {/* Menu */}
            <List sx={{ flex: 1, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                        <ListItemButton
                            selected={selectedMenu === item.id}
                            onClick={() => setSelectedMenu(item.id)}
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                ...(selectedMenu === item.id && {
                                    background: `linear-gradient(135deg, ${item.color}33, ${item.color}1a)`,
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    border: `1px solid ${item.color}4d`,
                                    boxShadow: `0 4px 12px ${item.color}26, inset 0 1px 0 ${item.color}33`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${item.color}40, ${item.color}26)`,
                                        boxShadow: `0 6px 16px ${item.color}33, inset 0 1px 0 ${item.color}4d`,
                                    },
                                }),
                                '&:hover': {
                                    background: selectedMenu === item.id ? undefined : `${item.color}0d`,
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: selectedMenu === item.id ? item.color : 'text.secondary',
                                    filter: selectedMenu === item.id ? `drop-shadow(0 0 8px ${item.color}80)` : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    sx: {
                                        color: selectedMenu === item.id ? item.color : 'text.primary',
                                        textShadow: selectedMenu === item.id ? `0 0 10px ${item.color}40` : 'none',
                                        fontWeight: selectedMenu === item.id ? 600 : 400,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ borderColor: 'rgba(0, 240, 255, 0.2)', boxShadow: '0 1px 2px rgba(0, 240, 255, 0.1)' }} />

            {/* Logout */}
            <List sx={{ pb: 2 }}>
                <ListItem disablePadding sx={{ px: 1.5 }}>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                        <ListItemIcon sx={{ color: 'text.secondary' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Wyloguj" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            {/* AppBar (Top bar) */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(0, 240, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 240, 255, 0.1), inset 0 1px 0 rgba(0, 240, 255, 0.15)',
                }}
            >
                <Toolbar sx={{ minHeight: 64, px: 3 }}>
                    {/* Hamburger dla mobile */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Title */}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                        {sectionTitles[selectedMenu] || 'Dashboard'}
                    </Typography>

                    {/* User profile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {user?.username || 'Użytkownik'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {user?.email || 'email@example.com'}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: 'primary.main',
                                cursor: 'pointer',
                            }}
                        >
                            {getInitials(user?.username)}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(0, 240, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            borderRight: '1px solid rgba(0, 240, 255, 0.2)',
                            boxShadow: '4px 0 12px rgba(0, 240, 255, 0.1)',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(0, 240, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            borderRight: '1px solid rgba(0, 240, 255, 0.2)',
                            boxShadow: '4px 0 12px rgba(0, 240, 255, 0.1)',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: 8,
                    maxWidth: '100%',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;
