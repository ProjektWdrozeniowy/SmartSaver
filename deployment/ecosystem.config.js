// PM2 Ecosystem Configuration
// Ten plik definiuje konfigurację PM2 dla aplikacji SmartSaver

module.exports = {
  apps: [
    {
      name: 'smartsaver-backend',
      script: './server.js',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '~/.pm2/logs/smartsaver-error.log',
      out_file: '~/.pm2/logs/smartsaver-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Opcje restartu w przypadku błędów
      min_uptime: '10s',
      max_restarts: 10,

      // Graceful restart/reload
      kill_timeout: 5000,
      wait_ready: false,
      listen_timeout: 3000,
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'TWÓJ_IP_SERWERA',
      ref: 'origin/main',
      repo: 'https://github.com/ProjektWdrozeniowy/SmartSaver.git',
      path: '/home/deploy/SmartSaver',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run install:all && cd backend && npx prisma migrate deploy && cd ../frontend && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
