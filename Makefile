# Treat all targets as phony - https://stackoverflow.com/q/44492805
.PHONY: *
MAKEFLAGS += --always-make

help:
	@echo
	@echo "Usage: make [target]"
	@echo
	@echo "--- Developing ---"
	@echo " * local-setup              install the local server dependencies and setup the db"
	@echo " * local-run                run local server"
	@echo " * local-scratch            run the scratch file"
	@echo
	@echo "--- Database ---"
	@echo " * db-clear                 clears the non-user tables of a database"
	@echo " * db-testdata              seed a database with test data"
	@echo " * db-drop-local            drop the local database and start again"
	@echo " * db-migrate               apply schema migrations to a database"
	@echo " * db-browse                open prisma studio to browse a database"
	@echo " * db-etl-eqdkp             ETL data from EQ DKP into a database"
	@echo
	@echo "--- Utilities ---"
	@echo " * app-version              get project version"
	@echo " * pre-commit               run pre-commit hooks"
	@echo
	@echo "--- Testing ---"
	@echo " * test                     run tests with interactive CLI"
	@echo
	@echo "--- Deploying ---"
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

local-run:
	@docker-compose up -d
	@docker-compose run --rm wait-for-postgres
	@$(nvm) && yarn run dotenv concurrently --kill-others-on-fail --prefix command --prefix-colors auto \
		"prisma generate --watch --schema=./prisma/schema" \
		"prisma generate --watch --schema=./prisma/eqdkp/schema.prisma" \
		"next dev --turbo" \

local-scratch:
	@yarn run dotenv tsx ./src/test/scratch.ts

# ---- Data Migrations ----
db-drop-local:
	@docker-compose down
	@docker volume rm dkp_postgres_data
	@docker-compose up -d
	@make db-migrate

db-clear:
	@yarn run dotenv tsx ./prisma/dataMigrations/clear/run.ts

db-testdata:
	@yarn run dotenv tsx ./prisma/dataMigrations/testdata/run.ts

db-etl-eqdkp:
	@yarn run dotenv tsx ./prisma/dataMigrations/eqdkp/run.ts

# --- Utilities ---

db-migrate:
	@yarn prisma migrate dev

db-browse:
	@npx prisma studio

app-version:
	@./bin/get-version.sh

pre-commit:
	@yarn run concurrently --group --kill-others-on-fail --prefix command --prefix-colors auto \
		"next lint" \
		"prisma validate --schema=./prisma/schema" \
		"prisma validate --schema=./prisma/eqdkp/schema.prisma" \
		"prettier --write --check ." \
		"prisma format" \
		"tsc --noEmit"
# --- Testing ---

test:
	@npx playwright install --with-deps chromium
	@yarn run dotenv playwright test --ui

# --- Deployment ---

build:
	@yarn run prisma generate --schema=./prisma/schema
	@yarn run prisma generate --schema=./prisma/eqdkp/schema.prisma
	@yarn run prisma migrate deploy --schema=./prisma/schema
	@yarn run next build

