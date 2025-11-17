// src/components/dashboard/BudzetSection.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getIncome, createIncome, updateIncome, deleteIncome, getBudgetSummary } from '../../api/budget';

const BudzetSection = () => {
    // Data states
    const [incomes, setIncomes] = useState([]);
    const [budgetSummary, setBudgetSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
    });

    // UI states
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [incomeToDelete, setIncomeToDelete] = useState(null);

    // Loading and notification states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form states for new/edit income
    const [incomeForm, setIncomeForm] = useState({
        name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    // Fetch data on mount and when month changes
    useEffect(() => {
        if (selectedMonth) {
            fetchIncomes();
            fetchBudgetSummary();
        }
    }, [selectedMonth]);

    // API functions
    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const data = await getIncome(selectedMonth);
            setIncomes(data.incomes || []);
        } catch (err) {
            console.error('Error fetching incomes:', err);
            showSnackbar('Nie udało się pobrać przychodów', 'error');
            setIncomes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBudgetSummary = async () => {
        try {
            const data = await getBudgetSummary(selectedMonth);
            setBudgetSummary({
                totalIncome: data.totalIncome || 0,
                totalExpenses: data.totalExpenses || 0,
                balance: data.balance || 0,
            });
        } catch (err) {
            console.error('Error fetching budget summary:', err);
            showSnackbar('Nie udało się pobrać podsumowania budżetu', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Calculate total income from list
    const totalIncome = useMemo(() => {
        return incomes.reduce((sum, income) => sum + income.amount, 0);
    }, [incomes]);

    // Handle add income
    const handleAddIncome = () => {
        setEditingIncome(null);
        setIncomeForm({
            name: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
        });
        setOpenIncomeDialog(true);
    };

    // Handle edit income
    const handleEditIncome = (income) => {
        setEditingIncome(income);
        setIncomeForm({
            name: income.name,
            amount: income.amount,
            date: income.date.split('T')[0], // Convert ISO string to YYYY-MM-DD format
            description: income.description || '',
        });
        setOpenIncomeDialog(true);
    };

    // Handle save income
    const handleSaveIncome = async () => {
        try {
            setSaving(true);
            const incomeData = {
                name: incomeForm.name,
                amount: parseFloat(incomeForm.amount),
                date: incomeForm.date,
                description: incomeForm.description,
            };

            if (editingIncome) {
                // Update existing
                await updateIncome(editingIncome.id, incomeData);
                showSnackbar('Przychód został zaktualizowany', 'success');
            } else {
                // Add new
                await createIncome(incomeData);
                showSnackbar('Przychód został dodany', 'success');
            }

            setOpenIncomeDialog(false);
            fetchIncomes(); // Refresh list
            fetchBudgetSummary(); // Refresh summary
        } catch (err) {
            console.error('Error saving income:', err);
            showSnackbar(err.message || 'Nie udało się zapisać przychodu', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Handle delete income - open confirmation dialog
    const handleDeleteIncome = (income) => {
        setIncomeToDelete(income);
        setOpenDeleteDialog(true);
    };

    // Confirm delete income
    const confirmDeleteIncome = async () => {
        if (!incomeToDelete) return;

        try {
            await deleteIncome(incomeToDelete.id);
            showSnackbar('Przychód został usunięty', 'success');
            setOpenDeleteDialog(false);
            setIncomeToDelete(null);
            fetchIncomes(); // Refresh list
            fetchBudgetSummary(); // Refresh summary
        } catch (err) {
            console.error('Error deleting income:', err);
            showSnackbar(err.message || 'Nie udało się usunąć przychodu', 'error');
        }
    };

    // Handle month change from DatePicker
    const handleMonthChange = (newValue) => {
        if (newValue) {
            const formattedMonth = newValue.format('YYYY-MM');
            setSelectedMonth(formattedMonth);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Zarządzaj swoim budżetem i przychodami
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddIncome}
                    sx={{
                        background: 'linear-gradient(135deg, rgba(168, 230, 207, 0.3), rgba(168, 230, 207, 0.2))',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(168, 230, 207, 0.5)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(168, 230, 207, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textShadow: '0 0 10px rgba(168, 230, 207, 0.5)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, rgba(168, 230, 207, 0.3), rgba(168, 230, 207, 0.2))',
                            boxShadow: '0 0 12px 3px rgba(168, 230, 207, 0.2)',
                            transform: 'none',
                        },
                    }}
                >
                    Dodaj przychód
                </Button>
            </Box>

            {/* Budget Summary Cards */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                width: '100%',
                flexWrap: 'wrap'
            }}>
                {/* Current Balance */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(33.333% - 11px)' },
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
                                    Aktualne saldo
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#00b8d420',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#00b8d4',
                                    }}
                                >
                                    <AttachMoneyIcon />
                                </Box>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: 'text.primary',
                                    textShadow: '0 0 20px #00b8d460, 0 0 40px #00b8d440'
                                }}
                            >
                                {budgetSummary.balance.toFixed(2).replace('.', ',')} zł
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Total Income */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(33.333% - 11px)' },
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
                                    Przychody (mies.)
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#66bb6a20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#66bb6a',
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
                                    textShadow: '0 0 20px #66bb6a60, 0 0 40px #66bb6a40'
                                }}
                            >
                                {budgetSummary.totalIncome.toFixed(2).replace('.', ',')} zł
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Total Expenses */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(33.333% - 11px)' },
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
                                    Wydatki (miesiąc)
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
                                    <AccountBalanceWalletIcon />
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
                                {budgetSummary.totalExpenses.toFixed(2).replace('.', ',')} zł
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Month Selector */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            Lista przychodów
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                            <DatePicker
                                label="Miesiąc"
                                views={['month', 'year']}
                                value={dayjs(selectedMonth + '-01')}
                                onChange={handleMonthChange}
                                maxDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        sx: { minWidth: 200 }
                                    },
                                    popper: {
                                        sx: {
                                            '& .MuiPaper-root': {
                                                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))',
                                                backdropFilter: 'blur(20px)',
                                                WebkitBackdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                color: '#ffffff',
                                            },
                                            '& .MuiPickersCalendarHeader-label': {
                                                color: '#ffffff',
                                            },
                                            '& .MuiPickersMonth-monthButton': {
                                                color: '#ffffff',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(168, 230, 207, 0.2)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#66bb6a',
                                                    color: '#000000',
                                                    '&:hover': {
                                                        backgroundColor: '#84dcc6',
                                                    },
                                                },
                                            },
                                            '& .MuiPickersYear-yearButton': {
                                                color: '#ffffff',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(168, 230, 207, 0.2)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#66bb6a',
                                                    color: '#000000',
                                                    '&:hover': {
                                                        backgroundColor: '#84dcc6',
                                                    },
                                                },
                                            },
                                            '& .MuiIconButton-root': {
                                                color: '#ffffff',
                                            },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </CardContent>
            </Card>

            {/* Incomes Table */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Nazwa</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Data</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Opis</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Kwota</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: 'text.primary' }}>Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : incomes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                            Brak przychodów do wyświetlenia
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                incomes.map((income) => (
                                    <TableRow key={income.id} hover>
                                        <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{income.name}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {new Date(income.date).toLocaleDateString('pl-PL')}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary', maxWidth: 250 }}>
                                            {income.description || '-'}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#66bb6a', fontWeight: 700, fontSize: '1.1rem' }}>
                                            {income.amount.toFixed(2).replace('.', ',')} zł
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditIncome(income)}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteIncome(income)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Dialog - Add/Edit Income */}
            <Dialog
                open={openIncomeDialog}
                onClose={() => setOpenIncomeDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }
                }}
            >
                <DialogTitle>
                    {editingIncome ? 'Edytuj przychód' : 'Dodaj przychód'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Nazwa przychodu"
                            value={incomeForm.name}
                            onChange={(e) => setIncomeForm({ ...incomeForm, name: e.target.value })}
                            fullWidth
                            required
                            placeholder="np. Wynagrodzenie"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                            <DatePicker
                                label="Data"
                                value={dayjs(incomeForm.date)}
                                onChange={(newValue) => setIncomeForm({ ...incomeForm, date: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                    },
                                    popper: {
                                        sx: {
                                            '& .MuiPaper-root': {
                                                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))',
                                                backdropFilter: 'blur(20px)',
                                                WebkitBackdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                color: '#ffffff',
                                            },
                                            '& .MuiPickersCalendarHeader-label': {
                                                color: '#ffffff',
                                            },
                                            '& .MuiPickersDay-root': {
                                                color: '#ffffff',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(168, 230, 207, 0.2)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#66bb6a',
                                                    color: '#000000',
                                                    '&:hover': {
                                                        backgroundColor: '#84dcc6',
                                                    },
                                                },
                                            },
                                            '& .MuiPickersDay-today': {
                                                border: '1px solid #66bb6a',
                                            },
                                            '& .MuiDayCalendar-weekDayLabel': {
                                                color: 'rgba(255, 255, 255, 0.7)',
                                            },
                                            '& .MuiIconButton-root': {
                                                color: '#ffffff',
                                            },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Kwota"
                            type="number"
                            value={incomeForm.amount}
                            onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                            fullWidth
                            required
                            inputProps={{ step: '0.01', min: '0' }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Opis (opcjonalnie)"
                            value={incomeForm.description}
                            onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Dodatkowe informacje o przychodzie"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenIncomeDialog(false)}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleSaveIncome}
                        variant="contained"
                        disabled={!incomeForm.name || !incomeForm.amount || saving}
                        sx={{
                            '&:hover': {
                                transform: 'none',
                                boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                            },
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : (editingIncome ? 'Zapisz' : 'Dodaj')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog - Delete Confirmation */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }
                }}
            >
                <DialogTitle sx={{ color: 'text.primary' }}>
                    Potwierdź usunięcie
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'text.secondary' }}>
                        Czy na pewno chcesz usunąć przychód "{incomeToDelete?.name}"?
                        <br />
                        Ta operacja jest nieodwracalna.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={confirmDeleteIncome}
                        variant="contained"
                        sx={{
                            backgroundColor: '#f44336',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                                transform: 'none',
                                boxShadow: '0 0 12px 3px rgba(244, 67, 54, 0.2)',
                            },
                        }}
                    >
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>

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

export default BudzetSection;
