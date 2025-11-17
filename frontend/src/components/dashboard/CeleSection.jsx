// src/components/dashboard/CeleSection.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    CircularProgress,
    Alert,
    Snackbar,
    LinearProgress,
    Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getGoals, createGoal, updateGoal, deleteGoal, contributeToGoal } from '../../api/goals';

const CeleSection = () => {
    // Data states
    const [goals, setGoals] = useState([]);

    // UI states
    const [openGoalDialog, setOpenGoalDialog] = useState(false);
    const [openContributeDialog, setOpenContributeDialog] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState(null);

    // Loading and notification states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form state for new/edit goal
    const [goalForm, setGoalForm] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        dueDate: '',
        description: '',
    });

    // Form state for contribution
    const [contributeAmount, setContributeAmount] = useState('');

    // Fetch goals on mount
    useEffect(() => {
        fetchGoals();
    }, []);

    // API functions
    const fetchGoals = async () => {
        try {
            setLoading(true);
            const data = await getGoals();
            setGoals(data.goals || []);
        } catch (err) {
            console.error('Error fetching goals:', err);
            showSnackbar('Nie udało się pobrać celów', 'error');
            setGoals([]);
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

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalGoals = goals.length;
        const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
        const totalTarget = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
        const remaining = totalTarget - totalSaved;
        const percentageComplete = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

        return {
            totalGoals,
            totalSaved,
            remaining: remaining > 0 ? remaining : 0,
            percentageComplete,
        };
    }, [goals]);

    // Calculate progress percentage
    const calculateProgress = (current, target) => {
        if (target === 0) return 0;
        const progress = (current / target) * 100;
        return Math.min(progress, 100);
    };

    // Calculate days remaining
    const calculateDaysRemaining = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Check if goal is completed
    const isGoalCompleted = (goal) => {
        return goal.currentAmount >= goal.targetAmount;
    };

    // Handle add goal
    const handleAddGoal = () => {
        setEditingGoal(null);
        setGoalForm({
            name: '',
            targetAmount: '',
            currentAmount: '0',
            dueDate: '',
            description: '',
        });
        setOpenGoalDialog(true);
    };

    // Handle edit goal
    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setGoalForm({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            dueDate: goal.dueDate.split('T')[0], // Convert ISO string to YYYY-MM-DD format
            description: goal.description || '',
        });
        setOpenGoalDialog(true);
    };

    // Handle save goal
    const handleSaveGoal = async () => {
        try {
            setSaving(true);
            const goalData = {
                name: goalForm.name,
                targetAmount: parseFloat(goalForm.targetAmount),
                currentAmount: parseFloat(goalForm.currentAmount || 0),
                dueDate: goalForm.dueDate,
                description: goalForm.description,
            };

            if (editingGoal) {
                // Update existing
                await updateGoal(editingGoal.id, goalData);
                showSnackbar('Cel został zaktualizowany', 'success');
            } else {
                // Add new
                await createGoal(goalData);
                showSnackbar('Cel został dodany', 'success');
            }

            setOpenGoalDialog(false);
            fetchGoals(); // Refresh list
        } catch (err) {
            console.error('Error saving goal:', err);
            showSnackbar(err.message || 'Nie udało się zapisać celu', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Handle delete goal
    const handleDeleteGoal = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten cel?')) {
            try {
                await deleteGoal(id);
                showSnackbar('Cel został usunięty', 'success');
                fetchGoals(); // Refresh list
            } catch (err) {
                console.error('Error deleting goal:', err);
                showSnackbar(err.message || 'Nie udało się usunąć celu', 'error');
            }
        }
    };

    // Handle open contribute dialog
    const handleOpenContribute = (goal) => {
        setSelectedGoal(goal);
        setContributeAmount('');
        setOpenContributeDialog(true);
    };

    // Handle contribute
    const handleContribute = async () => {
        try {
            setSaving(true);
            await contributeToGoal(selectedGoal.id, parseFloat(contributeAmount));
            showSnackbar('Wpłata została dodana', 'success');
            setOpenContributeDialog(false);
            fetchGoals(); // Refresh list
        } catch (err) {
            console.error('Error contributing:', err);
            showSnackbar(err.message || 'Nie udało się dodać wpłaty', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Planuj i realizuj swoje cele finansowe
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddGoal}
                    sx={{
                        background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.3), rgba(199, 125, 255, 0.2))',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(199, 125, 255, 0.5)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(199, 125, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textShadow: '0 0 10px rgba(199, 125, 255, 0.5)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.4), rgba(199, 125, 255, 0.3))',
                            boxShadow: '0 6px 16px rgba(199, 125, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    Nowy cel
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                width: '100%',
                flexWrap: 'wrap'
            }}>
                {/* All Goals */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' },
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
                                    Wszystkie cele
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#ab47bc20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ab47bc',
                                    }}
                                >
                                    <TrackChangesIcon />
                                </Box>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: 'text.primary',
                                    textShadow: '0 0 20px #ab47bc60, 0 0 40px #ab47bc40'
                                }}
                            >
                                {statistics.totalGoals}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Aktywnych celów
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Total Saved */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' },
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
                                    Zaoszczędzone
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
                                    <SavingsIcon />
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
                                {statistics.totalSaved.toFixed(2).replace('.', ',')} zł
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                {statistics.percentageComplete.toFixed(0)}% całkowitego celu
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Remaining */}
                <Box sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 11px)' },
                    minWidth: 0
                }}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 215, 0, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
                            height: '100%',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 28px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255, 215, 0, 0.3)',
                                borderColor: 'rgba(255, 215, 0, 0.4)',
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Do zebrania
                                </Typography>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        backgroundColor: '#ffd70020',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffd700',
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
                                    textShadow: '0 0 20px #ffd70060, 0 0 40px #ffd70040'
                                }}
                            >
                                {statistics.remaining.toFixed(2).replace('.', ',')} zł
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Pozostało do osiągnięcia
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Goals List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <CircularProgress />
                </Box>
            ) : goals.length === 0 ? (
                <Card
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        p: 4,
                        textAlign: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(199, 125, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: '#ab47bc',
                        }}
                    >
                        <TrackChangesIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                        Brak celów
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                        Dodaj swój pierwszy cel oszczędnościowy, aby zacząć planować swoją przyszłość finansową
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddGoal}
                        sx={{
                            background: 'linear-gradient(135deg, #ab47bc 0%, #9d4edd 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                            },
                        }}
                    >
                        Dodaj cel
                    </Button>
                </Card>
            ) : (
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    width: '100%',
                    flexWrap: 'wrap'
                }}>
                    {goals.map((goal) => {
                        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                        const daysRemaining = calculateDaysRemaining(goal.dueDate);
                        const isCompleted = isGoalCompleted(goal);

                        return (
                            <Box
                                key={goal.id}
                                sx={{
                                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' },
                                    minWidth: 0
                                }}
                            >
                                <Card
                                    sx={{
                                        background: isCompleted
                                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.05))'
                                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        border: '1px solid',
                                        borderColor: isCompleted ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                                        boxShadow: isCompleted
                                            ? '0 4px 12px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.2)'
                                            : '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'none',
                                            boxShadow: isCompleted
                                                ? '0 4px 12px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(76, 175, 80, 0.2)'
                                                : '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                            borderColor: isCompleted ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 255, 255, 0.15)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* Header with title and status */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', flex: 1 }}>
                                                {goal.name}
                                            </Typography>
                                            {isCompleted && (
                                                <Chip
                                                    label="Ukończony"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                                        color: '#4caf50',
                                                        fontWeight: 600,
                                                        ml: 1,
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Description */}
                                        {goal.description && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    mb: 2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {goal.description}
                                            </Typography>
                                        )}

                                        {/* Progress Bar */}
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Postęp
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                                    {progress.toFixed(0)}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: isCompleted ? '#4caf50' : '#ab47bc',
                                                        borderRadius: 4,
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Amounts */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                                    Zaoszczędzone
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#00b8d4', fontWeight: 600 }}>
                                                    {goal.currentAmount.toFixed(2).replace('.', ',')} zł
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                                    Cel
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                                    {goal.targetAmount.toFixed(2).replace('.', ',')} zł
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Days Remaining */}
                                        {daysRemaining !== null && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {daysRemaining > 0
                                                        ? `${daysRemaining} dni pozostało`
                                                        : daysRemaining === 0
                                                        ? 'Dzisiaj'
                                                        : `${Math.abs(daysRemaining)} dni po terminie`}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', alignItems: 'stretch' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AccountBalanceWalletIcon sx={{ fontSize: '18px' }} />}
                                                onClick={() => handleOpenContribute(goal)}
                                                disabled={isCompleted}
                                                disableElevation
                                                sx={{
                                                    flex: 1,
                                                    minHeight: '36px',
                                                    paddingX: 1.5,
                                                    background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.3), rgba(199, 125, 255, 0.2))',
                                                    backdropFilter: 'blur(8px)',
                                                    WebkitBackdropFilter: 'blur(8px)',
                                                    border: '1px solid rgba(199, 125, 255, 0.5)',
                                                    color: '#ffffff',
                                                    boxShadow: '0 2px 8px rgba(199, 125, 255, 0.3)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(199, 125, 255, 0.4), rgba(199, 125, 255, 0.3))',
                                                        boxShadow: '0 4px 12px rgba(199, 125, 255, 0.4)',
                                                        transform: 'none',
                                                    },
                                                    '&:disabled': {
                                                        background: 'rgba(255, 255, 255, 0.12)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    },
                                                }}
                                            >
                                                Wpłać
                                            </Button>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditGoal(goal)}
                                                sx={{
                                                    background: 'rgba(0, 240, 255, 0.1)',
                                                    backdropFilter: 'blur(8px)',
                                                    WebkitBackdropFilter: 'blur(8px)',
                                                    border: '1px solid rgba(0, 240, 255, 0.3)',
                                                    borderRadius: '20px',
                                                    color: '#00b8d4',
                                                    padding: '6px 16px',
                                                    minHeight: '36px',
                                                    flexShrink: 0,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        background: 'rgba(0, 240, 255, 0.2)',
                                                        boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)',
                                                    },
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                sx={{
                                                    background: 'rgba(244, 67, 54, 0.1)',
                                                    backdropFilter: 'blur(8px)',
                                                    WebkitBackdropFilter: 'blur(8px)',
                                                    border: '1px solid rgba(244, 67, 54, 0.3)',
                                                    borderRadius: '20px',
                                                    color: '#f44336',
                                                    padding: '6px 16px',
                                                    minHeight: '36px',
                                                    flexShrink: 0,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        background: 'rgba(244, 67, 54, 0.2)',
                                                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                                                    },
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Dialog - Add/Edit Goal */}
            <Dialog
                open={openGoalDialog}
                onClose={() => setOpenGoalDialog(false)}
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
                    {editingGoal ? 'Edytuj cel' : 'Dodaj nowy cel'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Nazwa celu"
                            value={goalForm.name}
                            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                            fullWidth
                            required
                            placeholder="np. Wakacje 2026"
                        />
                        <TextField
                            label="Kwota docelowa"
                            type="number"
                            value={goalForm.targetAmount}
                            onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                            fullWidth
                            required
                            inputProps={{ step: '0.01', min: '0' }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Aktualna kwota"
                            type="number"
                            value={goalForm.currentAmount}
                            onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                            fullWidth
                            required
                            inputProps={{ step: '0.01', min: '0' }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                            }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                            <DatePicker
                                label="Termin realizacji"
                                value={goalForm.dueDate ? dayjs(goalForm.dueDate) : null}
                                onChange={(newValue) => setGoalForm({ ...goalForm, dueDate: newValue ? newValue.format('YYYY-MM-DD') : '' })}
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
                                                    backgroundColor: 'rgba(199, 125, 255, 0.2)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#ab47bc',
                                                    '&:hover': {
                                                        backgroundColor: '#9d4edd',
                                                    },
                                                },
                                            },
                                            '& .MuiPickersDay-today': {
                                                border: '1px solid #ab47bc',
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
                            label="Opis (opcjonalnie)"
                            value={goalForm.description}
                            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Dodaj opis swojego celu"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGoalDialog(false)}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleSaveGoal}
                        variant="contained"
                        disabled={!goalForm.name || !goalForm.targetAmount || !goalForm.dueDate || saving}
                        sx={{
                            background: 'linear-gradient(135deg, #ab47bc 0%, #9d4edd 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                            },
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : (editingGoal ? 'Zapisz' : 'Dodaj')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog - Contribute */}
            <Dialog
                open={openContributeDialog}
                onClose={() => setOpenContributeDialog(false)}
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
                <DialogTitle>
                    Wpłać do celu
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {selectedGoal && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                    Cel
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                                    {selectedGoal.name}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Aktualnie zaoszczędzone
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                        {selectedGoal.currentAmount.toFixed(2).replace('.', ',')} zł
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Pozostało do celu
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                        {(selectedGoal.targetAmount - selectedGoal.currentAmount).toFixed(2).replace('.', ',')} zł
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <TextField
                            label="Kwota wpłaty"
                            type="number"
                            value={contributeAmount}
                            onChange={(e) => setContributeAmount(e.target.value)}
                            fullWidth
                            required
                            autoFocus
                            inputProps={{ step: '0.01', min: '0.01' }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenContributeDialog(false)}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleContribute}
                        variant="contained"
                        disabled={!contributeAmount || parseFloat(contributeAmount) <= 0 || saving}
                        sx={{
                            background: 'linear-gradient(135deg, #ab47bc 0%, #9d4edd 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                            },
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Wpłać'}
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

export default CeleSection;
