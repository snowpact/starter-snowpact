## Prérequis

- `Docker`
- `pnpm` version `8.10.2`
  - `npm install -g pnpm`
- `bruno`
  - https://www.usebruno.com/

## Initialisation

Assurez-vous d'avoir votre **docker** de lancé puis exécutez :

```bash
pnpm install # installer les dépendances
pnpm start:database # lance les containers de base de données
pnpm migration:run # migre la base de données
# pnpm fixtures:load # TODO charge les fixtures, EN COURS
```

### Paramétrage de bruno

1. Paramétrez d'abord Bruno
   Téléchargez [bruno](https://www.usebruno.com/) puis charger la collection dans `backend/apiDoc`.

EN COURS, Chargement depuis ORVAL

## Développement

- Lancer le backend dans un terminal `pnpm dev:be`
- Lancer le front office dans un autre terminal `pnpm dev:fo`

### Mailhog

Nous utilisons [Mailhog](https://github.com/axllent/mailhog) pour intercepter les mails envoyés par l'application.
Aller sur docker desktop, cliquer sur `mailhog` et ouvrez `http://localhost:8025` dans votre navigateur.

## Tests

Pour lancer les tests :

- Tests backend `pnpm test:be`
- Tests back-office `pnpm test:bo`
- Tests front-office `pnpm test:fo`
