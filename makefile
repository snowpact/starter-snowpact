#!make
include .env

DOCKER_COMPOSE  = docker-compose
USER =  --user $$(id -u):$$(id -g)
DOCKER_COMPOSE_RUN  = $(DOCKER_COMPOSE) run $(USER)

POSTGRES_CONTAINER = postgres
REDIS_CONTAINER = redis
ADMIN_DATABASE_CONTAINER = adminer
MAILHOG_CONTAINER = mailhog

MAIN_CONTAINERS =  $(REDIS_CONTAINER) $(POSTGRES_CONTAINER) $(MAILHOG_CONTAINER) $(ADMIN_DATABASE_CONTAINER)

##
## -------------------------
## | Dev                    |
## -------------------------
##

##
## -- DOCKER MANAGER --
##


.PHONY: init
init: pull ## init all project
	
.PHONY: pull
pull: ## Download the latest version of the images
	$(DOCKER_COMPOSE) pull
	
.PHONY: start-containers
start-containers: ## Start the backend containers
	$(DOCKER_COMPOSE) up --remove-orphans $(MAIN_CONTAINERS)

.PHONY: stop-containers
stop: ## Stop all the containers
	$(DOCKER_COMPOSE) stop

##
## -- Manage web services --
##

.PHONY: start-back
start-back: ## Start the backend containers
	$(DOCKER_COMPOSE) up --remove-orphans $(MAIN_CONTAINERS) -d
	pnpm dev:be
	
.PHONY: start-front
start-front: ## Start the frontend containers
	pnpm dev:fe

.PHONY: build-back
build-back: ## Build the backend
	pnpm build:be

.PHONY: build-front
build-front: ## Build the frontend
	pnpm build:fe

.PHONY: start-build-back
start-build-back: ## Start the backend containers and build the backend
	pnpm start:be

##
## -- DATABASE --
##

.PHONY: db-drop
db-drop: ## drop the database
	$(DOCKER_COMPOSE_RUN) --rm $(BACK_CONTAINER) pnpm typeorm:drop

.PHONY: db-migration-generate
db-migration-generate: ## generate migration, put YOUR_NAME in this command to custom the migration name
	$(DOCKER_COMPOSE) up --remove-orphans $(MAIN_CONTAINERS) -d
	pnpm migration:generate ./src/infrastructure/database/migrations/$(filter-out $@,$(MAKECMDGOALS))
	pnpm lint:fix ./src/infrastructure/database/migrations/*.ts

.PHONY: db-migration-run
db-migration-run: ## run migrations for dev database
	XXXX

.PHONY: db-revert-run
db-revert-run: ## revert migrations for dev database
	XXXX

.PHONY: db-fixtures-load
db-fixtures-load: ## load fixtures
	XXXX

.PHONY: db-fixtures-clear-load
db-fixtures-clear-load: ## load fixtures
	XXXX

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~ AUTO-DOCUMENTED HELP ~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ARGS = $(filter-out $@,$(MAKECMDGOALS))
.DEFAULT_GOAL := help   # Show help without arguments
SPACE  = 40             # Space before description
%:                      # Recipe generate AGRS
	@:
help:                   # Recipe generate help with double hash prefix
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-${SPACE}s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help
##
