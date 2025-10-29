// src/components/dashboard/AnalizySection.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    FormControl,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import PercentIcon from '@mui/icons-material/Percent';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    getAnalysisStatistics,
    getSavingsGrowth,
    getIncomeVsExpenses,
    getWeeklyExpenses,
} from '../../api/analysis';
import { getExpensesByCategory } from '../../api/dashboard';

const AnalizySection = () => {
    // Data states
    const [statistics, setStatistics] = useState({
        averageExpenses: 0,
        averageIncome: 0,
        averageSavings: 0,
        savingsRate: 0,
        expensesChange: 0,
        incomeChange: 0,
        savingsChange: 0,
        savingsRateChange: 0,
    });
    const [savingsGrowthData, setSavingsGrowthData] = useState([]);
    const [incomeVsExpensesData, setIncomeVsExpensesData] = useState([]);
    const [expensesByCategoryData, setExpensesByCategoryData] = useState([]);
    const [weeklyExpensesData, setWeeklyExpensesData] = useState([]);
    const [dailyAverage, setDailyAverage] = useState(0);

    // UI states
    const [selectedPeriod, setSelectedPeriod] = useState('last6months');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch all data on mount and period change
    useEffect(() => {
        fetchAllData();
    }, [selectedPeriod]);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [stats, savingsGrowth, incomeVsExpenses, expensesByCategory, weeklyExpenses] = await Promise.all([
                getAnalysisStatistics(selectedPeriod),
                getSavingsGrowth(selectedPeriod),
                getIncomeVsExpenses(selectedPeriod),
                getExpensesByCategory(), // Uses same endpoint as dashboard
                getWeeklyExpenses(8),
            ]);

            setStatistics(stats);
            setSavingsGrowthData(savingsGrowth.data || []);
            setIncomeVsExpensesData(incomeVsExpenses.data || []);
            setExpensesByCategoryData(expensesByCategory.categories || []);
            setWeeklyExpensesData(weeklyExpenses.data || []);
            setDailyAverage(weeklyExpenses.dailyAverage || 0);
        } catch (err) {
            console.error('Error fetching analysis data:', err);
            showSnackbar('Nie udało się pobrać danych analizy', 'error');

            // Leave data empty - do not use mock data
            setStatistics({
                averageExpenses: 0,
                averageIncome: 0,
                averageSavings: 0,
                savingsRate: 0,
                expensesChange: 0,
                incomeChange: 0,
                savingsChange: 0,
                savingsRateChange: 0,
            });
            setSavingsGrowthData([]);
            setIncomeVsExpensesData([]);
            setExpensesByCategoryData([]);
            setWeeklyExpensesData([]);
            setDailyAverage(0);
        } finally {
            setLoading(false);
        }
    };


    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: 'rgba(30, 30, 30, 0.95)',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 1.5,
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography
                            key={`item-${index}`}
                            variant="body2"
                            sx={{ color: entry.color, fontSize: '0.875rem' }}
                        >
                            {entry.name}: {entry.value.toFixed(2)} zł
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Szczegółowy przegląd Twoich finansów
                    </Typography>
                </Box>
                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                }
                            }
                        }}
                    >
                        <MenuItem value="last6months">Ostatnie 6 miesięcy</MenuItem>
                        <MenuItem value="last3months">Ostatnie 3 miesiące</MenuItem>
                        <MenuItem value="last12months">Ostatni rok</MenuItem>
                        <MenuItem value="thisyear">Ten rok</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Statistics Cards */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                width: '100%',
                flexWrap: 'wrap'
            }}>
                {/* Average Expenses */}
                <Box sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(255, 107, 157, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 107, 157, 0.3)',
                            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.15), inset 0 1px 0 rgba(255, 107, 157, 0.2)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 28px rgba(255, 107, 157, 0.25), inset 0 1px 0 rgba(255, 107, 157, 0.3)',
                                borderColor: 'rgba(255, 107, 157, 0.4)',
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Średnie wydatki
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#ff6b9d20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ff6b9d',
                                    }}
                                >
                                    <TrendingDownIcon />
                                </Box>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: 'text.primary',
                                    textShadow: '0 0 20px #ff6b9d60, 0 0 40px #ff6b9d40'
                                }}
                            >
                                {statistics.averageExpenses.toFixed(0)} zł
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: statistics.expensesChange < 0 ? '#4caf50' : '#ff6b9d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {statistics.expensesChange < 0 ? '↓' : '↑'} {Math.abs(statistics.expensesChange)}% od poprzedniego okresu
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Average Income */}
                <Box sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(0, 240, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            boxShadow: '0 4px 12px rgba(0, 240, 255, 0.15), inset 0 1px 0 rgba(0, 240, 255, 0.2)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 28px rgba(0, 240, 255, 0.25), inset 0 1px 0 rgba(0, 240, 255, 0.3)',
                                borderColor: 'rgba(0, 240, 255, 0.4)',
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Średnie przychody
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#00f0ff20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#00f0ff',
                                    }}
                                >
                                    <TrendingUpIcon />
                                </Box>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: 'text.primary',
                                    textShadow: '0 0 20px #00f0ff60, 0 0 40px #00f0ff40'
                                }}
                            >
                                {statistics.averageIncome.toFixed(0)} zł
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: statistics.incomeChange > 0 ? '#4caf50' : '#ff6b9d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {statistics.incomeChange > 0 ? '↑' : '↓'} {Math.abs(statistics.incomeChange)}% od poprzedniego okresu
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Average Savings */}
                <Box sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(168, 230, 207, 0.08), rgba(168, 230, 207, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(168, 230, 207, 0.3)',
                            boxShadow: '0 4px 12px rgba(168, 230, 207, 0.15), inset 0 1px 0 rgba(168, 230, 207, 0.2)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 28px rgba(168, 230, 207, 0.25), inset 0 1px 0 rgba(168, 230, 207, 0.3)',
                                borderColor: 'rgba(168, 230, 207, 0.4)',
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Średnie oszczędności
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#a8e6cf20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#a8e6cf',
                                    }}
                                >
                                    <SavingsIcon />
                                </Box>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: 'text.primary',
                                    textShadow: '0 0 20px #a8e6cf60, 0 0 40px #a8e6cf40'
                                }}
                            >
                                {statistics.averageSavings.toFixed(0)} zł
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: statistics.savingsChange > 0 ? '#4caf50' : '#ff6b9d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {statistics.savingsChange > 0 ? '↑' : '↓'} {Math.abs(statistics.savingsChange)}% od poprzedniego okresu
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Savings Rate */}
                <Box sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.08), rgba(199, 125, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(199, 125, 255, 0.3)',
                            boxShadow: '0 4px 12px rgba(199, 125, 255, 0.15), inset 0 1px 0 rgba(199, 125, 255, 0.2)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 28px rgba(199, 125, 255, 0.25), inset 0 1px 0 rgba(199, 125, 255, 0.3)',
                                borderColor: 'rgba(199, 125, 255, 0.4)',
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Stopa oszczędności
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#c77dff20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#c77dff',
                                    }}
                                >
                                    <PercentIcon />
                                </Box>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: 'text.primary',
                                    textShadow: '0 0 20px #c77dff60, 0 0 40px #c77dff40'
                                }}
                            >
                                {statistics.savingsRate.toFixed(0)}%
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: statistics.savingsRateChange > 0 ? '#4caf50' : '#ff6b9d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {statistics.savingsRateChange > 0 ? '↑' : '↓'} {Math.abs(statistics.savingsRateChange)}% od poprzedniego okresu
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Savings Growth Chart */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                        Wzrost oszczędności
                    </Typography>
                    {savingsGrowthData.length === 0 ? (
                        <Box sx={{
                            width: '100%',
                            height: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                                📈
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                                Brak danych do wyświetlenia
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Dane pojawią się po dodaniu transakcji
                            </Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={savingsGrowthData}>
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="savings"
                                    stroke="#00f0ff"
                                    strokeWidth={2}
                                    fill="url(#colorSavings)"
                                    name="Oszczędności"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Income vs Expenses Chart */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                        Przychody vs Wydatki
                    </Typography>
                    {incomeVsExpensesData.length === 0 ? (
                        <Box sx={{
                            width: '100%',
                            height: 300,
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
                                Dane pojawią się po dodaniu transakcji
                            </Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={incomeVsExpensesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#00f0ff"
                                    strokeWidth={2}
                                    name="Przychody"
                                    dot={{ fill: '#00f0ff', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#ff6b9d"
                                    strokeWidth={2}
                                    name="Wydatki"
                                    dot={{ fill: '#ff6b9d', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="savings"
                                    stroke="#a8e6cf"
                                    strokeWidth={2}
                                    name="Oszczędności"
                                    dot={{ fill: '#a8e6cf', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Row: Pie Chart and Bar Chart */}
            <Box sx={{
                display: 'flex',
                gap: 3,
                width: '100%',
                flexWrap: 'wrap',
                mb: 3,
            }}>
                {/* Expenses by Category - Pie Chart */}
                <Box sx={{
                    flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'none',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                                Wydatki według kategorii
                            </Typography>
                            {expensesByCategoryData.length === 0 ? (
                                <Box sx={{
                                    width: '100%',
                                    height: 350,
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
                                <Box sx={{ width: '100%', height: 350 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expensesByCategoryData}
                                                cx="50%"
                                                cy="48%"
                                                innerRadius={70}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {expensesByCategoryData.map((entry, index) => (
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

                {/* Weekly Expenses - Bar Chart */}
                <Box sx={{
                    flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'none',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Wydatki tygodniowe
                                </Typography>
                                {weeklyExpensesData.length > 0 && (
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Średnia dzienna
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#00f0ff', fontWeight: 600 }}>
                                            {dailyAverage.toFixed(0)} zł
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            {weeklyExpensesData.length === 0 ? (
                                <Box sx={{
                                    width: '100%',
                                    height: 300,
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
                                        Dane pojawią się po dodaniu wydatków
                                    </Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklyExpensesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                        <XAxis dataKey="week" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="amount" fill="#00f0ff" name="Wydatki" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AnalizySection;
