# [DKP](https://dkp-cc05.fly.dev/)

## Development

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  yarn docker
  ```

  > **Note:** The script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial database setup:

  ```sh
  yarn setup
  ```

- Prepare environment variables:

  ```sh
  cp .env.example .env
  ```

  > **Note:** You will need to retrieve the Discord client secret from the codebase maintainers, or set up your own Discord App and change the client ID.

- Run the first build:

  ```sh
  yarn build
  ```

- Start dev server:

  ```sh
  yarn dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

Deployments are managed by [Fly.io](https://fly.io/). There are two deployments:

- Staging: [dkp-cc05-staging](https://fly.io/apps/dkp-cc05-staging)
- Production: [dkp-cc05](https://fly.io/apps/dkp-cc05)

## GitHub Actions

We use GitHub Actions for continuous integration and deployment.

- Anything that gets into the `main` branch will be deployed to [production](https://dkp-cc05.fly.dev/) after running tests/build/etc.
- Anything in the `dev` branch will be deployed to [staging](https://dkp-cc05-staging.fly.dev/).

### Secrets

To set a secret, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Log in to Fly

  ```sh
  fly auth signup
  ```

- Set the secret in the respective app (dkp-cc05 or dkp-cc05-staging):

  ```sh
  fly secrets set VARIABLE_NAME=VARIABLE_VALUE --app APP_NAME
  ```

## Testing

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `yarn typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `yarn format` script you can run to format all files in the project.
