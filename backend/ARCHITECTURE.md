# Principes d'Architecture

Notre application est structurée en trois groupements principaux :

1. **Couches Internes**

   - Domaine
   - Application

2. **Couches Externes**

   - Entrypoint
   - Gateways
   - Infrastructure

3. **Couche Transversale**
   - Configuration
   - Injection de dépendances
   - Tests
   - Utilitaires

L'architecture vise à séparer les responsabilités, faciliter les tests et favoriser la réutilisation du code.

## Description des Couches et Règles

### 1. Couche Domaine

La couche domaine est la couche la plus interne de notre application et doit être indépendante de toutes les autres couches.

**Composition :**

- **Entités** : Objets principaux de notre application, contenant à la fois des données et des méthodes de logique métier.
- **Interfaces** : Contrats entre les couches internes et externes, utilisés par la couche application pour interagir avec les services externes.

**Règles :**

- Ne doit dépendre d'aucune dépendance externe.
- Peut être utilisée par n'importe quelle autre couche.

### 2. Couche Application

La couche `application` orchestre les actions métier de notre application.

**Composition :**

- **UseCases** : Méthodes qui orchestrent les actions métier.
- **Services** : Logique métier réutilisable regroupée par thème.
- **Erreurs** : Définitions d'erreurs spécifiques au métier.

**Règles :**

- Peut utiliser les `entités` et `interfaces` du `domaine`.
- Ne doit pas être appelée par la couche `gateway`.
- Ne peut appeler les couches externes que via les `interfaces du domaine`, et uniquement pour la couche `gateway`.
- Peut être appelée par la couche `entrypoint`.

### 3. Couche Gateway

La couche `gateway` interagit avec les services externes tels que les bases de données, les services d'e-mail, les variables d'environnement, etc.

**Composition :**

- Implémentations des **interfaces** du domaine.

**Règles :**

- Ne doit dépendre que de la couche domaine.
- Peut être appelée par toutes les couches sauf la couche domaine.
- Doit adhérer aux contrats définis par les interfaces du domaine.

### 4. Couche Entrypoint

La couche `entrypoint` sert de point d'entrée pour notre application, gérant les appels externes tels que les requêtes API, les jobs, les websockets, etc.

**Règles :**

- Peut dépendre de toutes les autres couches.
- Ne peut être appelée par aucune autre couche.

### 5. Couche Infrastructure

La couche `infrastructure` gère les dépendances externes telles que les bases de données, les services d'e-mail, les variables d'environnement, etc. Ces éléments ne sont pas directement interfacés avec les couches internes à notre application.

**Règles :**

- Ne doit dépendre que de la couche domaine.
- Peut être appelée par les couches `entrypoint` et `gateway`.

### 6. Couche Configuration

La couche `configuration` gère les paramètres à l'échelle de l'application.

**Règle :**

- Peut être appelée par toutes les autres couches.

## Flux de Contrôle

Le flux de contrôle général dans l'application est :

`Entrypoint` -> `Application` -> `Gateways`

Cette architecture assure une séparation claire des responsabilités, favorise la testabilité et maintient une structure propre et modulaire pour l'application.
