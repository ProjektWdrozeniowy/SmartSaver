// src/components/dashboard/PowiadomieniaSection.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    List,
    ListItem,
    ListItemText,
    Divider,
    Menu,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useThemeMode } from '../../context/ThemeContext';
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
} from '../../api/notifications';

const PowiadomieniaSection = ({ onNotificationChange }) => {
    const { mode } = useThemeMode();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchNotifications = async (currentFilter = filter) => {
        try {
            setLoading(true);
            const data = await getNotifications(currentFilter);
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            showSnackbar(error.message || 'Nie udało się pobrać powiadomień', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            showSnackbar('Powiadomienie oznaczone jako przeczytane');
            fetchNotifications();
            if (onNotificationChange) onNotificationChange();
        } catch (error) {
            showSnackbar(error.message || 'Nie udało się oznaczyć powiadomienia', 'error');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            showSnackbar('Wszystkie powiadomienia oznaczone jako przeczytane');
            fetchNotifications();
            if (onNotificationChange) onNotificationChange();
        } catch (error) {
            showSnackbar(error.message || 'Nie udało się oznaczyć powiadomień', 'error');
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            showSnackbar('Powiadomienie usunięte');
            fetchNotifications();
            if (onNotificationChange) onNotificationChange();
        } catch (error) {
            showSnackbar(error.message || 'Nie udało się usunąć powiadomienia', 'error');
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllNotifications();
            showSnackbar('Wszystkie powiadomienia usunięte');
            fetchNotifications();
            if (onNotificationChange) onNotificationChange();
        } catch (error) {
            showSnackbar(error.message || 'Nie udało się usunąć powiadomień', 'error');
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setAnchorEl(null);
        fetchNotifications(newFilter);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'budget_alert':
                return '💰';
            case 'goal_achieved':
                return '✅';
            case 'goal_reminder':
                return '📅';
            case 'monthly_summary':
                return '📊';
            default:
                return '🔔';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Teraz';
        if (diffMins < 60) return `${diffMins} min temu`;
        if (diffHours < 24) return `${diffHours} godz. temu`;
        if (diffDays === 1) return 'Wczoraj';
        if (diffDays < 7) return `${diffDays} dni temu`;

        return date.toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const filterLabels = {
        'all': 'Wszystkie',
        'unread': 'Nieprzeczytane',
        'budget_alert': 'Alerty budżetu',
        'goal_achieved': 'Osiągnięte cele',
        'goal_reminder': 'Przypomnienia'
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {unreadCount > 0 ? `${unreadCount} nieprzeczytanych` : 'Brak nowych powiadomień'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 154, 118, 0.3), rgba(255, 154, 118, 0.2))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 154, 118, 0.5)',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(255, 154, 118, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            textShadow: '0 0 10px rgba(255, 154, 118, 0.5)',
                            minWidth: '150px',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 154, 118, 0.3), rgba(255, 154, 118, 0.2))',
                                boxShadow: '0 0 12px 3px rgba(255, 154, 118, 0.2)',
                                transform: 'none',
                            }
                        }}
                    >
                        {filterLabels[filter] || 'Wszystkie'}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => handleFilterChange('all')}>Wszystkie</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('unread')}>Nieprzeczytane</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('budget_alert')}>Alerty budżetu</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('goal_achieved')}>Osiągnięte cele</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('goal_reminder')}>Przypomnienia</MenuItem>
                    </Menu>
                    {unreadCount > 0 && (
                        <Button
                            variant="contained"
                            startIcon={<DoneAllIcon />}
                            onClick={handleMarkAllAsRead}
                            sx={{
                                background: 'linear-gradient(135deg, rgba(255, 154, 118, 0.3), rgba(255, 154, 118, 0.2))',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 154, 118, 0.5)',
                                color: '#ffffff',
                                boxShadow: '0 4px 12px rgba(255, 154, 118, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textShadow: '0 0 10px rgba(255, 154, 118, 0.5)',
                                minWidth: '150px',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(255, 154, 118, 0.3), rgba(255, 154, 118, 0.2))',
                                    boxShadow: '0 0 12px 3px rgba(255, 154, 118, 0.2)',
                                    transform: 'none',
                                }
                            }}
                        >
                            Odznacz wszystkie
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteAll}
                            sx={{
                                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.2))',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(244, 67, 54, 0.5)',
                                color: '#ffffff',
                                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textShadow: '0 0 10px rgba(244, 67, 54, 0.5)',
                                minWidth: '150px',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.2))',
                                    boxShadow: '0 0 12px 3px rgba(244, 67, 54, 0.2)',
                                    transform: 'none',
                                }
                            }}
                        >
                            Usuń wszystkie
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Empty State */}
            {!loading && notifications.length === 0 && (
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        textAlign: 'center',
                        py: 8,
                        transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'none',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'none',
                            boxShadow: 'none',
                        },
                    }}
                >
                    <NotificationsIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                        Brak powiadomień
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {filter === 'unread' ? 'Wszystkie powiadomienia zostały przeczytane' : 'Nie masz jeszcze żadnych powiadomień'}
                    </Typography>
                </Card>
            )}

            {/* Notifications List */}
            {!loading && notifications.length > 0 && (
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'none',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'none',
                            boxShadow: 'none',
                        },
                    }}
                >
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        backgroundColor: notification.isRead
                                            ? 'transparent'
                                            : mode === 'dark'
                                                ? 'rgba(244, 67, 54, 0.08)'
                                                : 'rgba(244, 67, 54, 0.06)',
                                        '&:hover': {
                                            backgroundColor: notification.isRead
                                                ? mode === 'dark'
                                                    ? 'rgba(255, 255, 255, 0.05)'
                                                    : 'rgba(0, 0, 0, 0.03)'
                                                : mode === 'dark'
                                                    ? 'rgba(244, 67, 54, 0.12)'
                                                    : 'rgba(244, 67, 54, 0.09)',
                                        },
                                        transition: 'background-color 0.2s',
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {!notification.isRead && (
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <DoneAllIcon />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDelete(notification.id)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%', pr: 10 }}>
                                        <Box
                                            sx={{
                                                fontSize: 32,
                                                lineHeight: 1,
                                                mt: 0.5,
                                            }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: notification.isRead ? 400 : 600,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                                {!notification.isRead && (
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: 'error.main',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    mb: 0.5,
                                                    whiteSpace: 'pre-wrap',
                                                }}
                                            >
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {formatDate(notification.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                                {index < notifications.length - 1 && (
                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Card>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PowiadomieniaSection;
