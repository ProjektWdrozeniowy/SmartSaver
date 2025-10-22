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
    Grid,
    Card,
    CardContent,
    Avatar,
    useTheme,
    useMediaQuery,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../api/auth';

const drawerWidth = 260;

const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
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

    // Menu items
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'expenses', label: 'Wydatki', icon: <AccountBalanceWalletIcon /> },
        { id: 'budget', label: 'Budżet', icon: <TrendingUpIcon /> },
        { id: 'reports', label: 'Raporty', icon: <AssessmentIcon /> },
        { id: 'settings', label: 'Ustawienia', icon: <SettingsIcon /> },
    ];

    // Fake data - placeholder
    const stats = [
        {
            title: 'Saldo',
            value: '12,450 zł',
            change: '+2.5%',
            positive: true,
            icon: <AttachMoneyIcon />,
            color: '#00f0ff',
        },
        {
            title: 'Wydatki (miesiąc)',
            value: '3,280 zł',
            change: '-15%',
            positive: true,
            icon: <AccountBalanceWalletIcon />,
            color: '#ff6b9d',
        },
        {
            title: 'Oszczędności',
            value: '8,500 zł',
            change: '+8%',
            positive: true,
            icon: <TrendingUpIcon />,
            color: '#a8e6cf',
        },
        {
            title: 'Cel budżetowy',
            value: '68%',
            change: 'Brak zmian',
            positive: false,
            icon: <AssessmentIcon />,
            color: '#ffd93d',
        },
    ];

    // Drawer content (sidebar)
    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <Box
                sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'primary.contrastText',
                    }}
                >
                    $
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    SmartSaver
                </Typography>
            </Box>

            <Divider />

            {/* Menu */}
            <List sx={{ flex: 1, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                        <ListItemButton
                            selected={selectedMenu === item.id}
                            onClick={() => setSelectedMenu(item.id)}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(0, 240, 255, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 240, 255, 0.2)',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: selectedMenu === item.id ? 'primary.main' : 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

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
                    backgroundColor: 'background.paper',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                }}
            >
                <Toolbar>
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
                        Dashboard
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
                            backgroundColor: 'background.paper',
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
                            backgroundColor: 'background.paper',
                            borderRight: '1px solid',
                            borderColor: 'divider',
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
                }}
            >
                <Container maxWidth="xl">
                    {/* Welcome message */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                            Witaj, {user?.username || 'Użytkowniku'}! 👋
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Oto Twoje podsumowanie finansowe
                        </Typography>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {stats.map((stat, index) => (
                            <Grid item xs={12} sm={6} lg={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        backgroundColor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 20px ${stat.color}30`,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                {stat.title}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: `${stat.color}20`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: stat.color,
                                                }}
                                            >
                                                {stat.icon}
                                            </Box>
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: stat.positive ? '#4caf50' : 'text.secondary',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {stat.change}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Placeholder content */}
                    <Card
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                            🚧 Dashboard w budowie
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                            To jest przykładowy layout Dashboard. Backend developer może tutaj zintegrować
                            rzeczywiste dane z API.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button variant="outlined">Dodaj wydatek</Button>
                            <Button variant="outlined">Zobacz raporty</Button>
                            <Button variant="contained" onClick={() => navigate('/')}>
                                Wróć na stronę główną
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
};

export default DashboardPage;