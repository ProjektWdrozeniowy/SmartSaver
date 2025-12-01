// src/components/dashboard/Tutorial.jsx
import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useThemeMode } from '../../context/ThemeContext';

const Tutorial = ({ run, onFinish, onNavigate }) => {
    const { mode } = useThemeMode();
    const [stepIndex, setStepIndex] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);

    // Reset step index when tutorial starts
    useEffect(() => {
        if (run) {
            setStepIndex(0);
            setIsNavigating(false);
        }
    }, [run]);

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
            content: 'Teraz przejdziemy do sekcji "Budżet", gdzie możesz zarządzać swoimi przychodami. Kliknij "Dalej", aby kontynuować.',
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="budzet-section"]',
            content: 'Sekcja Budżet pozwala zarządzać przychodami. Tutaj możesz dodawać swoje przychody, śledzić miesięczny budżet i monitorować wydatki w stosunku do przychodów.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-income-button"]',
            content: 'To jest przycisk do dodawania nowych przychodów. Za chwilę zobaczysz formularz, w którym możesz wprowadzić nazwę, kwotę, datę i opis przychodu. Kliknij "Dalej".',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="income-dialog"]',
            content: 'To jest formularz dodawania przychodu. Możesz tutaj wpisać nazwę przychodu (np. wynagrodzenie), kwotę, datę oraz opcjonalny opis. Możesz również ustawić przychód jako cykliczny. Na potrzeby samouczka formularz jest zablokowany. Kliknij "Dalej", aby kontynuować.',
            placement: 'right',
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
            content: 'Przejdziemy teraz do sekcji "Wydatki", gdzie możesz śledzić swoje wydatki. Kliknij "Dalej".',
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="wydatki-section"]',
            content: 'W sekcji Wydatki zarządzasz swoimi wydatkami. Możesz kategoryzować wydatki, śledzić swoje wydatki i analizować, na co wydajesz najwięcej pieniędzy.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-expense-button"]',
            content: 'Przycisk "Dodaj wydatek" pozwala rejestrować nowe wydatki. Za chwilę zobaczysz formularz, w którym możesz wybrać kategorię i wpisać szczegóły wydatku. Kliknij "Dalej".',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="expense-dialog"]',
            content: 'Formularz wydatku jest podobny do formularza przychodu. Możesz wybrać kategorię, wpisać nazwę, kwotę, datę i opis. Wydatki mogą być również cykliczne. Formularz jest zablokowany na potrzeby samouczka.',
            placement: 'right',
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
            content: 'Przejdziemy do sekcji "Cele", gdzie możesz planować swoje cele finansowe. Kliknij "Dalej".',
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="cele-section"]',
            content: 'Sekcja Cele pomaga Ci oszczędzać na konkretne cele finansowe. Możesz ustawić cel oszczędnościowy, śledzić postęp i dodawać wpłaty na ten cel.',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-goal-button"]',
            content: 'Przycisk "Dodaj Cel" służy do tworzenia nowych celów oszczędnościowych. Za chwilę zobaczysz formularz, w którym możesz określić nazwę celu, docelową kwotę i termin. Kliknij "Dalej".',
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="goal-dialog"]',
            content: 'W formularzu celu możesz określić nazwę celu, docelową kwotę, termin osiągnięcia i opcjonalny opis. SmartSaver pomoże Ci śledzić postęp i przypomni o zbliżającym się terminie.',
            placement: 'right',
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
            content: 'Na koniec przejdziemy do sekcji "Powiadomienia". Kliknij "Dalej".',
            placement: 'right',
            disableBeacon: true,
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
            onFinish();
            setStepIndex(0);
        } else if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
            const currentStep = steps[index];
            const nextIndex = index + 1;

            // Check if next step requires navigation
            if (nextIndex < steps.length) {
                const nextStep = steps[nextIndex];

                // Navigate to different sections and wait for render
                if (nextStep.target === '[data-tour="budzet-section"]') {
                    setIsNavigating(true);
                    onNavigate('budzet');
                    setTimeout(() => {
                        setStepIndex(nextIndex);
                        setIsNavigating(false);
                    }, 300);
                    return;
                } else if (nextStep.target === '[data-tour="wydatki-section"]') {
                    setIsNavigating(true);
                    onNavigate('wydatki');
                    setTimeout(() => {
                        setStepIndex(nextIndex);
                        setIsNavigating(false);
                    }, 300);
                    return;
                } else if (nextStep.target === '[data-tour="cele-section"]') {
                    setIsNavigating(true);
                    onNavigate('cele');
                    setTimeout(() => {
                        setStepIndex(nextIndex);
                        setIsNavigating(false);
                    }, 300);
                    return;
                } else if (nextStep.target === '[data-tour="powiadomienia-section"]') {
                    setIsNavigating(true);
                    onNavigate('powiadomienia');
                    setTimeout(() => {
                        setStepIndex(nextIndex);
                        setIsNavigating(false);
                    }, 300);
                    return;
                }

                // Handle dialog opening with delay
                if (currentStep.target === '[data-tour="add-income-button"]') {
                    setIsNavigating(true);
                    setTimeout(() => {
                        onNavigate('add-income');
                        setTimeout(() => {
                            setStepIndex(nextIndex);
                            setIsNavigating(false);
                        }, 500); // Wait for dialog to open
                    }, 100);
                    return;
                } else if (currentStep.target === '[data-tour="add-expense-button"]') {
                    setIsNavigating(true);
                    setTimeout(() => {
                        onNavigate('add-expense');
                        setTimeout(() => {
                            setStepIndex(nextIndex);
                            setIsNavigating(false);
                        }, 500);
                    }, 100);
                    return;
                } else if (currentStep.target === '[data-tour="add-goal-button"]') {
                    setIsNavigating(true);
                    setTimeout(() => {
                        onNavigate('add-goal');
                        setTimeout(() => {
                            setStepIndex(nextIndex);
                            setIsNavigating(false);
                        }, 500);
                    }, 100);
                    return;
                }

                // Handle dialog closing
                if (currentStep.target === '[data-tour="income-dialog"]') {
                    onNavigate('close-income-dialog');
                } else if (currentStep.target === '[data-tour="expense-dialog"]') {
                    onNavigate('close-expense-dialog');
                } else if (currentStep.target === '[data-tour="goal-dialog"]') {
                    onNavigate('close-goal-dialog');
                }
            }

            // Normal step progression
            setStepIndex(nextIndex);
        } else if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
            setStepIndex(Math.max(0, index - 1));
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run && !isNavigating}
            stepIndex={stepIndex}
            continuous
            scrollToFirstStep={false}
            disableScrolling={true}
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
