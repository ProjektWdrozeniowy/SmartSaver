#!/bin/bash

# ==========================================
# SmartSaver Deployment Script
# ==========================================
# Ten skrypt automatyzuje proces wdrażania aplikacji SmartSaver
# Uruchom na serwerze VPS po wykonaniu wstępnej konfiguracji

set -e  # Zatrzymaj skrypt przy pierwszym błędzie

echo "=========================================="
echo "  SmartSaver Deployment Script"
echo "=========================================="
echo ""

# Kolory do outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funkcje pomocnicze
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Sprawdź czy jesteśmy w odpowiednim katalogu
if [ ! -f "package.json" ]; then
    print_error "Nie znaleziono package.json. Upewnij się, że jesteś w katalogu SmartSaver"
    exit 1
fi

print_info "Rozpoczynam deployment..."
echo ""

# 1. Pobierz najnowsze zmiany z repozytorium
print_info "Pobieranie najnowszych zmian z Git..."
git pull origin main
print_success "Kod zaktualizowany"
echo ""

# 2. Instalacja/aktualizacja zależności
print_info "Instalowanie zależności..."
npm install
npm run install:all
print_success "Zależności zainstalowane"
echo ""

# 3. Migracje bazy danych
print_info "Wykonywanie migracji bazy danych..."
cd backend
npx prisma migrate deploy
print_success "Migracje wykonane"
echo ""

# 4. Build frontendu
print_info "Budowanie frontendu..."
cd ../frontend
npm run build
print_success "Frontend zbudowany"
echo ""

# 5. Restart backendu
print_info "Restartowanie aplikacji backend..."
pm2 restart smartsaver-backend
print_success "Backend zrestartowany"
echo ""

# 6. Sprawdź status
print_info "Sprawdzanie statusu aplikacji..."
pm2 status
echo ""

# 7. Reload Nginx (opcjonalnie)
if command -v nginx &> /dev/null; then
    print_info "Przeładowywanie Nginx..."
    sudo systemctl reload nginx
    print_success "Nginx przeładowany"
else
    print_info "Nginx nie znaleziony, pomijam..."
fi

echo ""
print_success "Deployment zakończony pomyślnie!"
print_info "Sprawdź logi aplikacji: pm2 logs smartsaver-backend"
echo ""
