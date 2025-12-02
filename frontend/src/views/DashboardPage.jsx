// src/views/DashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
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
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import SecurityIcon from '@mui/icons-material/Security';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../api/auth';
import { getNotifications, checkGoalReminders } from '../api/notifications';
import { checkRecurringExpenses } from '../api/expenses';
import { checkRecurringIncomes } from '../api/budget';
import { checkRecurringContributions } from '../api/goals';
import { getTutorialStatus, completeTutorial } from '../api/tutorial';
import { useThemeMode } from '../context/ThemeContext';

// Import dashboard sections
import PulpitSection from '../components/dashboard/PulpitSection';
import WydatkiSection from '../components/dashboard/WydatkiSection';
import BudzetSection from '../components/dashboard/BudzetSection';
import CeleSection from '../components/dashboard/CeleSection';
import AnalizySection from '../components/dashboard/AnalizySection';
import UstawieniaSection from '../components/dashboard/UstawieniaSection';
import PowiadomieniaSection from '../components/dashboard/PowiadomieniaSection';
import Tutorial from '../components/dashboard/Tutorial';

const drawerWidth = 260;

const DashboardPage = () => {
    const theme = useTheme();
    const { mode } = useThemeMode();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('pulpit');
    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);
    const [settingsScrollTo, setSettingsScrollTo] = useState(null);
    const [runTutorial, setRunTutorial] = useState(false);
    const [tutorialData, setTutorialData] = useState({
        showIncome: false,
        showExpense: false,
        showGoal: false,
        showNotification: false,
    });
    const navigate = useNavigate();
    const hasCheckedReminders = useRef(false);

    useEffect(() => {
        // Ustaw tytuł strony
        document.title = 'SmartSaver - Pulpit';

        // Pobierz dane użytkownika z localStorage
        const userData = getUser();
        if (userData) {
            setUser(userData);
        }

        // Pobierz liczbę nieprzeczytanych powiadomień
        fetchUnreadCount();

        // Sprawdź status samouczka
        checkTutorialStatus();

        // Sprawdź przypomnienia o celach, cykliczne wydatki, cykliczne przychody i cykliczne wpłaty tylko raz
        if (!hasCheckedReminders.current) {
            hasCheckedReminders.current = true;
            checkGoalReminders().catch(error => {
                console.error('Error checking goal reminders:', error);
            });
            checkRecurringExpenses().catch(error => {
                console.error('Error checking recurring expenses:', error);
            });
            checkRecurringIncomes().catch(error => {
                console.error('Error checking recurring incomes:', error);
            });
            checkRecurringContributions().catch(error => {
                console.error('Error checking recurring contributions:', error);
            });
        }
    }, []);

    const checkTutorialStatus = async () => {
        try {
            // Don't show tutorial on mobile devices
            if (isMobile) {
                return;
            }

            // Check localStorage flag for testing
            const forceTutorial = localStorage.getItem('forceTutorial') === 'true';

            if (forceTutorial) {
                // Force tutorial for testing
                setRunTutorial(true);
                setSelectedMenu('pulpit');
                return;
            }

            // Check database status
            const data = await getTutorialStatus();
            if (!data.tutorialCompleted) {
                setRunTutorial(true);
                setSelectedMenu('pulpit');
            }
        } catch (error) {
            console.error('Error checking tutorial status:', error);
        }
    };

    const handleTutorialFinish = async () => {
        try {
            // Remove localStorage test flag if it exists
            localStorage.removeItem('forceTutorial');

            // Mark tutorial as completed in database
            await completeTutorial();
            setRunTutorial(false);

            // Clean up temporary tutorial data
            setTutorialData({
                showIncome: false,
                showExpense: false,
                showGoal: false,
                showNotification: false,
            });

            // Navigate to pulpit section after tutorial
            setSelectedMenu('pulpit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error completing tutorial:', error);
        }
    };

    const handleTutorialNavigate = (action) => {
        switch (action) {
            case 'budzet':
                setSelectedMenu('budzet');
                break;
            case 'add-income':
                setTutorialData({ ...tutorialData, showIncome: true });
                break;
            case 'close-income-dialog':
                setTutorialData({ ...tutorialData, showIncome: false });
                break;
            case 'wydatki':
                setSelectedMenu('wydatki');
                break;
            case 'add-expense':
                setTutorialData({ ...tutorialData, showExpense: true });
                break;
            case 'close-expense-dialog':
                setTutorialData({ ...tutorialData, showExpense: false });
                break;
            case 'cele':
                setSelectedMenu('cele');
                break;
            case 'add-goal':
                setTutorialData({ ...tutorialData, showGoal: true });
                break;
            case 'close-goal-dialog':
                setTutorialData({ ...tutorialData, showGoal: false });
                break;
            case 'powiadomienia':
                setSelectedMenu('powiadomienia');
                break;
            default:
                break;
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const data = await getNotifications('unread');
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const handleGoalChange = async () => {
        // Check for new goal reminders
        try {
            await checkGoalReminders();
        } catch (error) {
            console.error('Error checking goal reminders:', error);
        }
        // Refresh unread count
        await fetchUnreadCount();
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuSelect = (menuId) => {
        setSelectedMenu(menuId);
        // Refresh unread count when leaving notifications section
        if (menuId !== 'powiadomienia') {
            fetchUnreadCount();
        }
        // Close mobile drawer when menu item is clicked
        if (isMobile) {
            setMobileOpen(false);
        }
        // Scroll to top of page when changing sections
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Navigation handler for internal links (e.g., from dashboard cards)
    const handleNavigate = (menuId) => {
        setSelectedMenu(menuId);
        // Scroll to top of page when navigating
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        // Wyloguj użytkownika (usuń token i dane z localStorage)
        logout();
        navigate('/signin');
    };

    const handleAvatarClick = (event) => {
        setAvatarMenuAnchor(event.currentTarget);
    };

    const handleAvatarMenuClose = () => {
        setAvatarMenuAnchor(null);
    };

    const handleAvatarMenuItemClick = (action) => {
        handleAvatarMenuClose();
        if (action === 'logout') {
            handleLogout();
        } else {
            setSelectedMenu('ustawienia');
            setSettingsScrollTo(action);
            // Scroll to top of page when changing to settings
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
        { id: 'pulpit', label: 'Pulpit', icon: <DashboardIcon />, color: '#00b8d4' }, // Aktualne saldo - cyan
        { id: 'wydatki', label: 'Wydatki', icon: <AccountBalanceWalletIcon />, color: '#FF6B9D' }, // Wydatki - różowy
        { id: 'budzet', label: 'Budżet', icon: <TrendingUpIcon />, color: '#66bb6a' }, // Przychody - zielony
        { id: 'cele', label: 'Cele', icon: <TrackChangesIcon />, color: '#ab47bc' }, // Twój cel - fioletowy
        { id: 'analizy', label: 'Analizy', icon: <BarChartIcon />, color: '#fbc02d' }, // Oszczędności - żółty
        {
            id: 'powiadomienia',
            label: 'Powiadomienia',
            icon: unreadCount > 0 ? (
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            ) : (
                <NotificationsIcon />
            ),
            color: '#ff9a76'
        }, // Powiadomienia - pomarańczowy
        { id: 'ustawienia', label: 'Ustawienia', icon: <SettingsIcon />, color: '#076a99' }, // Ustawienia - deep blue
    ];

    // Titles for AppBar (can be different from menu labels)
    const sectionTitles = {
        pulpit: 'Pulpit',
        wydatki: 'Wydatki',
        budzet: 'Budżet',
        cele: 'Cele oszczędnościowe',
        analizy: 'Analizy i statystyki',
        powiadomienia: 'Powiadomienia',
        ustawienia: 'Ustawienia',
    };

    // Render content based on selected menu
    const renderContent = () => {
        switch (selectedMenu) {
            case 'pulpit':
                return <PulpitSection user={user} onNavigate={handleNavigate} />;
            case 'wydatki':
                return <WydatkiSection onExpenseChange={fetchUnreadCount} tutorialData={tutorialData} />;
            case 'budzet':
                return <BudzetSection tutorialData={tutorialData} />;
            case 'cele':
                return <CeleSection onGoalChange={handleGoalChange} tutorialData={tutorialData} />;
            case 'analizy':
                return <AnalizySection />;
            case 'powiadomienia':
                return <PowiadomieniaSection onNotificationChange={fetchUnreadCount} tutorialData={tutorialData} />;
            case 'ustawienia':
                return <UstawieniaSection scrollToSection={settingsScrollTo} onScrollComplete={() => setSettingsScrollTo(null)} />;
            default:
                return <PulpitSection user={user} onNavigate={handleNavigate} />;
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

            <Divider sx={{ borderColor: 'rgba(0, 184, 212, 0.2)', boxShadow: '0 1px 2px rgba(0, 184, 212, 0.1)' }} />

            {/* Menu */}
            <List sx={{ flex: 1, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                        <ListItemButton
                            data-tour={`menu-${item.id}`}
                            selected={selectedMenu === item.id}
                            onClick={() => handleMenuSelect(item.id)}
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

            <Divider sx={{ borderColor: 'rgba(0, 184, 212, 0.2)', boxShadow: '0 1px 2px rgba(0, 184, 212, 0.1)' }} />

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
                    background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.08), rgba(0, 184, 212, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0, 184, 212, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 184, 212, 0.1), inset 0 1px 0 rgba(0, 184, 212, 0.15)',
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
                            onClick={handleAvatarClick}
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: mode === 'dark' ? 'primary.main' : '#00838f',
                                cursor: 'pointer',
                            }}
                        >
                            {getInitials(user?.username)}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Avatar Menu - tylko na desktop */}
            <Menu
                anchorEl={avatarMenuAnchor}
                open={Boolean(avatarMenuAnchor)}
                onClose={handleAvatarMenuClose}
                sx={{ display: { xs: 'none', md: 'block' } }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 220,
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                    }
                }}
            >
                <MenuItem onClick={() => handleAvatarMenuItemClick('profile')}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Informacje o profilu</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAvatarMenuItemClick('notifications')}>
                    <ListItemIcon>
                        <NotificationsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Powiadomienia</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAvatarMenuItemClick('appearance')}>
                    <ListItemIcon>
                        <PaletteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Wygląd</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAvatarMenuItemClick('privacy')}>
                    <ListItemIcon>
                        <SecurityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dane i prywatność</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleAvatarMenuItemClick('logout')}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Wyloguj</ListItemText>
                </MenuItem>
            </Menu>

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
                            background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.08), rgba(0, 184, 212, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            borderRight: '1px solid rgba(0, 184, 212, 0.2)',
                            boxShadow: '4px 0 12px rgba(0, 184, 212, 0.1)',
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
                            background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.08), rgba(0, 184, 212, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            borderRight: '1px solid rgba(0, 184, 212, 0.2)',
                            boxShadow: '4px 0 12px rgba(0, 184, 212, 0.1)',
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

            {/* Tutorial */}
            <Tutorial
                run={runTutorial}
                onFinish={handleTutorialFinish}
                onNavigate={handleTutorialNavigate}
            />
        </Box>
    );
};

export default DashboardPage;
