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
    Alert,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDashboardStats, getRecentTransactions, getExpensesByCategory } from '../../api/dashboard';

const PulpitSection = ({ user, onNavigate }) => {
    // State for data
    const [stats, setStats] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Icons mapping for stats
    const iconMap = {
        balance: <AttachMoneyIcon />,
        income: <TrendingUpIcon />,
        expenses: <AccountBalanceWalletIcon />,
        savings: <SavingsIcon />,
        goal: <TrackChangesIcon />,
    };

    // Default fallback stats
    const defaultStats = [
        {
            title: 'Aktualne saldo',
            value: '0 zł',
            change: '0%',
            positive: true,
            icon: <AttachMoneyIcon />,
            color: '#00f0ff',
            navigateTo: 'budzet',
        },
        {
            title: 'Przychody (mies)',
            value: '0 zł',
            change: '0%',
            positive: true,
            icon: <TrendingUpIcon />,
            color: '#a8e6cf',
            navigateTo: 'budzet',
        },
        {
            title: 'Wydatki (miesiąc)',
            value: '0 zł',
            change: '0%',
            positive: true,
            icon: <AccountBalanceWalletIcon />,
            color: '#ff6b9d',
            navigateTo: 'wydatki',
        },
        {
            title: 'Twoje oszczędności',
            value: '0 zł',
            change: '0%',
            positive: true,
            icon: <SavingsIcon />,
            color: '#ffd93d',
            navigateTo: 'budzet',
        },
        {
            title: 'Twój cel',
            value: '0%',
            change: '0%',
            positive: true,
            icon: <TrackChangesIcon />,
            color: '#c77dff',
            navigateTo: 'cele',
        },
    ];

    // Fetch data on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

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
                setError(err.message || 'Nie udało się pobrać danych');

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

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error} - Wyświetlane są dane domyślne. Spróbuj odświeżyć stronę.
                </Alert>
            )}

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
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
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
                            )}
                        </CardContent>
                    </Card>
                </Box>

                {/* Expenses by Category Chart */}
                <Box sx={{ flex: '0 0 65%', minWidth: 0 }}>
                    <Card
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                        }}
                    >
                        <CardContent sx={{ height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                                Wydatki według kategorii
                            </Typography>
                            {expensesByCategory.length === 0 ? (
                                <Box sx={{
                                    width: '100%',
                                    height: 450,
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
                                <Box sx={{ width: '100%', height: 450 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expensesByCategory}
                                                cx="50%"
                                                cy="48%"
                                                innerRadius={95}
                                                outerRadius={160}
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
        </Box>
    );
};

export default PulpitSection;
