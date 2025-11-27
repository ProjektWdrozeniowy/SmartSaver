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
    Checkbox,
    Switch,
    FormControlLabel,
    Grid,
    useMediaQuery,
    useTheme,
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
import { useThemeMode } from '../../context/ThemeContext';

const WydatkiSection = ({ onExpenseChange, tutorialData = {} }) => {
    const { mode } = useThemeMode();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    const [expenseToDelete, setExpenseToDelete] = useState(null);

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
        isRecurring: false,
        recurringInterval: 1,
        recurringUnit: 'month',
        recurringEndDate: '',
        hasEndDate: false,
    });

    // Form state for new category
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        color: '#ef5350',
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

    // Handle tutorial
    useEffect(() => {
        if (tutorialData.showExpense) {
            // Open expense dialog for tutorial
            setOpenExpenseDialog(true);
            // Set default form with tutorial data
            setExpenseForm({
                name: 'Zakupy spożywcze',
                categoryId: categories.length > 0 ? categories[0].id : '',
                date: new Date().toISOString().split('T')[0],
                description: 'Przykładowy wydatek na zakupy',
                amount: '150.00',
                isRecurring: false,
                recurringInterval: 1,
                recurringUnit: 'month',
                recurringEndDate: '',
                hasEndDate: false,
            });
            // Add tutorial expense to display
            const tutorialExpense = {
                id: 'tutorial-expense',
                name: 'Zakupy spożywcze',
                amount: 150.00,
                date: new Date().toISOString(),
                category: categories.length > 0 ? categories[0] : { name: 'Jedzenie', color: '#ff6b9d', icon: '🍕' },
                categoryId: categories.length > 0 ? categories[0].id : 1,
                description: 'Przykładowy wydatek na zakupy',
                isRecurring: false,
            };
            setExpenses([tutorialExpense]);
        }
    }, [tutorialData.showExpense, categories]);

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
                (expense.description && expense.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || expense.categoryId === parseInt(selectedCategory);
            const matchesMonth = expense.date.startsWith(selectedMonth);
            return matchesSearch && matchesCategory && matchesMonth;
        });
    }, [expenses, searchQuery, selectedCategory, selectedMonth]);

    // Calculate total
    const totalExpenses = useMemo(() => {
        return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, [filteredExpenses]);

    // Get category by id (prefer category from expense object, fallback to categories list)
    const getCategoryById = (expense) => {
        // If expense has category object, use it (includes system categories)
        if (expense.category) {
            return expense.category;
        }
        // Fallback to finding in categories list
        return categories.find(cat => cat.id === expense.categoryId);
    };

    // Handle add expense
    const handleAddExpense = () => {
        setEditingExpense(null);
        setExpenseForm({
            name: '',
            categoryId: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: '',
            isRecurring: false,
            recurringInterval: 1,
            recurringUnit: 'month',
            recurringEndDate: '',
            hasEndDate: false,
        });
        setOpenExpenseDialog(true);
    };

    // Handle edit expense
    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setExpenseForm({
            name: expense.name,
            categoryId: expense.categoryId,
            date: expense.date.split('T')[0], // Convert ISO string to YYYY-MM-DD format
            description: expense.description || '',
            amount: expense.amount,
            isRecurring: expense.isRecurring || false,
            recurringInterval: expense.recurringInterval || 1,
            recurringUnit: expense.recurringUnit || 'month',
            recurringEndDate: expense.recurringEndDate ? expense.recurringEndDate.split('T')[0] : '',
            hasEndDate: expense.recurringEndDate ? true : false,
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
                isRecurring: expenseForm.isRecurring,
                recurringInterval: expenseForm.isRecurring ? parseInt(expenseForm.recurringInterval) : null,
                recurringUnit: expenseForm.isRecurring ? expenseForm.recurringUnit : null,
                recurringEndDate: expenseForm.isRecurring && expenseForm.hasEndDate ? expenseForm.recurringEndDate : null,
            };

            if (editingExpense) {
                // Update existing
                await updateExpense(editingExpense.id, expenseData);
                showSnackbar('Wydatek został zaktualizowany', 'success');
                // Refresh notification count as update might change budget status
                if (onExpenseChange) onExpenseChange();
            } else {
                // Add new
                await createExpense(expenseData);
                showSnackbar('Wydatek został dodany', 'success');
                // Refresh notification count if expense might trigger budget alert
                if (onExpenseChange) onExpenseChange();
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
    const handleDeleteExpense = (expense) => {
        setExpenseToDelete(expense);
        setOpenDeleteDialog(true);
    };

    // Confirm delete expense
    const confirmDeleteExpense = async () => {
        if (!expenseToDelete) return;

        try {
            setSaving(true);
            await deleteExpense(expenseToDelete.id);
            showSnackbar('Wydatek został usunięty', 'success');
            setOpenDeleteDialog(false);
            setExpenseToDelete(null);
            fetchExpenses(); // Refresh list
            // Refresh notification count as deletion might change budget status
            if (onExpenseChange) onExpenseChange();
        } catch (err) {
            console.error('Error deleting expense:', err);
            showSnackbar(err.message || 'Nie udało się usunąć wydatku', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Handle add category
    const handleAddCategory = () => {
        setCategoryForm({ name: '', color: '#ef5350', icon: '🍕' });
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
        <Box sx={{ width: '100%' }} data-tour="wydatki-section">
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
                            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(255, 107, 157, 0.08))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            borderColor: 'rgba(255, 107, 157, 0.5)',
                            color: '#FF6B9D',
                            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.25), inset 0 1px 0 rgba(255, 107, 157, 0.25)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(255, 107, 157, 0.08))',
                                borderColor: 'rgba(255, 107, 157, 0.5)',
                                color: '#FF6B9D',
                                boxShadow: '0 0 12px 3px rgba(255, 107, 157, 0.2)',
                                transform: 'none',
                            },
                        }}
                    >
                        Dodaj kategorię
                    </Button>
                    <Button
                        data-tour="add-expense-button"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddExpense}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.35), rgba(255, 107, 157, 0.25))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 107, 157, 0.5)',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            textShadow: '0 0 10px rgba(255, 107, 157, 0.5)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.35), rgba(255, 107, 157, 0.25))',
                                boxShadow: '0 0 12px 3px rgba(255, 107, 157, 0.2)',
                                transform: 'none',
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
                    <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, width: '100%' }}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                    Suma wydatków
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF6B9D' }}>
                                    {totalExpenses.toFixed(2).replace('.', ',')} zł
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
                                            size: 'medium',
                                            sx: { minWidth: 200 }
                                        },
                                        popper: {
                                            sx: {
                                                '& .MuiPaper-root': {
                                                    background: mode === 'dark'
                                                        ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                                                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                                                    backdropFilter: 'blur(20px)',
                                                    WebkitBackdropFilter: 'blur(20px)',
                                                    border: '1px solid',
                                                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                                                    boxShadow: mode === 'dark'
                                                        ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                                        : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                                                },
                                                '& .MuiPickersCalendarHeader-root': {
                                                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                },
                                                '& .MuiPickersCalendarHeader-label': {
                                                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                },
                                                '& .MuiPickersMonth-monthButton': {
                                                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#FF6B9D',
                                                        color: '#000000',
                                                        '&:hover': {
                                                            backgroundColor: '#ff5c8d',
                                                        },
                                                    },
                                                },
                                                '& .MuiPickersYear-yearButton': {
                                                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#FF6B9D',
                                                        color: '#000000',
                                                        '&:hover': {
                                                            backgroundColor: '#ff5c8d',
                                                        },
                                                    },
                                                },
                                                '& .MuiIconButton-root': {
                                                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
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
                    <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                            <TextField
                                placeholder="Szukaj wydatków..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ flex: 1, minWidth: 200 }}
                                size="medium"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl sx={{ minWidth: 180, flex: 1 }} size="medium">
                                <InputLabel>Kategoria</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    label="Kategoria"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                background: mode === 'dark'
                                                    ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                                                backdropFilter: 'blur(20px)',
                                                WebkitBackdropFilter: 'blur(20px)',
                                                border: '1px solid',
                                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                                                boxShadow: mode === 'dark'
                                                    ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                                    : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
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
                {isMobile ? (
                    // Mobile Card Layout
                    <Box sx={{ p: 2 }}>
                        {filteredExpenses.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Brak wydatków do wyświetlenia
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {filteredExpenses.map((expense, index) => {
                                    const category = getCategoryById(expense);
                                    return (
                                        <Card
                                            key={expense.id}
                                            data-tour={index === 0 ? 'expense-item' : undefined}
                                            sx={{
                                                background: mode === 'dark'
                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
                                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.9))',
                                                backdropFilter: 'blur(10px)',
                                                WebkitBackdropFilter: 'blur(10px)',
                                                border: '1px solid',
                                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                                                boxShadow: mode === 'dark'
                                                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: mode === 'dark'
                                                        ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                                                        : '0 4px 12px rgba(0, 0, 0, 0.12)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
                                                            {expense.name}
                                                        </Typography>
                                                        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
                                                            {expense.amount.toFixed(2).replace('.', ',')} zł
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditExpense(expense)}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteExpense(expense)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: '60px' }}>
                                                            📅 Data:
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                            {new Date(expense.date).toLocaleDateString('pl-PL')}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: '60px' }}>
                                                            🏷️ Kategoria:
                                                        </Typography>
                                                        <Chip
                                                            icon={
                                                                <Box sx={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
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
                                                    </Box>
                                                    {expense.description && (
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: '60px' }}>
                                                                📝 Opis:
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                                                {expense.description}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                ) : (
                    // Desktop Table Layout
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
                                    filteredExpenses.map((expense, index) => {
                                        const category = getCategoryById(expense);
                                        return (
                                            <TableRow key={expense.id} hover data-tour={index === 0 ? 'expense-item' : undefined}>
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
                                                    {expense.amount.toFixed(2).replace('.', ',')} zł
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
                                                        onClick={() => handleDeleteExpense(expense)}
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
                )}
            </Card>

            {/* Dialog - Add/Edit Expense */}
            <Dialog
                open={openExpenseDialog}
                onClose={() => setOpenExpenseDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                        boxShadow: mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    },
                    'data-tour': 'expense-dialog'
                }}
            >
                <DialogTitle>
                    {editingExpense ? 'Edytuj wydatek' : 'Dodaj wydatek'}
                </DialogTitle>
                <DialogContent
                    sx={{
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '10px',
                            '&:hover': {
                                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                            },
                        },
                    }}
                >
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
                                            background: mode === 'dark'
                                                ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)',
                                            border: '1px solid',
                                            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                                            boxShadow: mode === 'dark'
                                                ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                                : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
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
                                                background: mode === 'dark'
                                                    ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                                                backdropFilter: 'blur(20px)',
                                                WebkitBackdropFilter: 'blur(20px)',
                                                border: '1px solid',
                                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                                                boxShadow: mode === 'dark'
                                                    ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                                    : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                            },
                                            '& .MuiPickersCalendarHeader-label': {
                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                            },
                                            '& .MuiPickersDay-root': {
                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
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
                                                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                            },
                                            '& .MuiIconButton-root': {
                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
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
                            sx={{
                                '& input[type=number]': {
                                    MozAppearance: 'textfield',
                                },
                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
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

                        {/* Recurring Expense Section */}
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={expenseForm.isRecurring}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, isRecurring: e.target.checked })}
                                        sx={{
                                            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                            '&.Mui-checked': {
                                                color: '#66bb6a',
                                            },
                                        }}
                                    />
                                }
                                label="Wydatek cykliczny"
                            />

                            {expenseForm.isRecurring && (
                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Powtarzaj co"
                                                type="number"
                                                value={expenseForm.recurringInterval}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, recurringInterval: parseInt(e.target.value) || 1 })}
                                                fullWidth
                                                inputProps={{ min: 1 }}
                                                sx={{
                                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                                        WebkitAppearance: 'auto',
                                                        filter: mode === 'dark' ? 'invert(1)' : 'none',
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Jednostka</InputLabel>
                                                <Select
                                                    value={expenseForm.recurringUnit}
                                                    label="Jednostka"
                                                    onChange={(e) => setExpenseForm({ ...expenseForm, recurringUnit: e.target.value })}
                                                >
                                                    <MenuItem value="day">dzień</MenuItem>
                                                    <MenuItem value="week">tydzień</MenuItem>
                                                    <MenuItem value="month">miesiąc</MenuItem>
                                                    <MenuItem value="year">rok</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!expenseForm.hasEndDate}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, hasEndDate: !e.target.checked })}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#66bb6a',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#66bb6a',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Do odwołania"
                                    />

                                    {expenseForm.hasEndDate && (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                                            <DatePicker
                                                label="Data zakończenia"
                                                value={expenseForm.recurringEndDate ? dayjs(expenseForm.recurringEndDate) : null}
                                                onChange={(newValue) => setExpenseForm({ ...expenseForm, recurringEndDate: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                                                minDate={dayjs(expenseForm.date).add(1, 'day')}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                    },
                                                    popper: {
                                                        sx: {
                                                            '& .MuiPaper-root': {
                                                                background: mode === 'dark'
                                                                    ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                                                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                                                                backdropFilter: 'blur(20px)',
                                                                WebkitBackdropFilter: 'blur(20px)',
                                                                border: '1px solid',
                                                                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                                                                boxShadow: mode === 'dark'
                                                                    ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                                                    : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                                                            },
                                                            '& .MuiPickersCalendarHeader-root': {
                                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                            },
                                                            '& .MuiPickersCalendarHeader-label': {
                                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                            },
                                                            '& .MuiPickersDay-root': {
                                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
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
                                                                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                                            },
                                                            '& .MuiIconButton-root': {
                                                                color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    )}
                                </Box>
                            )}
                        </Box>
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
                        sx={{
                            '&:hover': {
                                transform: 'none',
                                boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                            },
                        }}
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
                        background: mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                        boxShadow: mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
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
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 1 }}>
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
                        sx={{
                            '&:hover': {
                                transform: 'none',
                                boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                            },
                        }}
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
                        background: mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                        boxShadow: mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    }
                }}
            >
                <DialogTitle sx={{ color: 'text.primary' }}>
                    Potwierdź usunięcie
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'text.secondary' }}>
                        Czy na pewno chcesz usunąć wydatek "{expenseToDelete?.name}"?
                        <br />
                        Ta operacja jest nieodwracalna.
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
                            backgroundColor: '#f44336',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                                transform: 'none',
                                boxShadow: '0 0 12px 3px rgba(244, 67, 54, 0.2)',
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default WydatkiSection;
