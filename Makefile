# Treat all targets as phony - https://stackoverflow.com/q/44492805
.PHONY: *
MAKEFLAGS += --always-make

help:
	@echo
	@echo "Usage: make [target]"
	@echo
	@echo "--- Developing ---"
	@echo " * local-setup              install the local server dependencies"
	@echo " * local-run                run local server"
	@echo " * local-db-reset-total     reset all tables of the local database"
	@echo " * pre-commit               run pre-commit hooks"
	@echo
	@echo "--- Data Migrations ---"
	@echo " * db-init                  initialize a database"
	@echo " * db-reset                 reset the non-user tables of a database"
	@echo " * db-testdata              seed a database with test data"
	@echo " * db-reset-testdata        reset the non-user tables of a database and seed with test data"
	@echo
	@echo "--- Utilities ---"
	@echo " * db-migrate               migrate the local database"
	@echo " * db-browse                open prisma studio"
	@echo " * app-version              get project version"
	@echo
	@echo "--- Testing ---"
	@echo " * test                     run tests with interactive CLI"
	@echo
	@echo "--- Deployment ---"
	@echo " * build                    build the application"


# --- Environment---

# use Bash with brace expansion
.SHELLFLAGS = -cB
SHELL = /bin/bash

# Try to only define variables below that are used by multiple targets or that provide globally relevant context

# The project version - read from pyproject.toml
export RELEASE_ARTIFACT_VERSION := $(shell ./bin/get-version.sh)

# The short sha of the current commit - fail silently we're outside of a dev/ci env where git is installed
export RELEASE_ARTIFACT_COMMIT_SHORT_SHA := $(shell git rev-parse --short HEAD 2>/dev/null)

# Release image tag - e.g. "2.0.0-abcdef"
# This identifies the image in the registry and in our deployments - human readable and unique
export RELEASE_ARTIFACT_TAG := $(RELEASE_ARTIFACT_VERSION)-$(RELEASE_ARTIFACT_COMMIT_SHORT_SHA)

define nvm
    source $(NVM_DIR)/nvm.sh && nvm use
endef

# --- Developing ---

local-setup:
	@npm install yarn --location=global
	@yarn set version classic
	@yarn install
	@docker-compose up -d
	@docker-compose run --rm wait-for-postgres
	@make db-migrate
	@make db-reset

local-run:
	@docker-compose up -d
	@docker-compose run --rm wait-for-postgres
	@$(nvm) && yarn run dotenv concurrently --kill-others-on-fail --prefix command --prefix-colors auto \
		"prisma generate --watch --schema=./prisma/schema/schema.prisma" \
		"prisma generate --watch --schema=./prisma/eqdkp/schema.prisma" \
		"next dev --turbo" \

local-db-reset-total:
	@docker-compose down
	@docker volume rm dkp_postgres_data
	@docker-compose up -d
	@make db-migrate
	@make db-init

pre-commit:
	@yarn run concurrently --group --kill-others-on-fail --prefix command --prefix-colors auto \
		"next lint" \
		"prisma validate --schema=./prisma/schema/schema.prisma" \
		"prisma validate --schema=./prisma/eqdkp/schema.prisma" \
		"prettier --write --check ." \
		"prisma format" \
		"tsc --noEmit"

# ---- Data Migrations ----
db-init:
	@yarn run dotenv tsx ./prisma/dataMigrations/initDb/run.ts

db-reset:
	@yarn run dotenv tsx ./prisma/dataMigrations/resetDb/run.ts

db-testdata:
	@yarn run dotenv tsx ./prisma/dataMigrations/testdata/run.ts

db-reset-testdata:
	@make db-reset
	@make db-testdata

db-etl-eqdkp:
	@yarn run dotenv tsx ./prisma/dataMigrations/eqdkp/run.ts

# --- Utilities ---

db-migrate:
	@yarn prisma migrate dev


db-browse:
	@npx prisma studio

app-version:
	@./bin/get-version.sh

# --- Testing ---

test:
	@npx playwright install --with-deps chromium
	@yarn run dotenv playwright test --ui

# --- Deployment ---

build:
	@yarn run prisma generate
	@yarn run prisma migrate deploy
	@yarn run next build

