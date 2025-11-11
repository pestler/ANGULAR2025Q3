# Smart Home UI

[Live Demo](https://smart-home-ui-pestler2025.netlify.app/)

This project is an implementation of a Smart Home UI using Angular. It is a task from the Rolling Scopes School.

## Project Structure

The project is divided into three parts:

- **Part 1: Initial Setup**
  - Focuses on the basic UI structure.
  - Involves creating a dashboard with hardcoded data.
  - Includes theme switching (light/dark).
  - The main goal is to build the initial layout and components.

- **Part 2: Authentication and API Integration**
  - Implements user authentication (login/logout).
  - Integrates with a backend API to fetch dynamic data for dashboards.
  - Introduces routing for different pages (login, dashboard).
  - Uses an HTTP interceptor to handle API requests and authentication tokens.
  - Adds a 404 page.

- **Part 3: Real-time Updates and Settings**
  - Implements real-time updates for device states using WebSockets.
  - Adds a settings page with:
    - Theme switcher (persisted in `localStorage`).
    - Language switcher (English/Russian, persisted in `localStorage`).
    - A button to clear all application data.

## Features

- Dashboard with smart home devices
- Control and monitor devices
- Real-time updates using WebSockets
- User authentication (login/logout)
- Theme switching (light/dark)
- Language switching (English/Russian)
- Settings page to manage application preferences
- Responsive design

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
