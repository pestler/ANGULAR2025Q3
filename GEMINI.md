# Gemini Project Context: SmartHomeUi

## Project Overview

This is an Angular web application named **SmartHomeUi**. It is built and managed within an **Nx workspace**.

The primary purpose of this application is to provide a user interface for a smart home system, allowing users to monitor and control various devices.

### Key Technologies

- **Framework:** Angular
- **Workspace Management:** Nx
- **State Management:** NgRx
- **UI Components:** Angular Material
- **Styling:** SCSS
- **Linting:** ESLint for TypeScript, Stylelint for SCSS
- **Formatting:** Prettier
- **Testing:** Karma and Jasmine for unit tests.

## Building and Running

The following scripts are available in `package.json` to manage the application lifecycle.

### Development Server

To start the local development server:

```bash
npm start
```

This command uses `nx serve` and makes the application available at `http://localhost:4200/`.

### Build

To build the application for production:

```bash
npm run build
```

This command uses `nx build` and places the output in the `dist/` directory.

### Testing

To run the unit tests:

```bash
npm test
```

This command executes the tests using `nx test`.

## Development Conventions

The project enforces a consistent code style and quality through a combination of tools and pre-commit hooks.

### Linting

- **TypeScript:** Run `npm run lint` to check all TypeScript files using ESLint.
- **SCSS:** Run `npm run stylelint` to check all stylesheet files using Stylelint.

### Formatting

- **Prettier:** Run `npm run format` to automatically format all supported file types.

### Pre-commit Hooks

The project uses **Husky** and **lint-staged**. Before any commit, the following actions are automatically performed on the staged files:

1.  **Prettier** formats the code.
2.  **ESLint** checks and fixes TypeScript files.
3.  **Stylelint** checks and fixes SCSS files.

This ensures that all code committed to the repository adheres to the defined quality standards.
