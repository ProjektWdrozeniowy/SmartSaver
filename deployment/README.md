# Deployment - Wdrożenie SmartSaver na VPS

Ten katalog zawiera wszystkie niezbędne pliki i dokumentację do wdrożenia aplikacji SmartSaver na serwerze VPS.

## Spis treści

1. [Przegląd plików](#przegląd-plików)
2. [Szybki start](#szybki-start)
3. [Dokumentacja](#dokumentacja)
4. [Skrypty](#skrypty)
5. [Pliki konfiguracyjne](#pliki-konfiguracyjne)

---

## Przegląd plików

### 📚 Dokumentacja

| Plik | Opis |
|------|------|
| **VPS_SETUP_GUIDE.md** | Kompletny przewodnik konfiguracji VPS krok po kroku |
| **QUICK_START.md** | Skrócona wersja przewodnika - szybki setup w 45 minut |
| **CODE_CHANGES_FOR_PRODUCTION.md** | **⚠️ WYMAGANE zmiany w kodzie** dla produkcji |
| **CHECKLIST.md** | Lista kontrolna wdrożenia - upewnij się, że nic nie pominąłeś |
| **TROUBLESHOOTING.md** | Rozwiązania najczęstszych problemów podczas wdrożenia |
| **README.md** | Ten plik - przegląd katalogu deployment |

### 🔧 Skrypty

| Plik | Opis | Użycie |
|------|------|--------|
| **server-setup.sh** | Automatyczny setup serwera VPS | `sudo bash server-setup.sh` |
| **deploy.sh** | Skrypt do aktualizacji aplikacji | `./deploy.sh` |
| **backup.sh** | Backup bazy danych MySQL | `./backup.sh` |

### ⚙️ Pliki konfiguracyjne

| Plik | Opis | Miejsce docelowe |
|------|------|------------------|
| **nginx.conf** | Konfiguracja Nginx z SSL/HTTPS (dla domeny) | `/etc/nginx/sites-available/smartsaver` |
| **nginx-no-ssl.conf** | Konfiguracja Nginx bez SSL (dla samego IP) | `/etc/nginx/sites-available/smartsaver` |
| **.env.production.example** | Przykładowy plik zmiennych środowiskowych | `backend/.env` |
| **ecosystem.config.js** | Zaawansowana konfiguracja PM2 | Katalog główny projektu |

---

## ⚠️ WYMAGANE: Zmiany w kodzie przed wdrożeniem

**WAŻNE:** Przed wdrożeniem na VPS musisz wprowadzić zmiany w kodzie!

1. **Frontend** - usuń hardcoded `localhost:4000`
2. **Backend** - popraw CORS
3. **Prisma** - commitnij migracje

**Szczegóły:** [CODE_CHANGES_FOR_PRODUCTION.md](./CODE_CHANGES_FOR_PRODUCTION.md) ⭐

---

## Szybki start

### Nowy serwer VPS (od zera)

Jeśli masz świeży serwer VPS i chcesz szybko go skonfigurować:

1. Skopiuj `server-setup.sh` na serwer:
   ```bash
   scp deployment/server-setup.sh user@your-server-ip:~/
   ```

2. Zaloguj się na serwer i uruchom:
   ```bash
   ssh user@your-server-ip
   sudo bash server-setup.sh
   ```

3. Postępuj zgodnie z instrukcjami skryptu

4. Po zakończeniu setupu, wykonaj kroki z [QUICK_START.md](./QUICK_START.md) zaczynając od kroku 6

### Mam już skonfigurowany serwer

Jeśli masz już zainstalowane Node.js, MySQL, Nginx:

1. Przejdź do [QUICK_START.md](./QUICK_START.md)
2. Lub użyj szczegółowego [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md)

---

## Dokumentacja

### [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md)

**Dla kogo:** Wszyscy, zwłaszcza początkujący

**Co zawiera:**
- Kompletny przewodnik krok po kroku
- Wyjaśnienia każdego kroku
- Komendy z opisami
- Rozwiązywanie problemów
- Bezpieczeństwo i best practices
- Monitoring i utrzymanie

**Czas:** ~90-120 minut

### [QUICK_START.md](./QUICK_START.md)

**Dla kogo:** Osoby z doświadczeniem w administracji serwerami

**Co zawiera:**
- Skrócona wersja setupu
- Same komendy bez długich wyjaśnień
- Przydatne skróty

**Czas:** ~45 minut

### [CHECKLIST.md](./CHECKLIST.md)

**Dla kogo:** Wszyscy (do weryfikacji)

**Co zawiera:**
- Kompletna lista kontrolna wdrożenia
- Punkty do zaznaczenia
- Weryfikacja każdego kroku
- Lista informacji do zapisania

**Użycie:** Użyj podczas lub po wdrożeniu, aby upewnić się, że nic nie zostało pominięte

---

## Skrypty

### server-setup.sh

**Automatyczny setup serwera VPS**

Instaluje i konfiguruje wszystkie wymagane komponenty:
- Node.js 20.x LTS
- MySQL Server
- Nginx
- PM2
- Firewall (UFW)
- Opcjonalnie: użytkownik 'deploy', Certbot

**Użycie:**
```bash
# Na serwerze VPS (jako root lub sudo user)
sudo bash server-setup.sh
```

**Interaktywny:** Skrypt zapyta o:
- Domenę (opcjonalnie)
- Email dla SSL (jeśli podano domenę)
- Hasło bazy danych MySQL
- Czy utworzyć użytkownika 'deploy'

### deploy.sh

**Automatyczna aktualizacja aplikacji**

Wykonuje pełny deployment update:
- Pobiera najnowszy kod z Git
- Instaluje/aktualizuje zależności
- Wykonuje migracje bazy danych
- Buduje frontend
- Restartuje backend
- Przeładowuje Nginx

**Użycie:**
```bash
cd ~/SmartSaver
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

**Idealny do:** Regularne aktualizacje po zmianach w kodzie

### backup.sh

**Backup bazy danych MySQL**

Tworzy backup bazy danych:
- Eksportuje bazę danych do pliku SQL
- Kompresuje backup (gzip)
- Usuwa stare backupy (domyślnie: starsze niż 30 dni)
- Zapisuje w `~/backups/`

**Użycie:**
```bash
chmod +x deployment/backup.sh
./deployment/backup.sh
```

**Automatyzacja przez cron:**
```bash
crontab -e
# Dodaj linię (backup codziennie o 2:00):
0 2 * * * /home/deploy/SmartSaver/deployment/backup.sh
```

---

## Pliki konfiguracyjne

### nginx.conf

**Konfiguracja Nginx**

Zawiera:
- Przekierowanie HTTP -> HTTPS
- Reverse proxy dla API (localhost:4000)
- Serwowanie statycznych plików frontendu
- Konfigurację SSL (do uzupełnienia przez Certbot)
- Security headers
- Optymalizacje (gzip, caching)

**Instalacja:**
```bash
sudo cp deployment/nginx.conf /etc/nginx/sites-available/smartsaver
sudo nano /etc/nginx/sites-available/smartsaver  # Zamień "twoja-domena.com"
sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### .env.production.example

**Przykładowy plik zmiennych środowiskowych**

Zawiera wszystkie wymagane zmienne dla produkcji z opisami.

**Instalacja:**
```bash
cd ~/SmartSaver/backend
cp ../deployment/.env.production.example .env
nano .env  # Zaktualizuj wartości
```

**WAŻNE:**
- Wygeneruj nowy `JWT_SECRET`
- Użyj silnych haseł
- Zaktualizuj domenę w `APP_ORIGIN` i `FRONTEND_BASE_URL`

### ecosystem.config.js

**Zaawansowana konfiguracja PM2**

Zawiera:
- Definicję aplikacji dla PM2
- Ustawienia restartu i logów
- Opcjonalnie: konfigurację PM2 deploy

**Użycie:**
```bash
# Podstawowe użycie (opcjonalne - można używać prostego pm2 start)
pm2 start deployment/ecosystem.config.js

# Lub standardowo
pm2 start backend/server.js --name smartsaver-backend
```

---

## Architektura wdrożenia

```
Internet
   |
   | HTTPS (443)
   v
[Nginx]
   |
   |---> /api/* -----> [PM2] ---> [Node.js Backend:4000]
   |                               |
   |                               v
   |                         [MySQL:3306]
   |
   |---> /* ---------> [Static Files: frontend/dist]
```

### Komponenty

1. **Nginx** - Web server i reverse proxy
   - Serwuje statyczne pliki frontendu
   - Przekierowuje requesty `/api/*` do backendu
   - Obsługuje SSL/TLS

2. **PM2** - Process manager
   - Zarządza procesem Node.js
   - Automatyczne restarty
   - Logi i monitoring

3. **Node.js Backend** - Express API
   - Port 4000 (localhost)
   - Obsługa API requests
   - Połączenie z bazą danych

4. **MySQL** - Baza danych
   - Port 3306 (localhost)
   - Przechowuje dane aplikacji

5. **Frontend** - React SPA
   - Statyczne pliki w `frontend/dist`
   - Serwowane przez Nginx

---

## Wymagania systemowe

### Minimalne

- **OS:** Ubuntu 22.04 LTS
- **RAM:** 1 GB
- **CPU:** 1 vCore
- **Disk:** 20 GB SSD
- **Bandwidth:** 1 TB/miesiąc

### Zalecane (dla produkcji)

- **OS:** Ubuntu 22.04 LTS
- **RAM:** 2 GB
- **CPU:** 2 vCores
- **Disk:** 40 GB SSD
- **Bandwidth:** Nielimitowany
- **Backup:** Automatyczne backupy

---

## Środowiska

### Development (Lokalnie)

```bash
# Frontend: http://localhost:5173
# Backend: http://localhost:4000
# Database: localhost:3306

npm run dev  # Uruchamia frontend i backend
```

### Production (VPS)

```bash
# Frontend i Backend: https://twoja-domena.com
# Backend API: https://twoja-domena.com/api/*
# Database: localhost:3306 (niedostępny z zewnątrz)

pm2 start backend/server.js --name smartsaver-backend
```

---

## Wsparcie i troubleshooting

### Problemy podczas wdrożenia?

1. **Sprawdź [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - rozwiązania najczęstszych problemów
2. Sprawdź [VPS_SETUP_GUIDE.md](./VPS_SETUP_GUIDE.md) - sekcja "Rozwiązywanie problemów"
3. Przejrzyj [CHECKLIST.md](./CHECKLIST.md) - upewnij się, że wszystko zostało wykonane
4. Sprawdź logi:
   ```bash
   pm2 logs smartsaver-backend
   sudo tail -f /var/log/nginx/smartsaver_error.log
   ```

### Częste problemy

| Problem | Rozwiązanie | Szczegóły |
|---------|-------------|-----------|
| Backend status "errored" | Sprawdź `pm2 logs` - prawdopodobnie Prisma Client nie wygenerowany | [TROUBLESHOOTING.md#1](./TROUBLESHOOTING.md#1-backend-crashuje---status-errored) |
| DATABASE_URL invalid | Sprawdź format i zakoduj znaki specjalne w haśle | [TROUBLESHOOTING.md#2](./TROUBLESHOOTING.md#2-błąd-database_url) |
| 502 Bad Gateway | Backend nie działa - sprawdź `pm2 status` i `pm2 logs` | [TROUBLESHOOTING.md#4](./TROUBLESHOOTING.md#4-502-bad-gateway) |
| CORS errors | Zaktualizuj `APP_ORIGIN` w `.env` | [TROUBLESHOOTING.md#5](./TROUBLESHOOTING.md#5-cors-errors) |
| Warning przy buildzie | To nie błąd - aplikacja działa poprawnie | [TROUBLESHOOTING.md#7](./TROUBLESHOOTING.md#7-warning-przy-buildzie-frontendu) |

### Dodatkowa pomoc

- GitHub Issues: https://github.com/ProjektWdrozeniowy/SmartSaver/issues
- Dokumentacja Nginx: https://nginx.org/en/docs/
- Dokumentacja PM2: https://pm2.keymetrics.io/docs/
- Dokumentacja Prisma: https://www.prisma.io/docs/

---

## Aktualizacje i utrzymanie

### Regularne zadania

**Dziennie:**
- Sprawdzanie logów: `pm2 logs`
- Monitoring zasobów: `pm2 monit`

**Co tydzień:**
- Sprawdzanie backupów: `ls -lh ~/backups/`
- Aktualizacje bezpieczeństwa: `sudo apt update && sudo apt upgrade`

**Co miesiąc:**
- Sprawdzanie miejsca na dysku: `df -h`
- Czyszczenie starych logów
- Weryfikacja certyfikatów SSL

### Aktualizacja aplikacji

```bash
cd ~/SmartSaver
./deployment/deploy.sh
```

Lub manualnie:
```bash
git pull
npm install && npm run install:all
cd backend && npx prisma migrate deploy
cd ../frontend && npm run build
pm2 restart smartsaver-backend
```

---

## Best Practices

- ✅ Używaj silnych haseł (baza danych, JWT_SECRET)
- ✅ Regularnie wykonuj backupy bazy danych
- ✅ Monitoruj logi aplikacji i serwera
- ✅ Aktualizuj system i zależności
- ✅ Używaj HTTPS (SSL/TLS)
- ✅ Ograniczaj dostęp przez firewall
- ✅ Nigdy nie commituj pliku `.env` do Git
- ✅ Testuj zmiany przed wdrożeniem na produkcję
- ✅ Dokumentuj zmiany i konfiguracje
- ✅ Miej plan disaster recovery

---

## Bezpieczeństwo

### Checklist bezpieczeństwa

- [ ] Firewall (UFW) włączony i skonfigurowany
- [ ] SSH tylko na kluczach (wyłącz password auth)
- [ ] MySQL tylko localhost (brak zdalnego dostępu)
- [ ] Silne hasła wszędzie
- [ ] JWT_SECRET unikalny i losowy
- [ ] HTTPS włączony (SSL/TLS)
- [ ] Security headers w Nginx
- [ ] Rate limiting w backend
- [ ] Regularne aktualizacje systemu
- [ ] Fail2ban (opcjonalnie)
- [ ] Monitoring logów

---

## Licencja i kontakt

Projekt: SmartSaver
Repozytorium: https://github.com/ProjektWdrozeniowy/SmartSaver

W przypadku pytań lub problemów, otwórz issue na GitHubie.

---

**Powodzenia z wdrożeniem! 🚀**
