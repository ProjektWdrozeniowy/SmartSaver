// src/components/dashboard/WydatkiSection.jsx
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
    Chip,
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
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../../api/expenses';
import { getCategories, createCategory } from '../../api/categories';

const WydatkiSection = () => {
    // Available icons for categories
    const availableIcons = [
        '🍕', '🛒', '🚗', '⚡', '🎬', '🏠', '🏥', '👕',
        '🎓', '💼', '🎮', '📱', '✈️', '🎁', '💇', '☕',
        '🎵', '📚', '🐕', '💊', '🚌', '🍺', '🏋️', '🎨'
    ];

    // Data states
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // UI states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpenseId, setDeletingExpenseId] = useState(null);

    // Loading and notification states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form states for new/edit expense
    const [expenseForm, setExpenseForm] = useState({
        name: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
    });

    // Form state for new category
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        color: '#ff6b9d',
        icon: '🍕',
    });

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch expenses when month changes
    useEffect(() => {
        if (selectedMonth) {
            fetchExpenses();
        }
    }, [selectedMonth]);

    // API functions
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data.categories || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            showSnackbar('Nie udało się pobrać kategorii', 'error');
        }
    };

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await getExpenses(selectedMonth);
            setExpenses(data.expenses || []);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            showSnackbar('Nie udało się pobrać wydatków', 'error');
            setExpenses([]);
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

    // Filter expenses
    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            const matchesSearch = expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expense.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || expense.categoryId === parseInt(selectedCategory);
            const matchesMonth = expense.date.startsWith(selectedMonth);
            return matchesSearch && matchesCategory && matchesMonth;
        });
    }, [expenses, searchQuery, selectedCategory, selectedMonth]);

    // Calculate total
    const totalExpenses = useMemo(() => {
        return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, [filteredExpenses]);

    // Get category by id
    const getCategoryById = (id) => categories.find(cat => cat.id === id);

    // Handle add expense
    const handleAddExpense = () => {
        setEditingExpense(null);
        setExpenseForm({
            name: '',
            categoryId: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: '',
        });
        setOpenExpenseDialog(true);
    };

    // Handle edit expense
    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setExpenseForm({
            name: expense.name,
            categoryId: expense.categoryId,
            date: expense.date,
            description: expense.description,
            amount: expense.amount,
        });
        setOpenExpenseDialog(true);
    };

    // Handle save expense
    const handleSaveExpense = async () => {
        try {
            setSaving(true);
            const expenseData = {
                name: expenseForm.name,
                categoryId: parseInt(expenseForm.categoryId),
                date: expenseForm.date,
                amount: parseFloat(expenseForm.amount),
                description: expenseForm.description,
            };

            if (editingExpense) {
                // Update existing
                await updateExpense(editingExpense.id, expenseData);
                showSnackbar('Wydatek został zaktualizowany', 'success');
            } else {
                // Add new
                await createExpense(expenseData);
                showSnackbar('Wydatek został dodany', 'success');
            }

            setOpenExpenseDialog(false);
            fetchExpenses(); // Refresh list
        } catch (err) {
            console.error('Error saving expense:', err);
            showSnackbar(err.message || 'Nie udało się zapisać wydatku', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Handle delete expense - open dialog
    const handleDeleteExpense = (id) => {
        setDeletingExpenseId(id);
        setOpenDeleteDialog(true);
    };

    // Confirm delete expense
    const confirmDeleteExpense = async () => {
        try {
            setSaving(true);
            await deleteExpense(deletingExpenseId);
            showSnackbar('Wydatek został usunięty', 'success');
            setOpenDeleteDialog(false);
            fetchExpenses(); // Refresh list
        } catch (err) {
            console.error('Error deleting expense:', err);
            showSnackbar(err.message || 'Nie udało się usunąć wydatku', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Handle add category
    const handleAddCategory = () => {
        setCategoryForm({ name: '', color: '#ff6b9d', icon: '🍕' });
        setOpenCategoryDialog(true);
    };

    // Handle save category
    const handleSaveCategory = async () => {
        try {
            setSaving(true);
            await createCategory(categoryForm);
            showSnackbar('Kategoria została dodana', 'success');
            setOpenCategoryDialog(false);
            fetchCategories(); // Refresh list
        } catch (err) {
            console.error('Error saving category:', err);
            showSnackbar(err.message || 'Nie udało się dodać kategorii', 'error');
        } finally {
            setSaving(false);
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
                <Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Zarządzaj swoimi wydatkami
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<CategoryIcon />}
                        onClick={handleAddCategory}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(255, 107, 157, 0.05))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            borderColor: 'rgba(255, 107, 157, 0.4)',
                            color: '#ff6b9d',
                            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.2), inset 0 1px 0 rgba(255, 107, 157, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.25), rgba(255, 107, 157, 0.15))',
                                borderColor: 'rgba(255, 107, 157, 0.6)',
                                boxShadow: '0 6px 16px rgba(255, 107, 157, 0.3), inset 0 1px 0 rgba(255, 107, 157, 0.3)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Dodaj kategorię
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddExpense}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(255, 107, 157, 0.2))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 107, 157, 0.5)',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            textShadow: '0 0 10px rgba(255, 107, 157, 0.5)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.4), rgba(255, 107, 157, 0.3))',
                                boxShadow: '0 6px 16px rgba(255, 107, 157, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Dodaj wydatek
                    </Button>
                </Box>
            </Box>

            {/* Summary and Filters Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Summary Card - 50% width */}
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        flex: '1 1 50%',
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
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                    Suma wydatków
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff6b9d' }}>
                                    {totalExpenses.toFixed(2)} zł
                                </Typography>
                            </Box>
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
                                                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#ff6b9d',
                                                        color: '#000000',
                                                        '&:hover': {
                                                            backgroundColor: '#ff5c8d',
                                                        },
                                                    },
                                                },
                                                '& .MuiPickersYear-yearButton': {
                                                    color: '#ffffff',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#ff6b9d',
                                                        color: '#000000',
                                                        '&:hover': {
                                                            backgroundColor: '#ff5c8d',
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

                {/* Filters Card - 50% width */}
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        flex: '1 1 50%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                        },
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="Szukaj wydatków..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ flex: 1, minWidth: 200 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl sx={{ minWidth: 180, flex: 1 }}>
                                <InputLabel>Kategoria</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    label="Kategoria"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                                    <MenuItem value="all">Wszystkie</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Expenses Table */}
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
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Kategoria</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Data</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Opis</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Kwota</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: 'text.primary' }}>Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredExpenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                            Brak wydatków do wyświetlenia
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredExpenses.map((expense) => {
                                    const category = getCategoryById(expense.categoryId);
                                    return (
                                        <TableRow key={expense.id} hover>
                                            <TableCell sx={{ color: 'text.primary' }}>{expense.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={
                                                        <Box sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                                                            {category?.icon}
                                                        </Box>
                                                    }
                                                    label={category?.name}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${category?.color}20`,
                                                        color: category?.color,
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {new Date(expense.date).toLocaleDateString('pl-PL')}
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', maxWidth: 200 }}>
                                                {expense.description || '-'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                                {expense.amount.toFixed(2)} zł
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditExpense(expense)}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                    sx={{ color: 'error.main' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Dialog - Add/Edit Expense */}
            <Dialog
                open={openExpenseDialog}
                onClose={() => setOpenExpenseDialog(false)}
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
                    {editingExpense ? 'Edytuj wydatek' : 'Dodaj wydatek'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Nazwa wydatku"
                            value={expenseForm.name}
                            onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Kategoria</InputLabel>
                            <Select
                                value={expenseForm.categoryId}
                                label="Kategoria"
                                onChange={(e) => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}
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
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                            <DatePicker
                                label="Data"
                                value={dayjs(expenseForm.date)}
                                onChange={(newValue) => setExpenseForm({ ...expenseForm, date: newValue ? newValue.format('YYYY-MM-DD') : '' })}
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
                                                    backgroundColor: 'rgba(255, 107, 157, 0.2)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#ff6b9d',
                                                    '&:hover': {
                                                        backgroundColor: '#ff5c8d',
                                                    },
                                                },
                                            },
                                            '& .MuiPickersDay-today': {
                                                border: '1px solid #ff6b9d',
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
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                            fullWidth
                            required
                            inputProps={{ step: '0.01', min: '0' }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Opis (opcjonalnie)"
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExpenseDialog(false)}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleSaveExpense}
                        variant="contained"
                        disabled={!expenseForm.name || !expenseForm.categoryId || !expenseForm.amount || saving}
                    >
                        {saving ? <CircularProgress size={24} /> : (editingExpense ? 'Zapisz' : 'Dodaj')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog - Add Category */}
            <Dialog
                open={openCategoryDialog}
                onClose={() => setOpenCategoryDialog(false)}
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
                <DialogTitle>Dodaj kategorię</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Nazwa kategorii"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                Ikona kategorii
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', maxHeight: 200, overflowY: 'auto', p: 1 }}>
                                {availableIcons.map((icon) => (
                                    <Box
                                        key={icon}
                                        onClick={() => setCategoryForm({ ...categoryForm, icon })}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            backgroundColor: categoryForm.icon === icon ? `${categoryForm.color}20` : 'rgba(255, 255, 255, 0.05)',
                                            border: categoryForm.icon === icon ? `2px solid ${categoryForm.color}` : '2px solid transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                backgroundColor: `${categoryForm.color}15`,
                                            },
                                        }}
                                    >
                                        {icon}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                Kolor kategorii
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {['#ff6b9d', '#00f0ff', '#a8e6cf', '#ffd93d', '#c77dff', '#ff9a76', '#84dcc6'].map((color) => (
                                    <Box
                                        key={color}
                                        onClick={() => setCategoryForm({ ...categoryForm, color })}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            cursor: 'pointer',
                                            border: categoryForm.color === color ? '3px solid white' : 'none',
                                            boxShadow: categoryForm.color === color ? '0 0 0 2px ' + color : 'none',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCategoryDialog(false)}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleSaveCategory}
                        variant="contained"
                        disabled={!categoryForm.name || saving}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Dodaj'}
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
                <DialogTitle>Usuń wydatek</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: 'text.secondary', pt: 2 }}>
                        Czy na pewno chcesz usunąć ten wydatek? Ta operacja jest nieodwracalna.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        disabled={saving}
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={confirmDeleteExpense}
                        variant="contained"
                        disabled={saving}
                        sx={{
                            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                            },
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Usuń'}
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

export default WydatkiSection;
