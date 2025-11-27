// src/components/dashboard/Tutorial.jsx
import React from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useThemeMode } from '../../context/ThemeContext';

const Tutorial = ({ run, onFinish, onNavigate }) => {
    const { mode } = useThemeMode();

    const steps = [
        {
            target: 'body',
            content: 'Witaj w SmartSaver! Czy chcesz przejść szybki samouczek aplikacji?',
            placement: 'center',
            disableBeacon: true,
            hideFooter: false,
            locale: {
                skip: 'Nie, dziękuję',
                next: 'Tak, zacznijmy!',
                last: 'Zakończ',
            }
        },
        {
            target: '[data-tour="pulpit-section"]',
            content: 'To jest sekcja Pulpit. Tutaj znajdziesz podsumowanie swoich finansów, w tym aktualne saldo, przychody, wydatki i postęp w realizacji celów. W tym miejscu możesz szybko zobaczyć stan swoich finansów.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-budzet"]',
            content: 'Kliknij w przycisk "Budżet" w lewym menu, aby przejść do następnej sekcji.',
            placement: 'right',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="budzet-section"]',
            content: 'Sekcja Budżet pozwala zarządzać przychodami. Tutaj możesz dodawać swoje przychody, śledzić miesięczny budżet i monitorować wydatki w stosunku do przychodów.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-income-button"]',
            content: 'Kliknij przycisk "Dodaj przychód", aby dodać swój pierwszy przychód.',
            placement: 'bottom',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="income-dialog"]',
            content: 'To jest formularz dodawania przychodu. Możesz tutaj wpisać nazwę przychodu (np. wynagrodzenie), kwotę, datę oraz opcjonalny opis. Możesz również ustawić przychód jako cykliczny. Na potrzeby samouczka formularz jest zablokowany. Kliknij "Dalej", aby kontynuować.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[data-tour="income-item"]',
            content: 'Oto Twój przykładowy przychód! Możesz go edytować klikając ikonę ołówka lub usunąć klikając ikonę kosza. Przychody cykliczne będą automatycznie dodawane co określony okres czasu.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-wydatki"]',
            content: 'Teraz kliknij w przycisk "Wydatki" w lewym menu.',
            placement: 'right',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="wydatki-section"]',
            content: 'W sekcji Wydatki zarządzasz swoimi wydatkami. Możesz kategoryzować wydatki, śledzić swoje wydatki i analizować, na co wydajesz najwięcej pieniędzy.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-expense-button"]',
            content: 'Kliknij przycisk "Dodaj wydatek".',
            placement: 'bottom',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="expense-dialog"]',
            content: 'Formularz wydatku jest podobny do formularza przychodu. Możesz wybrać kategorię, wpisać nazwę, kwotę, datę i opis. Wydatki mogą być również cykliczne. Formularz jest zablokowany na potrzeby samouczka.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[data-tour="expense-item"]',
            content: 'To jest Twój przykładowy wydatek. Podobnie jak przychody, możesz go edytować lub usunąć. Kategorie pomagają Ci organizować wydatki i analizować swoje nawyki finansowe.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-cele"]',
            content: 'Kliknij w przycisk "Cele" w lewym menu.',
            placement: 'right',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="cele-section"]',
            content: 'Sekcja Cele pomaga Ci oszczędzać na konkretne cele finansowe. Możesz ustawić cel oszczędnościowy, śledzić postęp i dodawać wpłaty na ten cel.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-goal-button"]',
            content: 'Kliknij przycisk "Dodaj Cel".',
            placement: 'bottom',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="goal-dialog"]',
            content: 'W formularzu celu możesz określić nazwę celu, docelową kwotę, termin osiągnięcia i opcjonalny opis. SmartSaver pomoże Ci śledzić postęp i przypomni o zbliżającym się terminie.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[data-tour="goal-item"]',
            content: 'Twój przykładowy cel! Możesz dodawać wpłaty na cel, edytować go lub usunąć. Pasek postępu pokazuje, jak blisko jesteś realizacji celu.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-powiadomienia"]',
            content: 'Kliknij w przycisk "Powiadomienia" w lewym menu.',
            placement: 'right',
            disableBeacon: true,
            spotlightClicks: true,
            hideFooter: true,
        },
        {
            target: '[data-tour="powiadomienia-section"]',
            content: 'W sekcji Powiadomienia znajdziesz wszystkie powiadomienia systemowe. Otrzymasz powiadomienia o przekroczeniu budżetu, osiągnięciu celu lub zbliżającym się terminie celu. To kończy nasz samouczek! Możesz teraz swobodnie korzystać z aplikacji SmartSaver.',
            placement: 'bottom',
            disableBeacon: true,
        },
    ];

    const handleJoyrideCallback = (data) => {
        const { action, index, status, type } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Tutorial finished or skipped
            onFinish();
        } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            const currentStep = steps[index];

            // Handle navigation based on step
            if (currentStep.target === '[data-tour="menu-budzet"]' && action === ACTIONS.NEXT) {
                // User clicked on Budget menu
                onNavigate('budzet');
            } else if (currentStep.target === '[data-tour="add-income-button"]' && action === ACTIONS.NEXT) {
                // User clicked on Add Income button - trigger dialog
                onNavigate('add-income');
            } else if (currentStep.target === '[data-tour="menu-wydatki"]' && action === ACTIONS.NEXT) {
                // User clicked on Expenses menu
                onNavigate('wydatki');
            } else if (currentStep.target === '[data-tour="add-expense-button"]' && action === ACTIONS.NEXT) {
                // User clicked on Add Expense button - trigger dialog
                onNavigate('add-expense');
            } else if (currentStep.target === '[data-tour="menu-cele"]' && action === ACTIONS.NEXT) {
                // User clicked on Goals menu
                onNavigate('cele');
            } else if (currentStep.target === '[data-tour="add-goal-button"]' && action === ACTIONS.NEXT) {
                // User clicked on Add Goal button - trigger dialog
                onNavigate('add-goal');
            } else if (currentStep.target === '[data-tour="menu-powiadomienia"]' && action === ACTIONS.NEXT) {
                // User clicked on Notifications menu
                onNavigate('powiadomienia');
            }
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            scrollToFirstStep
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            locale={{
                back: 'Wstecz',
                close: 'Zamknij',
                last: 'Zakończ',
                next: 'Dalej',
                skip: 'Pomiń',
            }}
            styles={{
                options: {
                    arrowColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                    backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                    overlayColor: 'rgba(0, 0, 0, 0.6)',
                    primaryColor: '#00b8d4',
                    textColor: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                    width: 380,
                    zIndex: 10000,
                },
                tooltip: {
                    borderRadius: 8,
                    fontSize: 16,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                tooltipTitle: {
                    fontSize: 18,
                    fontWeight: 600,
                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                },
                tooltipContent: {
                    padding: '12px 0',
                    fontSize: 15,
                    lineHeight: 1.6,
                },
                buttonNext: {
                    background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.3), rgba(0, 184, 212, 0.2))',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0, 184, 212, 0.5)',
                    color: '#ffffff',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 500,
                },
                buttonBack: {
                    color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                    marginRight: 10,
                },
                buttonSkip: {
                    color: mode === 'dark' ? '#aaaaaa' : '#666666',
                },
                spotlight: {
                    borderRadius: 4,
                },
            }}
        />
    );
};

export default Tutorial;
