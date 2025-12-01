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

    // Helper function to add step counter to content
    const addStepCounter = (content, stepNumber, totalSteps) => {
        return (
            <div>
                <div style={{
                    fontSize: '13px',
                    color: mode === 'dark' ? '#999' : '#666',
                    marginBottom: '12px',
                    fontWeight: 500
                }}>
                    Krok {stepNumber} z {totalSteps}
                </div>
                {typeof content === 'string' ? <div>{content}</div> : content}
            </div>
        );
    };

    const steps = [
        {
            target: 'body',
            content: (
                <div>
                    <div style={{
                        fontSize: '13px',
                        color: mode === 'dark' ? '#999' : '#666',
                        marginBottom: '12px',
                        fontWeight: 500
                    }}>
                        Krok 1 z 19
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontWeight: 700,
                            fontSize: '42px',
                            color: mode === 'dark' ? '#ffffff' : '#2c2c2c',
                            letterSpacing: '1px',
                            marginBottom: '24px',
                            marginTop: '12px'
                        }}>
                            SmartSaver
                        </div>
                        <div style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: mode === 'dark' ? '#e0e0e0' : '#4a4a4a'
                        }}>
                            Witaj w SmartSaver! Czy chcesz przejść szybki samouczek aplikacji?
                        </div>
                    </div>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
            hideFooter: false,
            locale: {
                skip: 'Nie, dziękuję',
                next: 'Tak, zacznijmy!',
                last: 'Zakończ',
            },
            styles: {
                tooltip: {
                    width: 500,
                    padding: '28px 24px',
                }
            }
        },
        {
            target: '[data-tour="pulpit-stats-cards"]',
            content: addStepCounter('To jest sekcja Pulpit. Tutaj znajdziesz podsumowanie swoich finansów, w tym aktualne saldo, przychody, wydatki i postęp w realizacji celów. W tym miejscu możesz szybko zobaczyć stan swoich finansów.', 2, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-budzet"]',
            content: addStepCounter('Teraz przejdziemy do sekcji "Budżet", gdzie możesz zarządzać swoimi przychodami. Kliknij "Następny", aby kontynuować.', 3, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="budzet-cards"]',
            content: addStepCounter('Sekcja Budżet pozwala zarządzać przychodami. Tutaj możesz dodawać swoje przychody, śledzić miesięczny budżet i monitorować wydatki w stosunku do przychodów.', 4, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-income-button"]',
            content: addStepCounter('To jest przycisk do dodawania nowych przychodów. Za chwilę zobaczysz formularz, w którym możesz wprowadzić nazwę, kwotę, datę i opis przychodu. Kliknij "Następny".', 5, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="income-dialog"]',
            content: addStepCounter('To jest formularz dodawania przychodu. Możesz tutaj wpisać nazwę przychodu (np. wynagrodzenie), kwotę, datę oraz opcjonalny opis. Możesz również ustawić przychód jako cykliczny. Na potrzeby samouczka formularz jest zablokowany. Kliknij "Następny", aby kontynuować.', 6, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="income-item"]',
            content: addStepCounter('Oto Twój przykładowy przychód! Możesz go edytować klikając ikonę ołówka lub usunąć klikając ikonę kosza. Przychody cykliczne będą automatycznie dodawane co określony okres czasu.', 7, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-wydatki"]',
            content: addStepCounter('Przejdziemy teraz do sekcji "Wydatki", gdzie możesz śledzić swoje wydatki. Kliknij "Następny".', 8, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="wydatki-cards"]',
            content: addStepCounter('W sekcji Wydatki zarządzasz swoimi wydatkami. Możesz kategoryzować wydatki, śledzić swoje wydatki i analizować, na co wydajesz najwięcej pieniędzy.', 9, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-expense-button"]',
            content: addStepCounter('Przycisk "Dodaj wydatek" pozwala rejestrować nowe wydatki. Za chwilę zobaczysz formularz, w którym możesz wybrać kategorię i wpisać szczegóły wydatku. Kliknij "Następny".', 10, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="expense-dialog"]',
            content: addStepCounter('Formularz wydatku jest podobny do formularza przychodu. Możesz wybrać kategorię, wpisać nazwę, kwotę, datę i opis. Wydatki mogą być również cykliczne. Formularz jest zablokowany na potrzeby samouczka.', 11, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="expense-item"]',
            content: addStepCounter('To jest Twój przykładowy wydatek. Podobnie jak przychody, możesz go edytować lub usunąć. Kategorie pomagają Ci organizować wydatki i analizować swoje nawyki finansowe.', 12, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-cele"]',
            content: addStepCounter('Przejdziemy do sekcji "Cele", gdzie możesz planować swoje cele finansowe. Kliknij "Następny".', 13, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="cele-section"]',
            content: addStepCounter('Sekcja Cele pomaga Ci oszczędzać na konkretne cele finansowe. Możesz ustawić cel oszczędnościowy, śledzić postęp i dodawać wpłaty na ten cel.', 14, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="add-goal-button"]',
            content: addStepCounter('Przycisk "Dodaj Cel" służy do tworzenia nowych celów oszczędnościowych. Za chwilę zobaczysz formularz, w którym możesz określić nazwę celu, docelową kwotę i termin. Kliknij "Następny".', 15, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="goal-dialog"]',
            content: addStepCounter('W formularzu celu możesz określić nazwę celu, docelową kwotę, termin osiągnięcia i opcjonalny opis. SmartSaver pomoże Ci śledzić postęp i przypomni o zbliżającym się terminie.', 16, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="goal-item"]',
            content: addStepCounter('Twój przykładowy cel! Możesz dodawać wpłaty na cel, edytować go lub usunąć. Pasek postępu pokazuje, jak blisko jesteś realizacji celu.', 17, 19),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '[data-tour="menu-powiadomienia"]',
            content: addStepCounter('Na koniec przejdziemy do sekcji "Powiadomienia". Kliknij "Następny".', 18, 19),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '[data-tour="powiadomienia-section"]',
            content: addStepCounter('W sekcji Powiadomienia znajdziesz wszystkie powiadomienia systemowe. Otrzymasz powiadomienia o przekroczeniu budżetu, osiągnięciu celu lub zbliżającym się terminie celu. To kończy nasz samouczek! Możesz teraz swobodnie korzystać z aplikacji SmartSaver.', 19, 19),
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
                if (nextStep.target === '[data-tour="budzet-section"]' || nextStep.target === '[data-tour="budzet-cards"]') {
                    setIsNavigating(true);
                    onNavigate('budzet');
                    setTimeout(() => {
                        setStepIndex(nextIndex);
                        setIsNavigating(false);
                    }, 300);
                    return;
                } else if (nextStep.target === '[data-tour="wydatki-section"]' || nextStep.target === '[data-tour="wydatki-cards"]') {
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
            showProgress={false}
            showSkipButton
            callback={handleJoyrideCallback}
            locale={{
                back: 'Wstecz',
                close: 'Zamknij',
                last: 'Zakończ',
                next: 'Następny',
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
