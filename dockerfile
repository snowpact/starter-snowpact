# Étape de construction pour le backend
FROM node:20-alpine AS backend-build

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

COPY backend ./
RUN pnpm install

RUN pnpm build

# Image finale
FROM node:20-alpine

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier les fichiers construits du backend
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/package.json ./
RUN pnpm install --only=production

# Installer PHP et PHP-FPM
RUN apk add --no-cache php82 php82-fpm php82-pgsql php82-session
RUN sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php82/php.ini

# Installer Adminer
RUN mkdir -p /var/www/html
RUN wget -O /var/www/html/adminer.php https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1-en.php

# Installer un serveur web léger pour Adminer et l'API
RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Script de démarrage
COPY start.sh /start.sh
RUN chmod +x /start.sh

# N'exposer qu'un seul port
EXPOSE ${PORT}

CMD ["/start.sh"]