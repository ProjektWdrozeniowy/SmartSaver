# Przewodnik Testowania Samouczka SmartSaver

## Status Serwerów

✅ **Backend**: http://localhost:4000
✅ **Frontend**: http://localhost:5176

## Szybki Test - Tryb Deweloperski

### Krok 1: Otwórz aplikację
1. Otwórz przeglądarkę
2. Przejdź do: http://localhost:5176
3. Zaloguj się na istniejące konto

### Krok 2: Aktywuj tryb testowy samouczka
1. Naciśnij F12 (otwórz DevTools)
2. Przejdź do zakładki "Console"
3. Wpisz i wykonaj:
   ```javascript
   localStorage.setItem('forceTutorial', 'true');
   ```
4. Odśwież stronę (F5)

### Krok 3: Testuj samouczek
Samouczek powinien się automatycznie uruchomić. Przejdź przez wszystkie kroki:

#### ✅ Krok 1: Popup powitalny
- [ ] Pojawia się pytanie "Czy chcesz przejść samouczek?"
- [ ] Przyciski: "Nie, dziękuję" i "Tak, zacznijmy!"
- [ ] Kliknij "Tak, zacznijmy!"

#### ✅ Krok 2: Sekcja Pulpit
- [ ] Tooltip pokazuje się nad sekcją Pulpit
- [ ] Tekst opisuje co znajduje się w sekcji
- [ ] Kliknij "Dalej"

#### ✅ Krok 3-7: Sekcja Budżet
- [ ] **Krok 3**: Tooltip wskazuje przycisk "Budżet" w menu
- [ ] Musisz kliknąć "Budżet" (spotlight na przycisku)
- [ ] **Krok 4**: Tooltip opisuje sekcję Budżet
- [ ] **Krok 5**: Tooltip wskazuje przycisk "Dodaj przychód"
- [ ] Musisz kliknąć "Dodaj przychód"
- [ ] **Krok 6**: Dialog się otwiera, formularz jest zablokowany
  - Nazwa: "Wynagrodzenie"
  - Kwota: "4500.00"
  - Opis: "Miesięczne wynagrodzenie"
  - Cykliczny: TAK
- [ ] Kliknij "Dalej" (dialog się zamyka)
- [ ] **Krok 7**: Pokazuje przykładowy przychód na liście

#### ✅ Krok 8-12: Sekcja Wydatki
- [ ] **Krok 8**: Tooltip wskazuje przycisk "Wydatki" w menu
- [ ] Musisz kliknąć "Wydatki"
- [ ] **Krok 9**: Tooltip opisuje sekcję Wydatki
- [ ] **Krok 10**: Tooltip wskazuje przycisk "Dodaj wydatek"
- [ ] Musisz kliknąć "Dodaj wydatek"
- [ ] **Krok 11**: Dialog się otwiera, formularz jest zablokowany
  - Nazwa: "Zakupy spożywcze"
  - Kwota: "150.00"
  - Kategoria: Pierwsza z listy
  - Opis: "Przykładowy wydatek na zakupy"
- [ ] Kliknij "Dalej" (dialog się zamyka)
- [ ] **Krok 12**: Pokazuje przykładowy wydatek na liście

#### ✅ Krok 13-17: Sekcja Cele
- [ ] **Krok 13**: Tooltip wskazuje przycisk "Cele" w menu
- [ ] Musisz kliknąć "Cele"
- [ ] **Krok 14**: Tooltip opisuje sekcję Cele
- [ ] **Krok 15**: Tooltip wskazuje przycisk "Dodaj Cel"
- [ ] Musisz kliknąć "Dodaj Cel"
- [ ] **Krok 16**: Dialog się otwiera, formularz jest zablokowany
  - Nazwa: "Wakacje"
  - Kwota docelowa: "5000.00"
  - Aktualnie: "1200.00"
  - Opis: "Oszczędzanie na wymarzone wakacje"
- [ ] Kliknij "Dalej" (dialog się zamyka)
- [ ] **Krok 17**: Pokazuje przykładowy cel z paskiem postępu (24%)

#### ✅ Krok 18-19: Sekcja Powiadomienia
- [ ] **Krok 18**: Tooltip wskazuje przycisk "Powiadomienia" w menu
- [ ] Musisz kliknąć "Powiadomienia"
- [ ] **Krok 19**: Pokazuje 3 przykładowe powiadomienia:
  1. Przekroczenie budżetu (nieprzeczytane)
  2. Osiągnięty cel (nieprzeczytane)
  3. Przypomnienie (przeczytane)
- [ ] Kliknij "Zakończ"

#### ✅ Po zakończeniu
- [ ] Wszystkie przykładowe dane znikają
- [ ] Flaga `forceTutorial` jest usunięta z localStorage
- [ ] Status w bazie: `tutorialCompleted = true`
- [ ] Odśwież stronę - samouczek nie uruchamia się ponownie

## Test Pełny - Nowy Użytkownik

### Krok 1: Rejestracja
1. Przejdź do: http://localhost:5176
2. Kliknij "Zarejestruj się"
3. Wypełnij formularz:
   - Username: testuser_tutorial
   - Email: tutorial@test.pl
   - Hasło: Test123!@#$%
4. Zarejestruj się

### Krok 2: Automatyczne uruchomienie
- [ ] Po zalogowaniu samouczek uruchamia się automatycznie
- [ ] Przejdź przez wszystkie kroki (patrz test powyżej)

### Krok 3: Weryfikacja
1. Ukończ samouczek
2. Wyloguj się
3. Zaloguj ponownie
- [ ] Samouczek NIE uruchamia się ponownie

## Testowanie Wizualne

### Tryb Jasny
1. W aplikacji zmień motyw na jasny (ikona słońca)
2. Uruchom samouczek (tryb testowy)
3. Sprawdź:
- [ ] Tooltipsy mają jasne tło
- [ ] Tekst jest ciemny i czytelny
- [ ] Overlay jest przezroczysty z blur
- [ ] Przyciski są dobrze widoczne

### Tryb Ciemny
1. W aplikacji zmień motyw na ciemny (ikona księżyca)
2. Uruchom samouczek (tryb testowy)
3. Sprawdź:
- [ ] Tooltipsy mają ciemne tło
- [ ] Tekst jest jasny i czytelny
- [ ] Overlay jest przezroczysty z blur
- [ ] Przyciski są dobrze widoczne

## Testowanie Funkcjonalności

### Test 1: Przerwanie samouczka
1. Uruchom samouczek
2. W dowolnym momencie kliknij "Pomiń"
3. Sprawdź:
- [ ] Samouczek się zamyka
- [ ] Tymczasowe dane znikają
- [ ] Status: `tutorialCompleted = true`

### Test 2: Zamknięcie dialogu
1. Uruchom samouczek
2. Dojdź do kroku z dialogiem (np. Dodaj przychód)
3. Spróbuj zamknąć dialog klikając poza nim
4. Sprawdź:
- [ ] Dialog nie zamyka się podczas samouczka
- [ ] Można przejść dalej tylko przyciskiem "Dalej"

### Test 3: Wielokrotne testowanie
1. Ustaw: `localStorage.setItem('forceTutorial', 'true')`
2. Odśwież stronę - samouczek się uruchamia
3. Ukończ samouczek
4. Odśwież stronę - samouczek NIE uruchamia się
5. Ustaw ponownie: `localStorage.setItem('forceTutorial', 'true')`
6. Odśwież stronę - samouczek się uruchamia ponownie
7. Sprawdź:
- [ ] Tryb testowy działa wielokrotnie
- [ ] Po każdym ukończeniu flaga jest usuwana

## Testowanie Błędów

### Scenariusz 1: Brak kategorii
1. W bazie danych usuń wszystkie kategorie użytkownika
2. Uruchom samouczek
3. Dojdź do kroku "Dodaj wydatek"
4. Sprawdź:
- [ ] Wydatek używa domyślnej kategorii
- [ ] Nie ma błędów w konsoli

### Scenariusz 2: Błąd API
1. Zatrzymaj backend
2. Uruchom samouczek (tryb testowy)
3. Sprawdź:
- [ ] Samouczek działa (używa localStorage)
- [ ] Brak błędów blokujących

### Scenariusz 3: Brak połączenia z bazą
1. Zatrzymaj bazę danych MySQL
2. Uruchom aplikację
3. Spróbuj zalogować się
4. Sprawdź:
- [ ] Pojawia się komunikat o błędzie
- [ ] Aplikacja nie się nie zawiesza

## Sprawdzenie Bazy Danych

### Krok 1: Sprawdź strukturę
```sql
DESCRIBE accounts;
```
- [ ] Pole `tutorialCompleted` istnieje
- [ ] Typ: BOOLEAN
- [ ] Domyślna wartość: FALSE

### Krok 2: Sprawdź dane
```sql
SELECT id, username, email, tutorialCompleted FROM accounts;
```
- [ ] Nowi użytkownicy mają `tutorialCompleted = 0`
- [ ] Po ukończeniu samouczka: `tutorialCompleted = 1`

### Krok 3: Test API
```bash
# Sprawdź status (wymaga tokenu autoryzacji)
curl -X GET http://localhost:4000/api/user/tutorial-status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Oznacz jako ukończony
curl -X PUT http://localhost:4000/api/user/complete-tutorial \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Znane Problemy i Rozwiązania

### Problem: Samouczek nie uruchamia się
**Rozwiązanie**:
1. Sprawdź konsolę przeglądarki (F12) - szukaj błędów
2. Sprawdź czy backend działa (http://localhost:4000)
3. Sprawdź czy pole `tutorialCompleted` istnieje w bazie
4. Użyj trybu testowego: `localStorage.setItem('forceTutorial', 'true')`

### Problem: Dialog nie otwiera się
**Rozwiązanie**:
1. Sprawdź konsolę - szukaj błędów
2. Sprawdź czy `tutorialData` jest przekazywane do komponentu
3. Sprawdź czy useEffect w sekcji jest prawidłowo zaimplementowany

### Problem: Przykładowe dane nie znikają
**Rozwiązanie**:
1. Sprawdź czy funkcja `handleTutorialFinish` jest wywoływana
2. Sprawdź czy stan `tutorialData` jest resetowany
3. Odśwież stronę ręcznie

### Problem: Tooltip nie pokazuje się nad elementem
**Rozwiązanie**:
1. Sprawdź czy element ma atrybut `data-tour`
2. Sprawdź czy element jest widoczny w DOM
3. Spróbuj przewinąć stronę do elementu

## Podsumowanie Testu

Po zakończeniu testów, zaznacz poniższe:

- [ ] ✅ Samouczek uruchamia się automatycznie dla nowych użytkowników
- [ ] ✅ Tryb testowy działa poprawnie
- [ ] ✅ Wszystkie 19 kroków działają
- [ ] ✅ Nawigacja między sekcjami działa
- [ ] ✅ Przykładowe dane są wyświetlane
- [ ] ✅ Przykładowe dane znikają po zakończeniu
- [ ] ✅ Status jest zapisywany w bazie danych
- [ ] ✅ Samouczek nie uruchamia się ponownie
- [ ] ✅ Wsparcie dla trybu jasnego/ciemnego
- [ ] ✅ Opcja "Pomiń" działa
- [ ] ✅ Brak błędów w konsoli

## Gotowe do produkcji!

Jeśli wszystkie testy przeszły pomyślnie, samouczek jest gotowy do wdrożenia! 🎉

---

**Data testów**: 2025-11-27
**Tester**: _____________
**Wersja aplikacji**: 1.0.0
**Status**: [ ] Zaliczony [ ] Niezaliczony
