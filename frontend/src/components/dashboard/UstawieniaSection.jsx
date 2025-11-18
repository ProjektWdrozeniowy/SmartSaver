// src/components/dashboard/UstawieniaSection.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    TextField,
    Button,
    Switch,
    IconButton,
    Divider,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    useTheme,
    Slider,
    InputAdornment,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUser, saveUser } from '../../api/auth';
import {
    updateUserProfile,
    changePassword,
    getNotificationSettings,
    updateNotificationSettings,
    exportUserData,
    deleteAccount,
} from '../../api/settings';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';

const UstawieniaSection = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { userMode, toggleTheme } = useThemeMode();

    // Stan dla informacji o profilu
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
    });

    // Stan dla zmiany hasła
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Stan dla powiadomień
    const [notifications, setNotifications] = useState({
        budgetAlerts: false,
        goalReminders: false,
        monthlyBudgetLimit: null,
        budgetAlertThreshold: 80,
    });

    // Stan dla komunikatów
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Stan dla dialogu usunięcia konta
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        password: '',
    });

    // Wczytaj dane użytkownika przy montowaniu komponentu
    useEffect(() => {
        const user = getUser();
        if (user) {
            setProfileData({
                username: user.username || '',
                email: user.email || '',
            });
        }

        // Wczytaj ustawienia powiadomień
        loadNotificationSettings();
    }, []);

    const loadNotificationSettings = async () => {
        try {
            const settings = await getNotificationSettings();
            setNotifications({
                budgetAlerts: settings.budgetAlerts || false,
                goalReminders: settings.goalReminders || false,
                monthlyBudgetLimit: settings.monthlyBudgetLimit || null,
                budgetAlertThreshold: settings.budgetAlertThreshold || 80,
            });
        } catch (error) {
            console.error('Błąd ładowania ustawień powiadomień:', error);
        }
    };

    // Obsługa zmiany danych profilu
    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    // Zapisz zmiany profilu
    const handleSaveProfile = async () => {
        try {
            const result = await updateUserProfile(profileData);

            // Zaktualizuj dane użytkownika w localStorage
            const currentUser = getUser();
            saveUser({
                ...currentUser,
                username: profileData.username,
                email: profileData.email,
            });

            setSnackbar({
                open: true,
                message: 'Profil został zaktualizowany',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Błąd podczas aktualizacji profilu',
                severity: 'error',
            });
        }
    };

    // Obsługa zmiany hasła
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    // Zapisz nowe hasło
    const handleChangePassword = async () => {
        // Walidacja
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setSnackbar({
                open: true,
                message: 'Wszystkie pola hasła są wymagane',
                severity: 'error',
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSnackbar({
                open: true,
                message: 'Nowe hasła nie są identyczne',
                severity: 'error',
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setSnackbar({
                open: true,
                message: 'Nowe hasło musi mieć co najmniej 6 znaków',
                severity: 'error',
            });
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            // Wyczyść pola
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setSnackbar({
                open: true,
                message: 'Hasło zostało zmienione',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Błąd podczas zmiany hasła',
                severity: 'error',
            });
        }
    };

    // Obsługa zmiany powiadomień
    const handleNotificationChange = async (name) => {
        const newValue = !notifications[name];
        setNotifications({
            ...notifications,
            [name]: newValue,
        });

        try {
            await updateNotificationSettings({
                ...notifications,
                [name]: newValue,
            });

            setSnackbar({
                open: true,
                message: 'Ustawienia powiadomień zaktualizowane',
                severity: 'success',
            });
        } catch (error) {
            // Przywróć poprzednią wartość w przypadku błędu
            setNotifications({
                ...notifications,
                [name]: !newValue,
            });

            setSnackbar({
                open: true,
                message: error.message || 'Błąd podczas aktualizacji powiadomień',
                severity: 'error',
            });
        }
    };

    // Obsługa zmiany limitu budżetu
    const handleBudgetLimitChange = async (value) => {
        const limit = value === '' ? null : parseFloat(value);
        setNotifications({
            ...notifications,
            monthlyBudgetLimit: limit,
        });
    };

    // Zapisz limit budżetu
    const handleBudgetLimitSave = async () => {
        try {
            await updateNotificationSettings(notifications);
            setSnackbar({
                open: true,
                message: 'Limit budżetu zaktualizowany',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Błąd podczas aktualizacji limitu',
                severity: 'error',
            });
        }
    };

    // Obsługa zmiany progu alertu
    const handleThresholdChange = async (event, newValue) => {
        setNotifications({
            ...notifications,
            budgetAlertThreshold: newValue,
        });

        try {
            await updateNotificationSettings({
                ...notifications,
                budgetAlertThreshold: newValue,
            });
        } catch (error) {
            console.error('Error updating threshold:', error);
        }
    };

    // Obsługa zmiany motywu
    const handleThemeChange = () => {
        toggleTheme();
        setSnackbar({
            open: true,
            message: `Zmieniono na motyw ${userMode === 'dark' ? 'jasny' : 'ciemny'}`,
            severity: 'success',
        });
    };

    // Eksport danych
    const handleExportData = async () => {
        try {
            const data = await exportUserData();

            // Utwórz plik JSON i pobierz
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `smartsaver_data_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSnackbar({
                open: true,
                message: 'Dane zostały wyeksportowane',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Błąd podczas eksportowania danych',
                severity: 'error',
            });
        }
    };

    // Usunięcie konta
    const handleDeleteAccount = async () => {
        if (!deleteDialog.password) {
            setSnackbar({
                open: true,
                message: 'Proszę podać hasło',
                severity: 'error',
            });
            return;
        }

        try {
            await deleteAccount(deleteDialog.password);

            // Wyloguj użytkownika i przekieruj na stronę główną
            localStorage.clear();
            navigate('/');

            setSnackbar({
                open: true,
                message: 'Konto zostało usunięte',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Błąd podczas usuwania konta',
                severity: 'error',
            });
        } finally {
            setDeleteDialog({ open: false, password: '' });
        }
    };

    return (
        <Box>
            {/* Nagłówek */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Zarządzaj swoim kontem i preferencjami
                </Typography>
            </Box>

            {/* Informacje o profilu */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    p: 3,
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Informacje o profilu
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Zaktualizuj swoje dane osobowe
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                            Imię i nazwisko
                        </Typography>
                        <TextField
                            fullWidth
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            placeholder="Jan Kowalski"
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                            Email
                        </Typography>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            placeholder="jan.kowalski@example.com"
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        sx={{
                            mt: 1,
                            alignSelf: 'flex-start',
                            background: 'linear-gradient(135deg, rgba(144, 164, 174, 0.3), rgba(144, 164, 174, 0.2))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(144, 164, 174, 0.5)',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(144, 164, 174, 0.5)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(144, 164, 174, 0.4), rgba(144, 164, 174, 0.3))',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(144, 164, 174, 0.3)',
                            },
                        }}
                    >
                        Zapisz zmiany
                    </Button>
                </Box>
            </Card>

            {/* Zmiana hasła */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    p: 3,
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LockIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Zmiana hasła
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Zabezpiecz swoje konto silnym hasłem
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                            Aktualne hasło
                        </Typography>
                        <TextField
                            fullWidth
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                            Nowe hasło
                        </Typography>
                        <TextField
                            fullWidth
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                            Potwierdź nowe hasło
                        </Typography>
                        <TextField
                            fullWidth
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        sx={{
                            mt: 1,
                            alignSelf: 'flex-start',
                            background: 'linear-gradient(135deg, rgba(144, 164, 174, 0.3), rgba(144, 164, 174, 0.2))',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(144, 164, 174, 0.5)',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(144, 164, 174, 0.5)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgba(144, 164, 174, 0.4), rgba(144, 164, 174, 0.3))',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(144, 164, 174, 0.3)',
                            },
                        }}
                    >
                        Zmień hasło
                    </Button>
                </Box>
            </Card>

            {/* Powiadomienia */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    p: 3,
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <NotificationsIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Powiadomienia
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Zarządzaj preferencjami powiadomień
                </Typography>

                <Box>
                    {/* Alerty budżetowe */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                Alerty budżetowe
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Powiadomienia o przekroczeniu budżetu
                            </Typography>
                        </Box>
                        <Switch
                            checked={notifications.budgetAlerts}
                            onChange={() => handleNotificationChange('budgetAlerts')}
                            color="primary"
                        />
                    </Box>

                    {/* Budget limit settings - visible when budgetAlerts is enabled */}
                    {notifications.budgetAlerts && (
                        <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                                    Miesięczny limit budżetu
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        type="number"
                                        value={notifications.monthlyBudgetLimit || ''}
                                        onChange={(e) => handleBudgetLimitChange(e.target.value)}
                                        placeholder="Wprowadź limit"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                                        }}
                                        inputProps={{
                                            min: 0,
                                            step: 100
                                        }}
                                        sx={{
                                            '& input[type=number]': {
                                                MozAppearance: 'textfield',
                                            },
                                            '& input[type=number]::-webkit-outer-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
                                            },
                                            '& input[type=number]::-webkit-inner-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleBudgetLimitSave}
                                        disabled={!notifications.monthlyBudgetLimit}
                                        sx={{ minWidth: 100 }}
                                    >
                                        Zapisz
                                    </Button>
                                </Box>
                            </Box>

                            {notifications.monthlyBudgetLimit && (
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                        Ostrzegaj przy: {notifications.budgetAlertThreshold}% budżetu
                                    </Typography>
                                    <Slider
                                        value={notifications.budgetAlertThreshold}
                                        onChange={handleThresholdChange}
                                        min={70}
                                        max={100}
                                        step={10}
                                        marks={[
                                            { value: 70, label: '70%' },
                                            { value: 80, label: '80%' },
                                            { value: 90, label: '90%' },
                                            { value: 100, label: '100%' },
                                        ]}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value}%`}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}

                    <Divider />

                    {/* Przypomnienia o celach */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                Przypomnienie o celach
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Powiadomienia o postępach w celach
                            </Typography>
                        </Box>
                        <Switch
                            checked={notifications.goalReminders}
                            onChange={() => handleNotificationChange('goalReminders')}
                            color="primary"
                        />
                    </Box>
                </Box>
            </Card>

            {/* Wygląd */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    p: 3,
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PaletteIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Wygląd
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Dostosuj wygląd aplikacji
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            Motyw ciemny
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {userMode === 'dark' ? 'Przełącz na motyw jasny' : 'Przełącz na motyw ciemny'}
                        </Typography>
                    </Box>
                    <Switch
                        checked={userMode === 'dark'}
                        onChange={handleThemeChange}
                        color="primary"
                    />
                </Box>
            </Card>

            {/* Dane i prywatność */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    p: 3,
                    mb: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SecurityIcon sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Dane i prywatność
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Zarządzaj swoimi danymi
                </Typography>

                <Box>
                    {/* Eksport danych */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                Eksportuj dane
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Pobierz wszystkie swoje dane w formacie JSON
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportData}
                            sx={{
                                background: 'linear-gradient(135deg, rgba(144, 164, 174, 0.15), rgba(144, 164, 174, 0.08))',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(144, 164, 174, 0.4)',
                                color: '#90a4ae',
                                textShadow: '0 0 8px rgba(144, 164, 174, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(144, 164, 174, 0.25), rgba(144, 164, 174, 0.15))',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(144, 164, 174, 0.2)',
                                    borderColor: 'rgba(144, 164, 174, 0.5)',
                                },
                            }}
                        >
                            Eksportuj
                        </Button>
                    </Box>

                    <Divider />

                    {/* Usuń konto */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'error.main' }}>
                                Usuń konto
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Trwale usuń swoje konto i wszystkie dane
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialog({ open: true, password: '' })}
                            sx={{
                                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.08))',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(244, 67, 54, 0.4)',
                                color: '#f44336',
                                textShadow: '0 0 8px rgba(244, 67, 54, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.25), rgba(244, 67, 54, 0.15))',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
                                    borderColor: 'rgba(244, 67, 54, 0.5)',
                                },
                            }}
                        >
                            Usuń konto
                        </Button>
                    </Box>
                </Box>
            </Card>

            {/* Snackbar dla komunikatów */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Dialog potwierdzenia usunięcia konta */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, password: '' })}
                PaperProps={{
                    sx: {
                        background: userMode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(18, 18, 18, 0.95))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: userMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                        boxShadow: userMode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    }
                }}
            >
                <DialogTitle>Usuń konto</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna i
                        spowoduje trwałe usunięcie wszystkich Twoich danych.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        type="password"
                        label="Potwierdź hasło"
                        value={deleteDialog.password}
                        onChange={(e) =>
                            setDeleteDialog({ ...deleteDialog, password: e.target.value })
                        }
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, password: '' })}
                        color="primary"
                    >
                        Anuluj
                    </Button>
                    <Button onClick={handleDeleteAccount} color="error" variant="contained">
                        Usuń konto
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UstawieniaSection;
