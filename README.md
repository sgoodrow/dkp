# [Castle DKP][prod]

A web application for DKP, built with React, NextJS, TypeScript and Material UI.

- [Castle DKP](#castle-dkp)
  - [Development](#development)
    - [Contributing guidelines](#contributing-guidelines)
    - [Local development environment](#local-development-environment)
    - [Running the app](#running-the-app)
    - [Debugging the app](#debugging-the-app)
    - [Running the tests](#running-the-tests)
    - [Linting, formatting and pre-commit checks](#linting-formatting-and-pre-commit-checks)
    - [Dependency management](#dependency-management)
    - [Migrations](#migrations)
    - [Secrets](#secrets)
  - [Deployment](#deployment)
  - [Technologies](#technologies)

## Development

The majority of commands or scripts you may need to invoke should be available from the project's Makefile. To see a list of available commands, run `make help`.

### Contributing guidelines

This project makes an effort to follow a number of conventions to facilitate development and maintenance. See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for more info.

### Local development environment

To initialize your development environment:

```bash
# Install nvm
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Use the required version
nvm install
nvm use

# Install local dependencies
make local-setup
```

Before running the app, you will need to make a copy of [`.env.example`](./.env.local.example) named `.env` and provide appropriate values for the fields marked `CHANGE_ME`.

### Running the app

By default, the app runs locally against a local postgres database.

```bash
make local-run
```

The application will be available at [localhost:3000](http://localhost:3000).

After logging in, you may want to seed the database with some useful defaults by running:

```bash
make db-testdata
```

### Debugging the app

There are two easy ways to run the app with an attached debugger.

1. **Browser Debugger** If you wish to debug the client, you can drop the `debugger` keyword into any client code and Chrome will interpret the keyword as a break-point. You can use Chrome as your debugging environment.
2. **VSCode Debugger** If you wish to debug the server (or client), you can use the provided VSCode launch.json configuration. Select the `Run and Debug` side-bar item and click play. Add break-points where desired.

### Running the tests

TODO: Write some tests.

Playwright is used for browser-based tests.

```bash
make test
```

### Linting, formatting and pre-commit checks

[husky][husky] is used to automatically format code using a pre-commit git hook, which runs every time you run `git commit`.

### Dependency management

This project uses `yarn`.

Dependencies used for release are specified in `package.json` under the `dependencies` section. All other dependencies are specified under the `devDependencies` section.

### Migrations

This project uses `prisma`.

To generate a migration, add, remove or edit model files in `prisma/schema` and then run `make db-migrate`.

### Secrets

To run locally, the app requires some secrets to be injected from environment variables. Specify them in `.env` file. See the `.env.example` file for details.

## Deployment

A/B GPT is deployed via Vercel.

Deployment configuration is [here][deploy].

## Technologies

The core technologies used in this application are:

| **Library**              | **Description**                                                 |
| ------------------------ | --------------------------------------------------------------- |
| [Typescript][typescript] | Strongly typed language with JavaScript transpiler              |
| [NextJS][nextjs]         | Opinionated web framework to simplify dev, build & test tooling |
| [React][react]           | Library for building user interfaces                            |
| [tRPC][trpc]             | Library for typesafe API                                        |
| [Prisma][prisma]         | ORM for managing database migrations                            |
| [Material UI][mui]       | Design system implementation                                    |
| [Playwright][playwright] | Library for writing and running tests                           |

[prod]: https://castledkp.vercel.app/
[typescript]: https://www.typescriptlang.org
[nextjs]: https://nextjs.org/
[react]: https://reactjs.org/
[mui]: https://mui.com/components
[playwright]: https://playwright.dev/
[nvmsh]: https://github.com/nvm-sh/nvm#deeper-shell-integration
[husky]: https://typicode.github.io/husky/
[prisma]: https://www.prisma.io/
[deploy]: https://vercel.com/sgoodrows-projects/castledkp
[trpc]: https://trpc.io/
