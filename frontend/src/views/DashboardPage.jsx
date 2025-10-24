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
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SavingsIcon from '@mui/icons-material/Savings';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../api/auth';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

    // Menu items
    const menuItems = [
        { id: 'pulpit', label: 'Pulpit', icon: <DashboardIcon /> },
        { id: 'wydatki', label: 'Wydatki', icon: <AccountBalanceWalletIcon /> },
        { id: 'budzet', label: 'Budżet', icon: <TrendingUpIcon /> },
        { id: 'rachunki', label: 'Rachunki', icon: <ReceiptIcon /> },
        { id: 'cele', label: 'Cele', icon: <TrackChangesIcon /> },
        { id: 'analizy', label: 'Analizy', icon: <BarChartIcon /> },
        { id: 'ustawienia', label: 'Ustawienia', icon: <SettingsIcon /> },
    ];

    // Stats data with navigation
    const stats = [
        {
            title: 'Aktualne saldo',
            value: '12,450 zł',
            change: '+2.5%',
            positive: true,
            icon: <AttachMoneyIcon />,
            color: '#00f0ff',
            navigateTo: 'budzet',
        },
        {
            title: 'Przychody (mies)',
            value: '5,730 zł',
            change: '+12%',
            positive: true,
            icon: <TrendingUpIcon />,
            color: '#a8e6cf',
            navigateTo: 'budzet',
        },
        {
            title: 'Wydatki (miesiąc)',
            value: '3,280 zł',
            change: '-15%',
            positive: true,
            icon: <AccountBalanceWalletIcon />,
            color: '#ff6b9d',
            navigateTo: 'wydatki',
        },
        {
            title: 'Twoje oszczędności',
            value: '8,500 zł',
            change: '+8%',
            positive: true,
            icon: <SavingsIcon />,
            color: '#ffd93d',
            navigateTo: 'budzet',
        },
        {
            title: 'Twój cel (Wakacje)',
            value: '68%',
            change: '+5%',
            positive: true,
            icon: <TrackChangesIcon />,
            color: '#c77dff',
            navigateTo: 'cele',
        },
    ];

    // Expenses by category data
    const expensesByCategory = [
        { name: 'Jedzenie', value: 850, color: '#ff6b9d' },
        { name: 'Transport', value: 420, color: '#00f0ff' },
        { name: 'Rozrywka', value: 320, color: '#a8e6cf' },
        { name: 'Rachunki', value: 980, color: '#ffd93d' },
        { name: 'Zakupy', value: 710, color: '#c77dff' },
    ];

    // Recent transactions data
    const recentTransactions = [
        {
            id: 1,
            title: 'Zakupy spożywcze',
            category: 'Jedzenie',
            amount: -125.50,
            date: '2025-10-23',
            icon: '🛒',
        },
        {
            id: 2,
            title: 'Pensja',
            category: 'Przychód',
            amount: 5730.00,
            date: '2025-10-20',
            icon: '💰',
        },
        {
            id: 3,
            title: 'Netflix',
            category: 'Rozrywka',
            amount: -49.99,
            date: '2025-10-19',
            icon: '🎬',
        },
        {
            id: 4,
            title: 'Prąd',
            category: 'Rachunki',
            amount: -230.00,
            date: '2025-10-18',
            icon: '⚡',
        },
        {
            id: 5,
            title: 'Restauracja',
            category: 'Jedzenie',
            amount: -89.50,
            date: '2025-10-17',
            icon: '🍽️',
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
                            <Grid item xs={12} sm={6} lg={4} xl={2.4} key={index}>
                                <Card
                                    onClick={() => setSelectedMenu(stat.navigateTo)}
                                    sx={{
                                        height: '100%',
                                        backgroundColor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        cursor: 'pointer',
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            {stat.positive ? (
                                                <ArrowUpwardIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                                            ) : (
                                                <ArrowDownwardIcon sx={{ fontSize: 16, color: '#f44336' }} />
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: stat.positive ? '#4caf50' : '#f44336',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {stat.change}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Content Grid - Transactions and Chart */}
                    <Grid container spacing={3}>
                        {/* Recent Transactions */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    backgroundColor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                                        Ostatnie transakcje
                                    </Typography>
                                    <List sx={{ p: 0 }}>
                                        {recentTransactions.map((transaction, index) => (
                                            <React.Fragment key={transaction.id}>
                                                <ListItem
                                                    sx={{
                                                        px: 0,
                                                        py: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 240, 255, 0.05)',
                                                            borderRadius: 2,
                                                            cursor: 'pointer',
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.5rem',
                                                            mr: 2,
                                                        }}
                                                    >
                                                        {transaction.icon}
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                            {transaction.title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {transaction.category} • {transaction.date}
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            color: transaction.amount > 0 ? '#4caf50' : 'text.primary',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {transaction.amount > 0 ? '+' : ''}
                                                        {transaction.amount.toFixed(2)} zł
                                                    </Typography>
                                                </ListItem>
                                                {index < recentTransactions.length - 1 && <Divider sx={{ my: 0 }} />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Expenses by Category Chart */}
                        <Grid item xs={12} md={8}>
                            <Card
                                sx={{
                                    backgroundColor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                                        Wydatki według kategorii
                                    </Typography>
                                    <Box sx={{ width: '100%', height: 400 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={expensesByCategory}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={140}
                                                    fill="#8884d8"
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {expensesByCategory.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1a1a1a',
                                                        border: '1px solid #333',
                                                        borderRadius: '8px',
                                                    }}
                                                    formatter={(value) => `${value} zł`}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    formatter={(value) => (
                                                        <span style={{ color: '#b0b0b0' }}>{value}</span>
                                                    )}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default DashboardPage;