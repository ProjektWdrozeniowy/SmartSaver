// src/components/dashboard/PulpitSection.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    Divider,
    CircularProgress,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDashboardStats, getRecentTransactions, getExpensesByCategory } from '../../api/dashboard';

const PulpitSection = ({ user, onNavigate }) => {
    // Theme and responsive breakpoints
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // State for data
    const [stats, setStats] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Snackbar function
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Chart dimensions based on screen size
    const chartHeight = isMobile ? 300 : isTablet ? 400 : 450;
    const innerRadius = isMobile ? 50 : isTablet ? 70 : 95;
    const outerRadius = isMobile ? 90 : isTablet ? 120 : 160;

    // Icons mapping for stats
    const iconMap = {
        balance: <AttachMoneyIcon />,
        income: <TrendingUpIcon />,
        expenses: <AccountBalanceWalletIcon />,
        goal: <TrackChangesIcon />,
    };

    // Default fallback stats
    const defaultStats = [
        {
            title: 'Aktualne saldo',
            value: '0 zł',
            icon: <AttachMoneyIcon />,
            color: '#00b8d4',
            navigateTo: 'budzet',
        },
        {
            title: 'Przychody (miesiąc)',
            value: '0 zł',
            icon: <TrendingUpIcon />,
            color: '#66bb6a',
            navigateTo: 'budzet',
        },
        {
            title: 'Wydatki (miesiąc)',
            value: '0 zł',
            icon: <AccountBalanceWalletIcon />,
            color: '#ef5350',
            navigateTo: 'wydatki',
        },
        {
            title: 'Twój cel',
            value: '0%',
            icon: <TrackChangesIcon />,
            color: '#ab47bc',
            navigateTo: 'cele',
        },
    ];

    // Fetch data on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Parallel API calls
                const [statsData, transactionsData, categoryData] = await Promise.all([
                    getDashboardStats(),
                    getRecentTransactions(5),
                    getExpensesByCategory(),
                ]);

                // Map stats data with icons and navigation
                const mappedStats = (statsData.stats || []).map(stat => ({
                    ...stat,
                    icon: iconMap[stat.iconKey] || <AttachMoneyIcon />,
                }));

                setStats(mappedStats.length > 0 ? mappedStats : defaultStats);
                setRecentTransactions(transactionsData.transactions || []);
                setExpensesByCategory(categoryData.categories || []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                showSnackbar(err.message || 'Nie udało się pobrać danych', 'error');

                // Fallback to default/empty data
                setStats(defaultStats);
                setRecentTransactions([]);
                setExpensesByCategory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Welcome message */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Witaj, {user?.username || 'Użytkowniku'}! 👋
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Oto Twoje podsumowanie finansowe
                </Typography>
            </Box>

            {/* Loading overlay for stats */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <CircularProgress size={30} />
                </Box>
            )}

            {/* Stats Cards */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                width: '100%',
                flexWrap: 'wrap'
            }}>
                {stats.map((stat, index) => (
                    <Box key={index} sx={{
                        flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)', lg: '1 1 calc(20% - 13px)' },
                        minWidth: 0
                    }}>
                        <Card
                            onClick={() => onNavigate(stat.navigateTo)}
                            sx={{
                                height: '100%',
                                background: `linear-gradient(135deg, ${stat.color}25, ${stat.color}10)`,
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: `${stat.color}50`,
                                boxShadow: `0 4px 12px ${stat.color}15, inset 0 1px 0 ${stat.color}25`,
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: `0 12px 28px ${stat.color}30, inset 0 1px 0 ${stat.color}40`,
                                    borderColor: `${stat.color}70`,
                                },
                            }}
                        >
                            <CardContent sx={{ pb: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        {stat.title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: `${stat.color}30`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: stat.color,
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        textShadow: `0 0 15px ${stat.color}40, 0 0 30px ${stat.color}20`
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                {stat.budgetPercentage !== null && stat.budgetPercentage !== undefined && (
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            pt: 0.5,
                                            borderTop: '1px solid',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: parseFloat(stat.budgetPercentage) >= 100
                                                    ? '#f44336'
                                                    : parseFloat(stat.budgetPercentage) >= 90
                                                    ? '#ff6b9d'
                                                    : parseFloat(stat.budgetPercentage) >= 70
                                                    ? '#ffa726'
                                                    : '#4caf50',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            {stat.budgetPercentage}% budżetu
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Content Grid - Transactions and Chart */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                width: '100%',
                flexDirection: { xs: 'column', md: 'row' }
            }}>
                {/* Recent Transactions */}
                <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    <Card
                        onClick={() => onNavigate('wydatki')}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'none',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                                Ostatnie transakcje
                            </Typography>
                            {recentTransactions.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                                        Brak ostatnich transakcji
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Dodaj swoje pierwsze wydatki w sekcji Wydatki
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ p: 0 }}>
                                    {recentTransactions.map((transaction, index) => (
                                        <React.Fragment key={`${transaction.type}-${transaction.id}`}>
                                            <ListItem
                                                sx={{
                                                    px: 0,
                                                    py: 2,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 184, 212, 0.05)',
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
                                                    {transaction.amount.toFixed(2).replace('.', ',')} zł
                                                </Typography>
                                            </ListItem>
                                            {index < recentTransactions.length - 1 && <Divider sx={{ my: 0 }} />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Box>

                {/* Expenses by Category Chart */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 65%' }, minWidth: 0 }}>
                    <Card
                        onClick={() => onNavigate('analizy')}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'none',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                                Wydatki według kategorii
                            </Typography>
                            {expensesByCategory.length === 0 ? (
                                <Box sx={{
                                    width: '100%',
                                    height: chartHeight,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                                        📊
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                                        Brak danych do wyświetlenia
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Dodaj wydatki, aby zobaczyć wykres
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ width: '100%', height: chartHeight }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expensesByCategory}
                                                cx="50%"
                                                cy={isMobile ? '45%' : '48%'}
                                                innerRadius={innerRadius}
                                                outerRadius={outerRadius}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                                                    color: '#ffffff',
                                                }}
                                                itemStyle={{
                                                    color: '#ffffff',
                                                }}
                                                labelStyle={{
                                                    color: '#ffffff',
                                                }}
                                                formatter={(value) => `${value} zł`}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={50}
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                formatter={(value) => (
                                                    <span style={{ color: '#b0b0b0' }}>{value}</span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
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

export default PulpitSection;
