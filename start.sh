#!/bin/sh

# Démarrer PHP-FPM pour Adminer
php-fpm82 &

# Démarrer Nginx
nginx

# Démarrer le backend
NODE_ENV=production PORT=${PORT} pnpm start