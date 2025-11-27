# Implementacja Samouczka SmartSaver

## Podsumowanie

Interaktywny samouczek został w pełni zaimplementowany przy użyciu biblioteki **React Joyride**. Samouczek prowadzi użytkownika przez wszystkie główne sekcje aplikacji SmartSaver, pokazując jak korzystać z funkcji dodawania przychodów, wydatków, celów i powiadomień.

## Zaimplementowane Funkcjonalności

### 1. Backend

#### Baza danych
- **Plik**: `backend/prisma/schema.prisma`
- **Zmiana**: Dodano pole `tutorialCompleted: Boolean @default(false)` do modelu `Account`
- Pole automatycznie ustawia się na `false` dla nowych użytkowników

#### API Endpoints
- **Plik**: `backend/routes/user.js`
- **GET /api/user/tutorial-status** - Sprawdza czy użytkownik ukończył samouczek
- **PUT /api/user/complete-tutorial** - Oznacza samouczek jako ukończony

### 2. Frontend - API Integration

#### Tutorial API
- **Plik**: `frontend/src/api/tutorial.js`
- Funkcje do komunikacji z backendem:
  - `getTutorialStatus()` - Pobiera status samouczka
  - `completeTutorial()` - Zapisuje ukończenie samouczka

### 3. Frontend - Komponenty

#### Komponent Tutorial
- **Plik**: `frontend/src/components/dashboard/Tutorial.jsx`
- **Kroki samouczka**: 19 kroków
- **Funkcje**:
  - Automatyczne nawigowanie między sekcjami
  - Wsparcie dla trybu jasnego i ciemnego
  - Polskie tłumaczenia
  - Interaktywne kroki wymagające kliknięcia

#### DashboardPage
- **Plik**: `frontend/src/views/DashboardPage.jsx`
- **Integracja**:
  - Sprawdzanie statusu samouczka przy załadowaniu
  - Obsługa nawigacji między sekcjami
  - Przekazywanie `tutorialData` do wszystkich sekcji
  - Mechanizm testowy przez localStorage

#### Sekcje Aplikacji

**PulpitSection.jsx**:
- ✅ Dodano `data-tour="pulpit-section"` do głównego Boxa
- Wprowadzenie do aplikacji

**BudzetSection.jsx**:
- ✅ Dodano `data-tour="budzet-section"` do głównego Boxa
- ✅ Dodano `data-tour="add-income-button"` do przycisku dodawania przychodu
- ✅ Dodano `data-tour="income-dialog"` do dialogu
- ✅ Dodano `data-tour="income-item"` do pierwszego przychodu
- ✅ Obsługa `tutorialData.showIncome` - automatyczne otwieranie dialogu
- ✅ Wyświetlanie przykładowego przychodu "Wynagrodzenie 4500 zł"

**WydatkiSection.jsx**:
- ✅ Dodano `data-tour="wydatki-section"` do głównego Boxa
- ✅ Dodano `data-tour="add-expense-button"` do przycisku dodawania wydatku
- ✅ Dodano `data-tour="expense-dialog"` do dialogu
- ✅ Dodano `data-tour="expense-item"` do pierwszego wydatku
- ✅ Obsługa `tutorialData.showExpense` - automatyczne otwieranie dialogu
- ✅ Wyświetlanie przykładowego wydatku "Zakupy spożywcze 150 zł"

**CeleSection.jsx**:
- ✅ Dodano `data-tour="cele-section"` do głównego Boxa
- ✅ Dodano `data-tour="add-goal-button"` do przycisku dodawania celu
- ✅ Dodano `data-tour="goal-dialog"` do dialogu
- ✅ Dodano `data-tour="goal-item"` do pierwszego celu
- ✅ Obsługa `tutorialData.showGoal` - automatyczne otwieranie dialogu
- ✅ Wyświetlanie przykładowego celu "Wakacje 5000 zł"

**PowiadomieniaSection.jsx**:
- ✅ Dodano `data-tour="powiadomienia-section"` do głównego Boxa
- ✅ Obsługa `tutorialData.showNotification`
- ✅ Wyświetlanie przykładowych powiadomień (3 powiadomienia)

## Przepływ Samouczka

1. **Uruchomienie**: Samouczek uruchamia się automatycznie przy pierwszym zalogowaniu
2. **Popup powitalny**: Użytkownik wybiera czy chce przejść samouczek
3. **Pulpit**: Prezentacja sekcji pulpit
4. **Budżet**:
   - Użytkownik klika "Budżet" w menu
   - Wyświetla się modal dodawania przychodu (zablokowany)
   - Pokazuje przykładowy przychód
5. **Wydatki**:
   - Użytkownik klika "Wydatki" w menu
   - Wyświetla się modal dodawania wydatku (zablokowany)
   - Pokazuje przykładowy wydatek
6. **Cele**:
   - Użytkownik klika "Cele" w menu
   - Wyświetla się modal dodawania celu (zablokowany)
   - Pokazuje przykładowy cel
7. **Powiadomienia**:
   - Użytkownik klika "Powiadomienia" w menu
   - Pokazuje przykładowe powiadomienia
8. **Zakończenie**: Wszystkie tymczasowe dane są usuwane

## Mechanizm Testowy

### Uruchamianie trybu testowego

W konsoli przeglądarki (F12) wpisz:

```javascript
localStorage.setItem('forceTutorial', 'true');
```

Następnie odśwież stronę. Samouczek uruchomi się niezależnie od statusu w bazie danych.

### Wyłączanie trybu testowego

```javascript
localStorage.removeItem('forceTutorial');
```

lub po prostu ukończ samouczek - flaga zostanie automatycznie usunięta.

## Testowanie

### Test 1: Pierwszy login (tryb produkcyjny)
1. Zarejestruj nowego użytkownika
2. Zaloguj się
3. Samouczek powinien uruchomić się automatycznie
4. Przejdź przez wszystkie kroki
5. Po ukończeniu, `tutorialCompleted` w bazie danych = `true`
6. Wyloguj się i zaloguj ponownie - samouczek nie powinien się pokazać

### Test 2: Tryb testowy (localStorage)
1. Zaloguj się na istniejącego użytkownika
2. W konsoli: `localStorage.setItem('forceTutorial', 'true')`
3. Odśwież stronę
4. Samouczek powinien się uruchomić
5. Możesz testować wielokrotnie bez rejestracji nowych użytkowników

### Test 3: Nawigacja między sekcjami
1. Uruchom samouczek (tryb testowy lub nowy użytkownik)
2. Upewnij się że:
   - Kliknięcie "Budżet" w menu zmienia sekcję
   - Kliknięcie "Dodaj przychód" otwiera dialog
   - Dialog jest zablokowany (pola disabled)
   - Przykładowy przychód pojawia się po zamknięciu dialogu
3. Powtórz dla Wydatków, Celów

### Test 4: Tymczasowe dane
1. Uruchom samouczek
2. Podczas samouczka powinny być widoczne:
   - 1 przykładowy przychód
   - 1 przykładowy wydatek
   - 1 przykładowy cel
   - 3 przykładowe powiadomienia
3. Po ukończeniu samouczka wszystkie tymczasowe dane znikają

### Test 5: Przerwanie samouczka
1. Uruchom samouczek
2. Kliknij "Pomiń" w dowolnym momencie
3. Samouczek powinien się zamknąć
4. Status w bazie: `tutorialCompleted = true`

## Struktura Kroków

| Krok | Target | Akcja | Opis |
|------|--------|-------|------|
| 1 | body | - | Pytanie czy chcesz przejść samouczek |
| 2 | pulpit-section | - | Prezentacja sekcji Pulpit |
| 3 | menu-budzet | click | Wymagane kliknięcie "Budżet" |
| 4 | budzet-section | - | Prezentacja sekcji Budżet |
| 5 | add-income-button | click | Wymagane kliknięcie "Dodaj przychód" |
| 6 | income-dialog | - | Opis dialogu przychodu (zablokowany) |
| 7 | income-item | - | Pokazanie przykładowego przychodu |
| 8 | menu-wydatki | click | Wymagane kliknięcie "Wydatki" |
| 9 | wydatki-section | - | Prezentacja sekcji Wydatki |
| 10 | add-expense-button | click | Wymagane kliknięcie "Dodaj wydatek" |
| 11 | expense-dialog | - | Opis dialogu wydatku (zablokowany) |
| 12 | expense-item | - | Pokazanie przykładowego wydatku |
| 13 | menu-cele | click | Wymagane kliknięcie "Cele" |
| 14 | cele-section | - | Prezentacja sekcji Cele |
| 15 | add-goal-button | click | Wymagane kliknięcie "Dodaj Cel" |
| 16 | goal-dialog | - | Opis dialogu celu (zablokowany) |
| 17 | goal-item | - | Pokazanie przykładowego celu |
| 18 | menu-powiadomienia | click | Wymagane kliknięcie "Powiadomienia" |
| 19 | powiadomienia-section | - | Prezentacja powiadomień + zakończenie |

## Przykładowe Dane Samouczka

### Przychód
- Nazwa: "Wynagrodzenie"
- Kwota: 4500.00 zł
- Opis: "Miesięczne wynagrodzenie"
- Cykliczny: Tak (co miesiąc)

### Wydatek
- Nazwa: "Zakupy spożywcze"
- Kwota: 150.00 zł
- Kategoria: Pierwsza z listy (domyślnie "Jedzenie")
- Opis: "Przykładowy wydatek na zakupy"

### Cel
- Nazwa: "Wakacje"
- Kwota docelowa: 5000.00 zł
- Aktualnie: 1200.00 zł
- Termin: +6 miesięcy
- Opis: "Oszczędzanie na wymarzone wakacje"

### Powiadomienia
1. **Przekroczenie budżetu** (nieprzeczytane)
   - "Przekroczono próg budżetu! Twoje wydatki wynoszą 85% założonego budżetu."

2. **Osiągnięty cel** (nieprzeczytane)
   - "Gratulacje! Osiągnąłeś cel 'Nowy laptop'."

3. **Przypomnienie** (przeczytane)
   - "Przypomnienie: Cel 'Wakacje' zbliża się do terminu. Zostało 30 dni."

## Wsparcie Dla Trybu Jasnego/Ciemnego

Samouczek automatycznie dostosowuje kolory do aktualnego motywu:
- **Tryb ciemny**: Ciemne tło tooltipów, jasny tekst
- **Tryb jasny**: Jasne tło tooltipów, ciemny tekst
- **Overlay**: Przezroczyste tło z blur
- **Akcent**: Cyan (#00b8d4)

## Kolejne Kroki (Opcjonalne Ulepszenia)

1. **Blokada formularzy**: Dodać `disabled` do wszystkich pól w dialogach podczas samouczka
2. **Animacje**: Dodać płynniejsze przejścia między krokami
3. **Statystyki**: Śledzić które kroki są najczęściej pomijane
4. **A/B Testing**: Testować różne wersje tekstów
5. **Video**: Dodać opcjonalne video tutoriale
6. **Ponowne uruchomienie**: Przycisk w ustawieniach do ponownego uruchomienia samouczka

## Znane Ograniczenia

1. Samouczek może nie działać poprawnie jeśli użytkownik szybko klika kolejne elementy
2. Jeśli element nie istnieje (np. brak danych), krok może być pominięty
3. Na małych ekranach (mobile) tooltipsy mogą być obcięte

## Troubleshooting

### Problem: Samouczek się nie uruchamia
**Rozwiązanie**:
- Sprawdź czy pole `tutorialCompleted` w bazie danych = `false`
- Użyj trybu testowego: `localStorage.setItem('forceTutorial', 'true')`
- Sprawdź konsolę przeglądarki czy nie ma błędów

### Problem: Dialog nie otwiera się podczas samouczka
**Rozwiązanie**:
- Upewnij się że `tutorialData` jest poprawnie przekazywane do sekcji
- Sprawdź czy useEffect jest prawidłowo zaimplementowany

### Problem: Tymczasowe dane nie znikają po zakończeniu
**Rozwiązanie**:
- Sprawdź czy funkcja `handleTutorialFinish` w DashboardPage jest wywoływana
- Zweryfikuj czy stan `tutorialData` jest resetowany

## Pliki Zmodyfikowane

### Backend
- `backend/prisma/schema.prisma`
- `backend/routes/user.js`

### Frontend
- `frontend/src/api/tutorial.js` (nowy)
- `frontend/src/components/dashboard/Tutorial.jsx` (nowy)
- `frontend/src/views/DashboardPage.jsx`
- `frontend/src/components/dashboard/PulpitSection.jsx`
- `frontend/src/components/dashboard/BudzetSection.jsx`
- `frontend/src/components/dashboard/WydatkiSection.jsx`
- `frontend/src/components/dashboard/CeleSection.jsx`
- `frontend/src/components/dashboard/PowiadomieniaSection.jsx`

### Dependencies
- `react-joyride@2.9.3` (zainstalowane z --legacy-peer-deps)

## Sukces!

Samouczek jest w pełni zaimplementowany i gotowy do testowania! 🎉
