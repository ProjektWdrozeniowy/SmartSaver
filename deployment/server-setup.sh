#!/bin/bash

# ==========================================
# SmartSaver VPS Initial Setup Script
# ==========================================
# Ten skrypt automatyzuje początkową konfigurację serwera VPS
# Uruchom jako root lub user z sudo
# Usage: bash server-setup.sh

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "  $1"
    echo "=========================================="
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Sprawdź czy jesteśmy na Ubuntu
if [ ! -f /etc/os-release ]; then
    print_error "Nie można zidentyfikować systemu operacyjnego"
    exit 1
fi

. /etc/os-release
if [ "$ID" != "ubuntu" ]; then
    print_error "Ten skrypt jest przeznaczony dla Ubuntu"
    exit 1
fi

print_header "SmartSaver VPS Setup Script"
print_info "System: $PRETTY_NAME"
echo ""

# Zapytaj o domenę
read -p "Podaj domenę dla aplikacji (lub wciśnij Enter aby pominąć): " DOMAIN
if [ -z "$DOMAIN" ]; then
    print_info "Domena nie została podana - pominięto konfigurację SSL"
    USE_SSL=false
else
    USE_SSL=true
    print_info "Domena: $DOMAIN"
fi
echo ""

# Zapytaj o email dla SSL
if [ "$USE_SSL" = true ]; then
    read -p "Podaj email dla certyfikatu SSL: " SSL_EMAIL
    print_info "Email SSL: $SSL_EMAIL"
    echo ""
fi

# Zapytaj o hasło bazy danych
read -sp "Podaj hasło dla użytkownika bazy danych 'smartsaver_user': " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
    print_error "Hasło bazy danych nie może być puste"
    exit 1
fi
echo ""

# ==========================================
# 1. Aktualizacja systemu
# ==========================================
print_header "1. Aktualizacja systemu"
apt update
apt upgrade -y
print_success "System zaktualizowany"
echo ""

# ==========================================
# 2. Instalacja podstawowych narzędzi
# ==========================================
print_header "2. Instalacja podstawowych narzędzi"
apt install -y curl wget git build-essential ufw
print_success "Podstawowe narzędzia zainstalowane"
echo ""

# ==========================================
# 3. Konfiguracja firewall
# ==========================================
print_header "3. Konfiguracja firewall (UFW)"
ufw --force enable
ufw allow OpenSSH
ufw allow 'Nginx Full'
print_success "Firewall skonfigurowany"
ufw status
echo ""

# ==========================================
# 4. Instalacja Node.js
# ==========================================
print_header "4. Instalacja Node.js 20.x LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js $NODE_VERSION zainstalowany"
print_success "npm $NPM_VERSION zainstalowany"
echo ""

# ==========================================
# 5. Instalacja MySQL
# ==========================================
print_header "5. Instalacja MySQL Server"
apt install -y mysql-server

# Uruchom MySQL
systemctl start mysql
systemctl enable mysql

# Konfiguracja bazy danych
print_info "Konfiguracja bazy danych..."
mysql -u root <<EOF
-- Usuń anonymous users
DELETE FROM mysql.user WHERE User='';
-- Nie zezwalaj na zdalne logowanie root
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
-- Usuń testową bazę danych
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
-- Utwórz bazę danych dla SmartSaver
CREATE DATABASE IF NOT EXISTS smartsaver CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Utwórz użytkownika
CREATE USER IF NOT EXISTS 'smartsaver_user'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
-- Nadaj uprawnienia
GRANT ALL PRIVILEGES ON smartsaver.* TO 'smartsaver_user'@'localhost';
-- Zastosuj zmiany
FLUSH PRIVILEGES;
EOF

print_success "MySQL zainstalowany i skonfigurowany"
print_success "Baza danych 'smartsaver' utworzona"
print_success "Użytkownik 'smartsaver_user' utworzony"
echo ""

# ==========================================
# 6. Instalacja Nginx
# ==========================================
print_header "6. Instalacja Nginx"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx zainstalowany i uruchomiony"
echo ""

# ==========================================
# 7. Instalacja PM2
# ==========================================
print_header "7. Instalacja PM2"
npm install -g pm2
PM2_VERSION=$(pm2 --version)
print_success "PM2 $PM2_VERSION zainstalowany globalnie"
echo ""

# ==========================================
# 8. Instalacja Certbot (jeśli podano domenę)
# ==========================================
if [ "$USE_SSL" = true ]; then
    print_header "8. Instalacja Certbot"
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot zainstalowany"
    echo ""
else
    print_info "Pominięto instalację Certbot (brak domeny)"
    echo ""
fi

# ==========================================
# 9. Utworzenie użytkownika deploy (opcjonalne)
# ==========================================
print_header "9. Konfiguracja użytkownika"
if id "deploy" &>/dev/null; then
    print_info "Użytkownik 'deploy' już istnieje"
else
    read -p "Czy utworzyć użytkownika 'deploy'? (t/n): " CREATE_USER
    if [ "$CREATE_USER" = "t" ] || [ "$CREATE_USER" = "T" ]; then
        adduser --disabled-password --gecos "" deploy
        usermod -aG sudo deploy
        print_success "Użytkownik 'deploy' utworzony"

        # Skopiuj klucze SSH
        if [ -d /root/.ssh ]; then
            mkdir -p /home/deploy/.ssh
            cp /root/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || true
            chown -R deploy:deploy /home/deploy/.ssh
            chmod 700 /home/deploy/.ssh
            chmod 600 /home/deploy/.ssh/authorized_keys 2>/dev/null || true
            print_success "Klucze SSH skopiowane"
        fi
    else
        print_info "Pominięto tworzenie użytkownika 'deploy'"
    fi
fi
echo ""

# ==========================================
# 10. Podsumowanie
# ==========================================
print_header "Instalacja zakończona!"
echo ""
print_success "Zainstalowane komponenty:"
echo "  • Node.js: $NODE_VERSION"
echo "  • npm: $NPM_VERSION"
echo "  • PM2: $PM2_VERSION"
echo "  • MySQL Server"
echo "  • Nginx"
echo "  • UFW Firewall"
if [ "$USE_SSL" = true ]; then
    echo "  • Certbot"
fi
echo ""

print_info "Dane dostępowe bazy danych:"
echo "  Database: smartsaver"
echo "  User: smartsaver_user"
echo "  Password: [ustawione podczas instalacji]"
echo ""

print_info "Następne kroki:"
echo ""
echo "1. Zaloguj się jako użytkownik 'deploy' (jeśli utworzony):"
echo "   su - deploy"
echo ""
echo "2. Sklonuj repozytorium:"
echo "   git clone https://github.com/ProjektWdrozeniowy/SmartSaver.git"
echo "   cd SmartSaver"
echo ""
echo "3. Zainstaluj zależności:"
echo "   npm install && npm run install:all"
echo ""
echo "4. Skonfiguruj zmienne środowiskowe:"
echo "   cd backend"
echo "   cp ../deployment/.env.production.example .env"
echo "   nano .env"
echo ""
echo "   Wygeneruj JWT_SECRET:"
echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo ""
echo "5. Wykonaj migracje bazy danych:"
echo "   npx prisma migrate deploy"
echo ""
echo "6. Zbuduj frontend:"
echo "   cd ../frontend"
echo "   npm run build"
echo ""
echo "7. Skonfiguruj Nginx:"
echo "   sudo cp ~/SmartSaver/deployment/nginx.conf /etc/nginx/sites-available/smartsaver"
if [ "$USE_SSL" = true ]; then
    echo "   sudo nano /etc/nginx/sites-available/smartsaver  # zmień 'twoja-domena.com' na '$DOMAIN'"
fi
echo "   sudo ln -s /etc/nginx/sites-available/smartsaver /etc/nginx/sites-enabled/"
echo "   sudo rm /etc/nginx/sites-enabled/default"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""

if [ "$USE_SSL" = true ]; then
    echo "8. Uzyskaj certyfikat SSL:"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo ""
    echo "9. Uruchom aplikację:"
else
    echo "8. Uruchom aplikację:"
fi
echo "   cd ~/SmartSaver/backend"
echo "   pm2 start server.js --name smartsaver-backend"
echo "   pm2 save"
echo "   pm2 startup  # i wykonaj pokazaną komendę"
echo ""

print_success "Konfiguracja serwera zakończona!"
print_info "Szczegółowe instrukcje znajdziesz w: ~/SmartSaver/deployment/VPS_SETUP_GUIDE.md"
