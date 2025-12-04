#!/bin/bash

# ==========================================
# SmartSaver Database Backup Script
# ==========================================
# Automatyczny backup bazy danych MySQL

set -e

# Konfiguracja
DB_USER="smartsaver_user"
DB_NAME="smartsaver"
BACKUP_DIR="$HOME/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/smartsaver_$DATE.sql"
RETENTION_DAYS=30  # Liczba dni przechowywania backupów

# Kolory
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Utwórz katalog backupów jeśli nie istnieje
mkdir -p "$BACKUP_DIR"

echo "=========================================="
echo "  SmartSaver Database Backup"
echo "=========================================="
echo "Data: $(date)"
echo ""

# Wykonaj backup
echo "Tworzę backup bazy danych..."
if mysqldump -u "$DB_USER" -p "$DB_NAME" > "$BACKUP_FILE"; then
    print_success "Backup utworzony: $BACKUP_FILE"

    # Kompresja backupu
    echo "Kompresuję backup..."
    gzip "$BACKUP_FILE"
    print_success "Backup skompresowany: ${BACKUP_FILE}.gz"

    # Wyświetl rozmiar
    SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    echo "Rozmiar: $SIZE"
else
    print_error "Błąd podczas tworzenia backupu"
    exit 1
fi

echo ""

# Usuń stare backupy
echo "Usuwam stare backupy (starsze niż $RETENTION_DAYS dni)..."
find "$BACKUP_DIR" -name "smartsaver_*.sql.gz" -mtime +$RETENTION_DAYS -delete
print_success "Stare backupy usunięte"

echo ""
print_success "Backup zakończony pomyślnie!"

# Wyświetl listę ostatnich backupów
echo ""
echo "Ostatnie 5 backupów:"
ls -lht "$BACKUP_DIR"/smartsaver_*.sql.gz | head -5
