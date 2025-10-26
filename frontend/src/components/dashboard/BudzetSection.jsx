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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import { getIncome, createIncome, updateIncome, deleteIncome, getBudgetSummary } from '../../api/budget';

const BudzetSection = () => {
    // Data states
    const [incomes, setIncomes] = useState([]);
    const [budgetSummary, setBudgetSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        savings: 0,
    });

    // UI states
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);

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
                savings: data.savings || 0,
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
            date: income.date,
            description: income.description,
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

    // Handle delete income
    const handleDeleteIncome = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten przychód?')) {
            try {
                await deleteIncome(id);
                showSnackbar('Przychód został usunięty', 'success');
                fetchIncomes(); // Refresh list
                fetchBudgetSummary(); // Refresh summary
            } catch (err) {
                console.error('Error deleting income:', err);
                showSnackbar(err.message || 'Nie udało się usunąć przychodu', 'error');
            }
        }
    };

    // Generate month options (last 12 months)
    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' });
            options.push({ value, label });
        }
        return options;
    };

    const monthOptions = generateMonthOptions();

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
                        background: 'linear-gradient(135deg, #a8e6cf 0%, #84dcc6 100%)',
                        color: '#000',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #84dcc6 0%, #5ec9b5 100%)',
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
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0, 240, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2,
                                    }}
                                >
                                    <AccountBalanceIcon sx={{ color: '#00f0ff', fontSize: 24 }} />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Aktualne saldo
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#00f0ff' }}>
                                {budgetSummary.balance.toFixed(2)} zł
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Całkowite saldo
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Total Income */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(168, 230, 207, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2,
                                    }}
                                >
                                    <TrendingUpIcon sx={{ color: '#a8e6cf', fontSize: 24 }} />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Przychody (mies.)
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#a8e6cf' }}>
                                {budgetSummary.totalIncome.toFixed(2)} zł
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Suma przychodów
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Total Expenses */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2,
                                    }}
                                >
                                    <TrendingDownIcon sx={{ color: '#ff6b9d', fontSize: 24 }} />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Wydatki (mies.)
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff6b9d' }}>
                                {budgetSummary.totalExpenses.toFixed(2)} zł
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Suma wydatków
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Savings */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255, 217, 61, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2,
                                    }}
                                >
                                    <SavingsIcon sx={{ color: '#ffd93d', fontSize: 24 }} />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Oszczędności (mies.)
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffd93d' }}>
                                {budgetSummary.savings.toFixed(2)} zł
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Różnica przychód-wydatek
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Month Selector */}
            <Card
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 3,
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            Lista przychodów
                        </Typography>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Miesiąc</InputLabel>
                            <Select
                                value={selectedMonth}
                                label="Miesiąc"
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {monthOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            {/* Incomes Table */}
            <Card
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
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
                                        <TableCell align="right" sx={{ color: '#a8e6cf', fontWeight: 700, fontSize: '1.1rem' }}>
                                            {income.amount.toFixed(2)} zł
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
                                                onClick={() => handleDeleteIncome(income.id)}
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
                        <TextField
                            label="Data"
                            type="date"
                            value={incomeForm.date}
                            onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
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
                            background: 'linear-gradient(135deg, #a8e6cf 0%, #84dcc6 100%)',
                            color: '#000',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #84dcc6 0%, #5ec9b5 100%)',
                            },
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : (editingIncome ? 'Zapisz' : 'Dodaj')}
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
