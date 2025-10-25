// src/components/dashboard/WydatkiSection.jsx
import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';

const WydatkiSection = () => {
    // Available icons for categories
    const availableIcons = [
        '🍕', '🛒', '🚗', '⚡', '🎬', '🏠', '🏥', '👕',
        '🎓', '💼', '🎮', '📱', '✈️', '🎁', '💇', '☕',
        '🎵', '📚', '🐕', '💊', '🚌', '🍺', '🏋️', '🎨'
    ];

    // Mock data - będzie zastąpione danymi z backendu
    const [categories, setCategories] = useState([
        { id: 1, name: 'Jedzenie', color: '#ff6b9d', icon: '🍕' },
        { id: 2, name: 'Transport', color: '#00f0ff', icon: '🚗' },
        { id: 3, name: 'Rozrywka', color: '#a8e6cf', icon: '🎬' },
        { id: 4, name: 'Rachunki', color: '#ffd93d', icon: '⚡' },
        { id: 5, name: 'Zakupy', color: '#c77dff', icon: '🛒' },
    ]);

    const [expenses, setExpenses] = useState([
        {
            id: 1,
            name: 'Zakupy spożywcze',
            categoryId: 1,
            date: '2025-10-23',
            description: 'Zakupy w Biedronce',
            amount: 125.50,
        },
        {
            id: 2,
            name: 'Netflix',
            categoryId: 3,
            date: '2025-10-19',
            description: 'Subskrypcja miesięczna',
            amount: 49.99,
        },
        {
            id: 3,
            name: 'Prąd',
            categoryId: 4,
            date: '2025-10-18',
            description: 'Rachunek za prąd',
            amount: 230.00,
        },
        {
            id: 4,
            name: 'Restauracja',
            categoryId: 1,
            date: '2025-10-17',
            description: '',
            amount: 89.50,
        },
        {
            id: 5,
            name: 'Benzyna',
            categoryId: 2,
            date: '2025-10-15',
            description: 'Tankowanie',
            amount: 180.00,
        },
    ]);

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('2025-10');
    const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

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
    const handleSaveExpense = () => {
        if (editingExpense) {
            // Update existing
            setExpenses(expenses.map(exp =>
                exp.id === editingExpense.id
                    ? { ...exp, ...expenseForm, categoryId: parseInt(expenseForm.categoryId), amount: parseFloat(expenseForm.amount) }
                    : exp
            ));
        } else {
            // Add new
            const newExpense = {
                id: Math.max(...expenses.map(e => e.id), 0) + 1,
                ...expenseForm,
                categoryId: parseInt(expenseForm.categoryId),
                amount: parseFloat(expenseForm.amount),
            };
            setExpenses([...expenses, newExpense]);
        }
        setOpenExpenseDialog(false);
    };

    // Handle delete expense
    const handleDeleteExpense = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten wydatek?')) {
            setExpenses(expenses.filter(exp => exp.id !== id));
        }
    };

    // Handle add category
    const handleAddCategory = () => {
        setCategoryForm({ name: '', color: '#ff6b9d', icon: '🍕' });
        setOpenCategoryDialog(true);
    };

    // Handle save category
    const handleSaveCategory = () => {
        const newCategory = {
            id: Math.max(...categories.map(c => c.id), 0) + 1,
            ...categoryForm,
        };
        setCategories([...categories, newCategory]);
        setOpenCategoryDialog(false);
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
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                borderColor: 'primary.light',
                                backgroundColor: 'rgba(0, 240, 255, 0.08)',
                            },
                        }}
                    >
                        Dodaj kategorię
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddExpense}
                    >
                        Dodaj wydatek
                    </Button>
                </Box>
            </Box>

            {/* Summary Card */}
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
                        <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                Suma wydatków
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff6b9d' }}>
                                {totalExpenses.toFixed(2)} zł
                            </Typography>
                        </Box>
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

            {/* Filters */}
            <Card
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 3,
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Szukaj wydatków..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ flex: 1, minWidth: 250 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Kategoria</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Kategoria"
                                onChange={(e) => setSelectedCategory(e.target.value)}
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

            {/* Expenses Table */}
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
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Data"
                            type="date"
                            value={expenseForm.date}
                            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
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
                        disabled={!expenseForm.name || !expenseForm.categoryId || !expenseForm.amount}
                    >
                        {editingExpense ? 'Zapisz' : 'Dodaj'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog - Add Category */}
            <Dialog
                open={openCategoryDialog}
                onClose={() => setOpenCategoryDialog(false)}
                maxWidth="sm"
                fullWidth
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
                        disabled={!categoryForm.name}
                    >
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WydatkiSection;
